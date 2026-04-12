import DistributedBottles from "./distributedBottles.model.js";
import ClassroomBottles from "./classroomBottles.model.js";
import {Classroom} from "../classrooms/classroom.model.js";
import mongoose from "mongoose";

export const updateClassroomBottles = async(req,res) =>{
    const {classroomId,month,bottleUsed} = req.body;
     const teacherId = req.user.userId;
    try{
        if (!classroomId || classroomId === "null" || !mongoose.Types.ObjectId.isValid(classroomId)) {
            return res.status(400).json({ message: "Invalid classroomId" });
        }

        const classroom = await Classroom.findById(classroomId);

        //fetch classroom to check techer
        if(!classroom){
            return res.status(404).json({ message: "Classroom not found" });
        }

        //check loged teacher is assign teacher
        if (classroom.teacherId.toString() !== teacherId) {
            return res.status(403).json({ message: "Not authorized to update this classroom bottles" });
        }

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
            {returnDocument: "after", runValidators: true, upsert: true}
           );
       return res.status(200).json({ ClassroomBottles: record });
    }catch(err){
        console.error(err);
        return res.status(500).json({ message: "Server error" });
    }
};



//getclassrooms bottles by id
export const getClassroomBottlesByClassroomId = async (req, res) => {
  try {
    const { classroomId } = req.params;

    if (!classroomId || classroomId === "null" || !mongoose.Types.ObjectId.isValid(classroomId)) {
        return res.status(200).json({ ClassroomBottles: [] });
    }

    //  Get ALL distributed bottles 
    const distributedRecords = await DistributedBottles.find({ classroomId });

    if (!distributedRecords || distributedRecords.length === 0) {
      return res.status(404).json({
        message: "No distributed bottles found for this classroom",
      });
    }

    //  Get classroom usage records
    const classroomRecords = await ClassroomBottles.find({ classroomId });

    //  Merge data
    const result = distributedRecords.map((dist) => {
      const match = classroomRecords.find(
        (c) => c.month === dist.month
      );

      if (match) {
        return {
          month: dist.month,
          bottleDistributed: dist.bottleDistributed,
          bottleUsed: match.bottleUsed,
          bottleRemaining: match.bottleRemaining,
        };
      } else {
        return {
          month: dist.month,
          bottleDistributed: dist.bottleDistributed,
          bottleUsed: 0,
          bottleRemaining: dist.bottleDistributed,
        };
      }
    });

    return res.status(200).json({ ClassroomBottles: result });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};
