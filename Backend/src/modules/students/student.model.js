import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    regNo:{
        type: String,
        required: true,
        unique: true
    },
    name:{
        type: String,
        required: true
    },
    
     classroomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true
     },
     pin:{
        type:String,
        required:true,
        unique:true,
        default: () => Math.floor(1000+Math.random() * 9000).toString() // generate 4 digit pin
     }
},{timestamps: true});

export const Student = mongoose.model("Student", studentSchema);