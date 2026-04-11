import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

(async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;
        
        // Find the first school
        const school = await db.collection('schools').findOne({});
        if (!school) {
            console.log("No schools found to link.");
            process.exit(1);
        }

        // Update a test user
        const result = await db.collection('users').updateOne(
            { email: 'sadeepa@gmail.com' },
            { $set: { school: school._id } }
        );

        console.log(`Updated user sadeepa@gmail.com with school ID: ${school._id}`);
        console.log(`Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);

    } catch (e) {
        console.error(e);
    } finally {
        process.exit(0);
    }
})();
