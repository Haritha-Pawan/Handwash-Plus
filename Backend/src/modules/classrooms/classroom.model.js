import mongoose from "mongoose";
const Schema = mongoose.Schema;

const classroomSchema = new Schema({
       name:{
            type:String,
            required:true,
       },
       grade:{
            type:Number,
            required:true,
       },
       schoolId:{
            type:mongoose.Schema.Types.ObjectId,
            ref: 'School',
            required:true,
       },
       teacherId:{
            type:mongoose.Schema.Types.ObjectId,
            ref:'User',
            required:true,
       }
});
export const Classroom = mongoose.model("Classroom", classroomSchema);
//module.exports = mongoose.model("classroom.model",classroomSchema)