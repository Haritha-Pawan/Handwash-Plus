import { Student } from "./student.model.js";
import { Quiz } from "../quiz/quiz.model.js"
import { Classroom } from "../classrooms/classroom.model.js";
import mongoose from "mongoose";


//get all students
export const getAllStudents = async (req, res) => {
    try {
        const teacherId = req.user.userId; 
 
       const classroom = await Classroom.find({ teacherId });
        if (!classroom) return res.status(404).json({ message: "Classroom not found" });

        //extract  classsroomids
        const classroomIds = classroom.map(c=>c._id);

       //fetch students in those classroom
        const students = await Student.find({classroomId:{$in:classroomIds}}).populate('classroomId', 'name'); //  populate
        if (!students || students.length === 0) {
            return res.status(404).json({ message: "students not found" });
        }
        return res.status(200).json({ students });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


//student insert
export const addStudent = async (req, res) => {
  const teacherId = req.user?.id; 
  const { regNo, name } = req.body;

  try {
    const classroom = await Classroom.findOne({ teacherId });
    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found for this teacher" });
    }

    const student = await Student.create({
      regNo,
      name,
      classroomId: classroom._id,
    });

    return res.status(200).json({ student });
  } catch (err) {
    console.error("Add student error:", err);
    return res.status(500).json({ message: "Unable to add student", error: err.message });
  }
};

//get by id
   
 export const getById = async(req,res) =>{
     const id = req.params.id;

     let student;

     try{
        student = await Student.findById(id);
     }catch(err){
        console.log(err);
     }

     //no available student

     if(!student){
        return res.status(404).json({ message: "Student not found" });
     }
      return res.status(200).json({ student});
 };

 //update classroom details
 
     export const updateStudent = async(req,res) =>{
         const id = req.params.id;
 
          const {name} = req.body;
 
          let student;
 
          try{
             student = await Student.findById(id);
                 
              if (!student) return res.status(404).json({ message: "student not found" });

              //fetch classroom to check teacher
                const classroom = await Classroom.findById(student.classroomId);
                if (!classroom) return res.status(404).json({ message: "Classroom not found" });

                student.name = name || student.name;
                await student.save();

                return res.status(200).json({ student});
          }catch (err) {
               console.error(err);
               return res.status(500).json({ message: "Server error" });
          }
};

//Delete student
          export const deleteStudent = async(req,res) =>{
             const id = req.params.id;
     
             let student;
             try{
             student = await Student.findById(id)
     
             if (!student) return res.status(404).json({ message: "student unable to delete" });

             // check if logged teacher is assigned to this student's classroom
              const classroom = await Classroom.findById(student.classroomId);
              if (!classroom) return res.status(404).json({ message: "Classroom not found" });
              //hardcoded
               const teacherId = req.user?.id;

           //  if (classroom.teacherId.toString() !== req.user.id) {
           if (classroom.teacherId.toString() !== teacherId) {
                return res.status(403).json({ message: "Not authorized to delete this student" });
               }

                await Student.findByIdAndDelete(id);
             return res.status(200).json({ student});
     
             }catch (err) {
     
             console.error(err);
             return res.status(500).json({ message: "Server error" });
     
             } 
 };


 //get active quiz

     export const getActiveQuizForStudent = async(req,res) =>{
              
            try{
                const { classroomId } = req.body;//get the id from populated
                 const now = new Date();

                 const quiz = await Quiz.findOne({
                   classroomId,
                   isPublished: true,
                   startTime: { $lte: now },
                   endTime: { $gte: now }
                    });
             if (!quiz){
                 return res.status(404).json({ message:"No active quiz available"});

             }
               const studentQuiz = {
                 
                 title: quiz.title,
                 startTime: quiz.startTime,
                 endTime: quiz.endTime,
                 questions: quiz.questions.map(q => ({
                _id: q._id,
                 questionText: q.questionText,
                 type: q.type,
                 options: q.options.map(opt => ({
                  text: opt.text
        }))
      }))
    };
                return res.status(200).json({ studentQuiz});

            }catch (error) {
              res.status(500).json({ message: error.message });
            }
};

 export const getStudentsByClassroom = async (req, res) => {
  try {
    const { classroomId } = req.params;

    if (!classroomId || classroomId === "null" || !mongoose.Types.ObjectId.isValid(classroomId)) {
      return res.status(200).json({ students: [] });
    }

    const students = await Student.find({ classroomId });

    return res.status(200).json({ students });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

       
 
