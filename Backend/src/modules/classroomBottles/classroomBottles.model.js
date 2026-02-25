import mongoose from "mongoose";
const Schema = mongoose.Schema;

const classroomBottleSchema = new Schema({
    classroomId:{
        type: String,
        required:true,
    },
    month: {
        type: String,
        required:true,
    },
     bottleUsed: {
        type: Number,
        required:true,
        default: 0,
    },
    bottleRemaining:{
        type: Number,
        required:true,
        default: 0,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("ClassroomBottles",classroomBottleSchema)