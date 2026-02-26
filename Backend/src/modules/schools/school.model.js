import mongoose from 'mongoose';



const Schoolschema = new mongoose.Schema({
    name:{type:String,required:true,unique:true},
    address:{type:String,required:true},
    district:{type:String,required:true},
    city:{type:String,required:true},
    lat:{type:Number,required:true},
    lng:{type:Number,required:true},
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    createdAt:{type:Date,default:Date.now},
    updatedAt:{type:Date,default:Date.now}
},{timestamps:true});

const School = mongoose.model('School',Schoolschema);

export default School;
