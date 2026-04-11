import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const schools = await db.collection('schools').find({}).toArray();
        console.log("Schools in DB:");
        console.log(schools.map(s => ({ name: s.name, id: s._id })));
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
})();
