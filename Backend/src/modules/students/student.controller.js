import { Student } from "./student.model.js";
import { Quiz } from "../quiz/quiz.model.js"
import { Classroom } from "../classrooms/classroom.model.js";


//get all students
export const getAllStudents = async (req, res) => {
    try {

        //fetch classroom to check teacher
        const classroom = await Classroom.find({teacherId: req.user.id});
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
export const addStudent = async(req, res) =>{

      const {regNo, name, classroomId} = req.body;

    

    try{

        //fetch classroom to check teacher
        const classroom = await Classroom.findById(classroomId);
        if (!classroom) return res.status(404).json({ message: "Classroom not found" });

        if (classroom.teacherId.toString() !== req.user.id) {
            return res.status(403).json({ message: "Not authorized to add student to this classroom" });
        }

         const student = await Student.create({regNo, name,classroomId});
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
             student = await Student.findById(id);
                 
              if (!student) return res.status(404).json({ message: "student not found" });

              //fetch classroom to check teacher
                const classroom = await Classroom.findById(student.classroomId);
                if (!classroom) return res.status(404).json({ message: "Classroom not found" });

                 if (classroom.teacherId.toString() !== req.user.id) {
                 return res.status(403).json({ message: "Not authorized to add student to this classroom" });
                }

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

             if (classroom.teacherId.toString() !== req.user.id) {
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

                const studentId = req.user.id; // from authMiddleware
                const student = await Student.findById(studentId);
                if (!student) return res.status(404).json({ message: "Student not found" });
                
                const classroomId = student.classroomId;//get the id from populated
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

                return res.status(200).json({ quiz});

            }catch (error) {
              res.status(500).json({ message: error.message });
            }
};

       
 
