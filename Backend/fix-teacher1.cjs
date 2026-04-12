const mongoose = require('mongoose');
const uri = 'mongodb+srv://crowdflow_db:crowdflow123+@cluster0.idairv9.mongodb.net/handwashPlus';

async function fixTeacher1Data() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    const User = mongoose.connection.collection('users');
    const Classroom = mongoose.connection.collection('classrooms');

    const teacher = await User.findOne({ email: 'teacher1@gmail.com' });
    if (!teacher) {
        console.error('Teacher1 user not found!');
        process.exit(1);
    }
    const teacherId = teacher._id;

    // 1. Assign Classroom 6A (699c1b8f7d82290b85e8bdd9) to teacher1
    const class1 = await Classroom.updateOne(
        { _id: new mongoose.Types.ObjectId('699c1b8f7d82290b85e8bdd9') },
        { $set: { teacherId: teacherId } }
    );
    console.log('Assigned 6A to teacher1:', class1);

    // 2. Assign another classroom if available
    const otherClass = await Classroom.findOne({ teacherId: { $ne: teacherId } });
    if (otherClass) {
        const class2 = await Classroom.updateOne(
            { _id: otherClass._id },
            { $set: { teacherId: teacherId } }
        );
        console.log(`Assigned classroom ${otherClass.name} to teacher1:`, class2);
    }

    // 3. Ensure both roles are 'teacher'
    await User.updateOne({ email: 'teacher1@gmail.com' }, { $set: { role: 'teacher' } });
    await User.updateOne({ email: 'lahieu123@gmail.com' }, { $set: { role: 'teacher' } });

    console.log('All data fixes complete!');
    process.exit(0);
  } catch (err) {
    console.error('Error during data fix:', err);
    process.exit(1);
  }
}

fixTeacher1Data();
