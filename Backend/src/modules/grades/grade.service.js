import Grade from "./grade.model.js";
import School from "../schools/school.model.js";
import { sendSanitizerAlertSMS } from "../../@core/lib/sms/sms.service.js";

const notFound = (msg = "Grade not found") => Object.assign(new Error(msg), { status: 404 });
const badRequest = (msg) => Object.assign(new Error(msg), { status: 400 });
const conflict = (msg) => Object.assign(new Error(msg), { status: 409 });

class GradeService {
    async createGrades(schoolId, count) {
        if (!count || count < 1 || count > 13) {
            throw badRequest("Grade number must be between 1 and 13");
        }

        const existingGrades = await Grade.find({ school: schoolId }).select("gradeNumber");
        const existingNumbers = existingGrades.map(g => g.gradeNumber);

        const numbersToCreate = [];
        for (let i = 1; i <= count; i++) {
            if (!existingNumbers.includes(i)) {
                numbersToCreate.push(i);
            }
        }

        if (numbersToCreate.length === 0) {
            throw conflict(
                `All requested grades (1 to ${count}) already exist for this school`
            );
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

        if (Object.keys(updates).length === 0) {
            throw badRequest("No valid fields to update");
        }

        const updatedGrade = await Grade.findOneAndUpdate(
            { _id: gradeId, school: schoolId },
            { $set: updates },
            { new: true, runValidators: true }
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

    async checkSanitizerAndAlert(schoolId) {
        // 1. Fetch school details (for school name)
        const school = await School.findById(schoolId);
        if (!school) throw notFound("School not found");

        // 2. Fetch all active grades
        const grades = await Grade.find({ school: schoolId, isActive: true });

        // 3. Generate summary counts
        const summary = {
            empty: 0,
            critical: 0,
            low: 0,
            adequate: 0,
            alertSentViaSMS: false,
        };

        const criticalGrades = [];

        grades.forEach((grade) => {
            const status = grade.sanitizer.status; // Uses virtual getter
            summary[status]++;

            if (status === "empty" || status === "critical") {
                criticalGrades.push(grade);
            }
        });

        // 4. Send SMS if needed
        if (criticalGrades.length > 0) {
            const adminPhone = process.env.ADMIN_PHONE_NUMBER;
            if (adminPhone) {
                try {
                    await sendSanitizerAlertSMS(adminPhone, school.name, criticalGrades);
                    summary.alertSentViaSMS = true;
                } catch (error) {
                    console.error("[SMS Service Error]", error);
                    // We don't throw here to ensure the report is still returned
                }
            }
        }

        return {
            schoolName: school.name,
            timestamp: new Date(),
            summary,
            details: grades.map(g => ({
                gradeNumber: g.gradeNumber,
                status: g.sanitizer.status,
                quantity: g.sanitizer.currentQuantity,
                unit: g.sanitizer.unit
            }))
        };
    }
}

export default new GradeService();
