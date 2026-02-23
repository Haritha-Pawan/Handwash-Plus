import { Classroom } from "./classroom.model.js";

//data display
export const getAllClassrooms = async (req, res) => {
    try {
        const classrooms = await Classroom.find().populate('teacherId', 'name email'); // optional populate
        if (!classrooms || classrooms.length === 0) {
            return res.status(404).json({ message: "Classrooms not found" });
        }
        return res.status(200).json({ classrooms });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};

//data insert
export const addClassroom = async(req, res) =>{

    const {name,grade,schoolId,teacherId} = req.body;

    

    try{
const classroom = await Classroom.create({name,grade,schoolId,teacherId});
    return res.status(200).json({classroom});  
    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Unable to add classroom" });
    }

   

}