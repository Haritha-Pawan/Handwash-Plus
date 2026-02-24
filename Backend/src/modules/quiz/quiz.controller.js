import { Quiz } from "./quiz.model.js";
import { Classroom} from "../classrooms/classroom.model.js";

//create quiz

export const createQuiz = async (req,res) =>{
    try{

        const {title, classroomId, teacherId, questions } = req.body;

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
         if (classroom.teacherId.toString() !== teacherId) {
         return res.status(403).json({ message: "This teacher is not assigned to the classroom" });
         }
        //create quiz

        const quiz = await Quiz.create({
            title,
            classroomId,
            teacherId,
            questions
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
        const quizzes = await Quiz.find({
            classroomId: req.params.classroomId
        }).sort({createdAt: -1});

        res.status(200).json(quizzes);
    }catch(error){
         res.status(500).json({message:error.message});
    }
};