import DistributedBottles from "./distributedBottles.model.js";
import ClassroomBottles from "./classroomBottles.model.js";


export const updateClassroomBottles = async(req,res) =>{
    const {classroomId,month,bottleUsed} = req.body;
    //const  teacherId = req.user.id; // auth middleware

    try{
        //fetch distributed bottles from principlas table
        const distributed = await DistributedBottles.findOne({classroomId,month});

        if (!distributed){
            return res.status(404).json({message:"No distributed bottle for the classroom"});
        }

        //validate bottleused
        if(bottleUsed> distributed.bottleDistributed){
              return res.status(404).json({message:"Bottles used can not be exceed the distributed bottles"});
        }

        //calculate remaining bottles
           const bottleRemaining=  distributed.bottleDistributed - bottleUsed;

           //update 

           const record = await ClassroomBottles.findOneAndUpdate(
            {classroomId,month},
            {bottleUsed,bottleRemaining,updatedAt: new Date()},
            {new:true,runValidators:true,upsert: true}
           );
       return res.status(200).json({ ClassroomBottles: record });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};


//get classroombottlesByclassroomId

export const getClassroomBottlesByClassroomId = async(req,res) =>{

    try{
        const{classroomId} = req.params;

        //fetch classroom bottles for that classroom
        const records = await ClassroomBottles.find({classroomId});

        if(!records || records.length === 0){
             return res.status(404).json({message:"No classroom bottles found for this  classroom"});
        }

               return res.status(200).json({ ClassroomBottles: records});
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Server error" });

    }
};
