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