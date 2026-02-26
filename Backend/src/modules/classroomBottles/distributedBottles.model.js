import mongoose from "mongoose";

const Schema = mongoose.Schema;

const distributedBottleSchema = new Schema({
    classroomId: {
        type: String,
        required: true,
    },
    month: {
        type: String,
        required: true,
    },
    bottleDistributed: {
        type: Number,
        required: true,
        default: 0,
    },
    distributedAt: {
        type: Date,
        default: Date.now,
    }
});

export default mongoose.model("DistributedBottles", distributedBottleSchema);