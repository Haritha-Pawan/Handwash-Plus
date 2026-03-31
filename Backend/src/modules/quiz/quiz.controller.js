import { Quiz } from "./quiz.model.js";
import { Classroom} from "../classrooms/classroom.model.js";
import mongoose from "mongoose";

//create quiz

export const createQuiz = async (req,res) =>{
    try{

        const {title, classroomId, questions, startTime, endTime, isActive } = req.body;

        //validation
        if(!title || !classroomId || ! questions || questions.length == 0){
            return res.status(400).json({message:"All fields are required"});
        }

        //find classroom
        const classroom = await Classroom.findById(classroomId);

        if(!classroom){
             return res.status(404).json({message:"classroom not found"});

        }

        //check teacher is assign to the classsroom
        const teacherId = req.user ? req.user.id : "699fe963fac309cee0d145a8";

         if (classroom.teacherId.toString() !== teacherId) {
         return res.status(403).json({ message: "This teacher is not assigned to the classroom" });
         }
        //create quiz

        const quiz = await Quiz.create({
            title,
            classroomId,
            teacherId: classroom.teacherId,
            questions: questions.map(q => ({
             ...q,
    type: q.type || "multiple-choice"  // set default if missing
        })),
        startTime: startTime ? new Date(startTime) : undefined,
      endTime: endTime ? new Date(endTime) : undefined,
      isPublished: typeof isActive !== "undefined" ? isActive : false,
        });

        res.status(201).json({
            message:"Quiz created successfuly",
            quiz
        });
    }catch (error){
        res.status(500).json({ message: error.message });
    }
};

// get quizzes by classroom

export const getQuizzesByClassroom = async(req, res) => {
    try{
         const { classroomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(classroomId)) {
      return res.status(400).json({ message: "Invalid classroomId" });
    }
       const quizzes = await Quiz.find({ classroomId: req.params.classroomId })
      .populate("classroomId", "name") // populate classroom name
      .sort({ createdAt: -1 });

        res.status(200).json(quizzes);
    }catch(error){
         res.status(500).json({message:error.message});
    }
};

// Update quiz
export const UpdateQuiz = async(req, res) =>{
    try{
        const {title, questions,isPublished, startTime, endTime } = req.body;
        const quiz = await Quiz.findById(req.params.id).populate('classroomId');
        
       // check teachers authorization
         if (!quiz.classroomId|| quiz.classroomId.teacherId.toString() !== req.user.id) {
         return res.status(403).json({ message: "Not authorized" });
         }
       

        //validation
         if (isPublished) {
            if (!startTime || !endTime) {
                return res.status(400).json({
                    message: "Start time and end time are required to publish quiz"
                });
            }

            if (new Date(startTime) >= new Date(endTime)) {
                return res.status(400).json({
                    message: "End time must be after start time"
                });
            }
        }


         quiz.title = title || quiz.title;
         quiz.questions = questions || quiz.questions;
         
         if (typeof isPublished !== "undefined") {
            quiz.isPublished = isPublished;
        }

        if (startTime) quiz.startTime = startTime;
        if (endTime) quiz.endTime = endTime;

         await quiz.save();
         return res.status(200).json({ message: "Quiz updated" ,quiz});
    }catch(err){
        return res.status(500).json({ message: err.message });
    }
};


//delete quiz

// export const deleteQuiz = async(req, res) =>{
//     try{
//         const quiz = await Quiz.findById(req.params.id).populate('classroomId');
//         if(!quiz){
//             return res.status(404).json({ message: "Quiz not found"});
//         }
//         const teacherId = req.user.id;

//         if (!quiz.classroomId|| quiz.classroomId.teacherId.toString() !== req.user.id) {
//         return res.status(403).json({ message: "Not authorized to delete this quiz" });
//        } 

//         await Quiz.findByIdAndDelete(req.params.id);

//          res.status(200).json({message:"Quize deleted successfuly"});
   
//         }catch(error){
//         console.error(error);
//         res.status(500).json({ message: "Server error" });
//     }
  

// };
export const deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    await Quiz.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Quiz deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};