import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionText:{
        type: String,
        required: true,
        
    },
    type:{
        type:String,
        required: true
    },
    options: [{
       text:{ type: String},
       Votes:{ type: Number}
    }],
    
     correctAnswer:{
        type: String,
        required: function(){
            return this.type ==="mcq" || this.type === "truefalse";
        },

        minRating: { type: Number, default: 1 },   
        maxRating: { type: Number, default: 5 }
     }

    
});

const quizSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
     classroomId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Classroom",
        required: true
     },
    teacherId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
     },
     questions:{
        type: [questionSchema],
        validate: [arrayLimit,"Quiz must contain at least one quection"]
     },
     isPublished:{
        type: Boolean,
        default: false
     }, 
     startTime: Date,
     endTime: Date
},{timestamps: true});

function arrayLimit(val){
    return val.length >0;
}

export const Quiz = mongoose.model("Quiz", quizSchema);
