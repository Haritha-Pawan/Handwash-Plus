import mongoose from 'mongoose';
import {databaseConfig} from '../../../config/database.config.js';

export const connectMongoDB = async()=>{
    try{
        await mongoose.connect(databaseConfig.uri,databaseConfig.options);
        console.log('Connected to MongoDB');
    }catch(error){
        console.error('Error connecting to MongoDB:',error);
    }
}