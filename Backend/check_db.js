import mongoose from 'mongoose';

(async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/handwashPlus');
    const db = mongoose.connection.db;
    const users = await db.collection('users').find({ role: { $ne: 'superAdmin' } }).limit(2).toArray();
    console.log(users);
    process.exit(0);
})();
