import Grade from "./grade.model.js";

const notFound = (msg = "Grade not found") => Object.assign(new Error(msg), { status: 404 });
const badRequest = (msg)                   => Object.assign(new Error(msg), { status: 400 });
const conflict   = (msg)                   => Object.assign(new Error(msg), { status: 409 });

const ALLOWED_UPDATE_FIELDS = ["studentCount", "sanitizer.lowThreshold"];

class GradeService {
    async createGrade(schoolId, count) {
        if (!count || count < 1 || count > 13) {
            throw badRequest("Grade number must be between 1 and 13");
        }

        const existingGrades = await Grade.find({ school: schoolId })
            .select("gradeNumber");

        if (NumbersToCreate.length === 0) {
            throw conflict(
                "All grades from 1 to 13 already exist for this school"
            );
        }
            const gradeDocs = numbersToCreate.map((num) => ({
                gradeNumber: num,
                school: schoolId,
            }));

            const createdGrades = await Grade.insertMany(gradeDocs, {ordered: false });

            return {
                created: createdGrades.map((g) => g.gradeNumber),
                skipped: existingNumbers.filter((num) => num <= count),
                total: createdGrades.length,
            };
            }

            async getGrades(schoolId) {
                const grades = await Grade.find({school: schoolId, isActive: true})
                    .populate("classTeacher", "name email")
                    .sort({gradeNumber: 1});

                return grades;
            }

            async getGradeById(schoolId, gradeId) {
                const grade = await Grade.findOne({_id: gradeId, school: schoolId })
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

        }

        export default new GradeService();
