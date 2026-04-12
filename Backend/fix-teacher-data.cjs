const mongoose = require('mongoose');
const uri = 'mongodb+srv://crowdflow_db:crowdflow123+@cluster0.idairv9.mongodb.net/handwashPlus';

async function fixData() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const User = mongoose.connection.collection('users');
    const Classroom = mongoose.connection.collection('classrooms');

    // 1. Update user role
    const userUpdate = await User.updateOne(
      { email: 'lahieu123@gmail.com' },
      { $set: { role: 'teacher' } }
    );
    console.log('User role update result:', userUpdate);

    // 2. Assign classroom
    // We'll assign classroom '6A' (699c1b8f7d82290b85e8bdd9) to the teacher (69d6a27f1b5ed71f928c60d4)
    const classroomUpdate = await Classroom.updateOne(
      { _id: new mongoose.Types.ObjectId('699c1b8f7d82290b85e8bdd9') },
      { $set: { teacherId: new mongoose.Types.ObjectId('69d6a27f1b5ed71f928c60d4') } }
    );
    console.log('Classroom assignment result:', classroomUpdate);

    console.log('Data fix complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error during data fix:', err);
    process.exit(1);
  }
}

fixData();
