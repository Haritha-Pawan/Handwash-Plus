import Grade from "./grade.model.js";
import School from "../schools/school.model.js";
import { sendSanitizerAlertWhatsApp } from "../../@core/lib/sms/sms.service.js";
import DistributedBottles from "../classroomBottles/distributedBottles.model.js";
import { Classroom } from "../classrooms/classroom.model.js";

const notFound = (msg = "Grade not found") => Object.assign(new Error(msg), { status: 404 });
const badRequest = (msg) => Object.assign(new Error(msg), { status: 400 });
const conflict = (msg) => Object.assign(new Error(msg), { status: 409 });

class GradeService {
  async createGrades(schoolId, count) {
    if (!count || count < 1 || count > 13) {
      throw badRequest("Grade number must be between 1 and 13");
    }

    const existingGrades = await Grade.find({ school: schoolId }).select("gradeNumber");
    const existingNumbers = existingGrades.map((g) => g.gradeNumber);

    const numbersToCreate = [];
    for (let i = 1; i <= count; i++) {
      if (!existingNumbers.includes(i)) {
        numbersToCreate.push(i);
      }
    }

    if (numbersToCreate.length === 0) {
      throw conflict(`All requested grades (1 to ${count}) already exist for this school`);
    }

    const gradeDocs = numbersToCreate.map((num) => ({
      gradeNumber: num,
      school: schoolId,
    }));

    const createdGrades = await Grade.create(gradeDocs);

    return {
      created: createdGrades.map((g) => g.gradeNumber),
      skipped: existingNumbers.filter((num) => num <= count),
      total: createdGrades.length,
    };
  }

  async addIndividualGrade(schoolId, params) {
    const { gradeNumber, studentCount, lowThreshold } = params;
    
    const existingGrade = await Grade.findOne({ school: schoolId, gradeNumber });
    if (existingGrade) {
      if (existingGrade.isActive) {
        throw conflict(`Grade ${gradeNumber} already exists in this school`);
      } else {
    
        existingGrade.isActive = true;
        if (studentCount !== undefined) {
          existingGrade.studentCount = studentCount;
        }
        if (lowThreshold !== undefined) {
          if (!existingGrade.sanitizer) {
            existingGrade.sanitizer = { currentQuantity: 0, status: "empty" };
          }
          existingGrade.sanitizer.lowThreshold = lowThreshold;
        }
        await existingGrade.save();
        return existingGrade;
      }
    }

    const gradeDoc = {
      gradeNumber,
      school: schoolId,
      ...(studentCount !== undefined && { studentCount }),
    };

    if (lowThreshold !== undefined) {
      gradeDoc.sanitizer = {
        lowThreshold,
        currentQuantity: 0,
        status: "empty"
      };
    }

    const newGrade = await Grade.create(gradeDoc);
    return newGrade;
  }

  async getGrades(schoolId) {
    const grades = await Grade.find({ school: schoolId, isActive: true })
      .populate("classTeacher", "name email")
      .sort({ gradeNumber: 1 });

    return grades;
  }

  async getGradeById(schoolId, gradeId) {
    const grade = await Grade.findOne({ _id: gradeId, school: schoolId })
      .populate("classTeacher", "name email")
      .populate("sanitizer.lastUpdatedBy", "name");

    if (!grade) throw notFound("Grade not found in your school");

    return grade;
  }

  async updateGrade(schoolId, gradeId, requestBody) {
    const updates = {};

    if (requestBody.studentCount !== undefined) {
      updates.studentCount = requestBody.studentCount;
    }

    if (requestBody.lowThreshold !== undefined) {
      updates["sanitizer.lowThreshold"] = requestBody.lowThreshold;
    }

    if (requestBody.currentQuantity !== undefined) {
      updates["sanitizer.currentQuantity"] = requestBody.currentQuantity;
    }

    if (Object.keys(updates).length === 0) {
      throw badRequest("No valid fields to update");
    }

    const updatedGrade = await Grade.findOneAndUpdate(
      { _id: gradeId, school: schoolId },
      { $set: updates },
      { returnDocument: 'after', runValidators: true }
    );

    if (!updatedGrade) throw notFound("Grade not found in your school");

    return updatedGrade;
  }

  async deactivateGrade(schoolId, gradeId) {
    const grade = await Grade.findOne({ _id: gradeId, school: schoolId });

    if (!grade) throw notFound("Grade not found in your school");

    if (!grade.isActive) {
      throw badRequest("This grade is already deactivated");
    }

    grade.isActive = false;
    await grade.save();

    return grade;
  }

  async distributeToClassrooms(schoolId, gradeId, bottlesPerClassroom, month, userId) {
    if (!bottlesPerClassroom || bottlesPerClassroom < 1) {
      throw badRequest("Bottles per classroom must be at least 1");
    }

    const grade = await Grade.findOne({
      _id: gradeId,
      school: schoolId,
      isActive: true,
    });

    if (!grade) {
      throw notFound("Active grade not found in your school");
    }

    const classrooms = await Classroom.find({
      schoolId: schoolId,
      grade: grade.gradeNumber,
    });

    if (!classrooms || classrooms.length === 0) {
      throw badRequest(`No classrooms found for Grade ${grade.gradeNumber}`);
    }

    const totalNeeded = bottlesPerClassroom * classrooms.length;
    const currentStock = grade.sanitizer?.currentQuantity ?? 0;

    if (currentStock < totalNeeded) {
      throw badRequest(
        `Insufficient sanitizer stock. Required: ${totalNeeded}, Available: ${currentStock}`
      );
    }

    for (const classroom of classrooms) {
      await DistributedBottles.findOneAndUpdate(
        {
          classroomId: String(classroom._id),
          month,
        },
        {
          $set: {
            classroomId: String(classroom._id),
            month,
            bottleDistributed: bottlesPerClassroom,
            distributedAt: new Date(),
          },
        },
        {
          returnDocument: 'after',
          upsert: true,
          runValidators: true,
        }
      );
    }

    grade.sanitizer.currentQuantity = currentStock - totalNeeded;
    grade.sanitizer.lastUpdatedBy = userId || null;
    grade.sanitizer.lastUpdatedAt = new Date();

    await grade.save();

    return {
      gradeNumber: grade.gradeNumber,
      month,
      bottlesPerClassroom,
      classroomsUpdated: classrooms.length,
      totalDeducted: totalNeeded,
      remainingGradeStock: grade.sanitizer.currentQuantity,
    };
  }

  async checkSanitizerAndAlert(schoolId) {
    // School lookup is best-effort — grades may exist even if the school
    // document was deleted or never created (data integrity mismatch).
    const school = await School.findById(schoolId).catch(() => null);
    const schoolName = school?.name || "Unknown School";

    const grades = await Grade.find({ school: schoolId, isActive: true });

    const summary = {
      empty: 0,
      critical: 0,
      low: 0,
      adequate: 0,
      alertSentViaSMS: false,
    };

    const criticalGrades = [];

    grades.forEach((grade) => {
      const status = grade.sanitizer.status;
      summary[status]++;

      if (status === "empty" || status === "critical") {
        criticalGrades.push(grade);
      }
    });

    if (criticalGrades.length > 0) {
      const adminPhone = process.env.ADMIN_PHONE_NUMBER;
      if (adminPhone) {
        try {
          await sendSanitizerAlertWhatsApp(adminPhone, schoolName, criticalGrades);
          summary.alertSentViaSMS = true;
        } catch (error) {
          console.error("[WhatsApp Service Error]", error);
        }
      }
    }

    return {
      schoolName,
      timestamp: new Date(),
      summary,
      details: grades.map((g) => ({
        gradeNumber: g.gradeNumber,
        status: g.sanitizer.status,
        quantity: g.sanitizer.currentQuantity,
        unit: g.sanitizer.unit,
      })),
    };
  }
}

export default new GradeService();