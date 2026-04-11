import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        const u = await db.collection('users').findOne({ 'school': { '$regex': 'buffer' } });
        console.log(u);
    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
})();
