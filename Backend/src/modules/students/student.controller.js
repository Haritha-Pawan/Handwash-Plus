import { Student } from "./student.model.js";


//get all students
export const getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().populate('classroomId', 'name'); //  populate
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
export const addStudent = async(req, res) =>{

    const {regNo, name, schoolId, classroomId} = req.body;

    

    try{
    const student = await Student.create({regNo, name, schoolId, classroomId});
    return res.status(200).json({student});  

    }catch(err){
        console.log(err);
        return res.status(500).json({ message: "Unable to add student" });
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
             student = await Student.findByIdAndUpdate(id,
                  { name },
                  { returnDocument: 'after', runValidators: true }
             );
              if (!student) return res.status(404).json({ message: "student not found" });
         return res.status(200).json({ student});
          }catch (err) {
         console.error(err);
         return res.status(500).json({ message: "Server error" });
     }
     };
 
     