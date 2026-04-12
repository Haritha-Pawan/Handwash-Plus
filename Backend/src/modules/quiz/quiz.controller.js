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
        if (!classroomId || classroomId === "null" || !mongoose.Types.ObjectId.isValid(classroomId)) {
             return res.status(400).json({message:"Invalid classroomId"});
        }

        const classroom = await Classroom.findById(classroomId);

        if(!classroom){
             return res.status(404).json({message:"classroom not found"});
        }

        //check teacher is assign to the classsroom
       const teacherId = req.user.userId;

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
    type: q.type || "mcq"  // set default to 'mcq' to match model validator
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
//get quiz by id 

export const getQuizById = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id)
      .populate("classroomId", "name");

    if (!quiz) {
      return res.status(404).json({ message: "Quiz not found" });
    }

    res.status(200).json(quiz);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
//get quizzes by classroom

export const getQuizzesByClassroom = async(req, res) => {
    try{
    const { classroomId } = req.params;
       
    if (!classroomId || classroomId === "null" || !mongoose.Types.ObjectId.isValid(classroomId)) {
      return res.status(200).json([]);
    }

     // find classroom
    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      return res.status(404).json({ message: "Classroom not found" });
    }

       const quizzes = await Quiz.find({ classroomId })
      .populate("classroomId", "name") // populate classroom name
      .sort({ createdAt: -1 });

        res.status(200).json(quizzes);
    }catch(error){
         res.status(500).json({message:error.message});
    }
};


// update 
export const UpdateQuiz = async (req, res) => {
  try {
    const teacherId = req.user.userId;
    const { title, questions, startTime, endTime, isPublished } = req.body;

    const quiz = await Quiz.findById(req.params.id).populate('classroomId');
    if (!quiz) return res.status(404).json({ message: "Quiz not found" });

    // Teacher authorization check
    if (!quiz.classroomId || quiz.classroomId.teacherId.toString() !== teacherId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Validate publishing
    if (isPublished) {
      if (!startTime || !endTime) {
        return res.status(400).json({ message: "Start and End time required to publish" });
      }
      if (new Date(startTime) >= new Date(endTime)) {
        return res.status(400).json({ message: "End time must be after Start time" });
      }
    }

    // Update fields
    quiz.title = title || quiz.title;

    if (questions && Array.isArray(questions)) {
      quiz.questions = questions.map(q => ({
        questionText: q.questionText || "",
        options: Array.isArray(q.options) ? q.options.map(o => ({ text: o.text || "" })) : [{ text: "" }],
        correctAnswer: q.correctAnswer || "",
        type: q.type || "mcq"
      }));
    }

    if (startTime) quiz.startTime = new Date(startTime);
    if (endTime) quiz.endTime = new Date(endTime);
    if (typeof isPublished !== "undefined") quiz.isPublished = isPublished;

    await quiz.save();

    res.status(200).json({ message: "Quiz updated successfully", quiz });

  } catch (err) {
    console.error("UpdateQuiz Error:", err.message, err);
    res.status(500).json({ message: err.message });
  }
};

//delete quiz

export const deleteQuiz = async(req, res) =>{
    try{
        const quiz = await Quiz.findById(req.params.id).populate('classroomId');
        if(!quiz){
            return res.status(404).json({ message: "Quiz not found"});
        }
         const teacherId = req.user.userId;

        if (!quiz.classroomId|| quiz.classroomId.teacherId.toString() !== teacherId) {
        return res.status(403).json({ message: "Not authorized to delete this quiz" });
       } 

        await Quiz.findByIdAndDelete(req.params.id);

         res.status(200).json({message:"Quize deleted successfuly"});
   
        }catch(error){
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
  

};
