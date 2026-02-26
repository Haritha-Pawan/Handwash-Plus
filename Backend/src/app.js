import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.js';
import classroomRoutes from './modules/classrooms/classroom.routes.js';
import studentRoutes from './modules/students/student.routes.js';
import quizRoutes from './modules/quiz/quiz.routes.js';
import ClassroomBottles from './modules/classroomBottles/classroomBottles.routes.js';
import postRoutes from './modules/post/post.routes.js';
import userRoutes from './modules/users/user.routes.js';
import mongoose from 'mongoose';
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connection.once("open", () => {
  console.log("Connected to DB:", mongoose.connection.name);
});


app.get('/', (req, res) => {
  res.json({ message: 'Handwash+ Backend Running ' });
});
// auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/classrooms",classroomRoutes);
app.use("/api/classroomsBottles",ClassroomBottles);
app.use("/api/students",studentRoutes);
app.use("/api/quiz",quizRoutes);
// post Routes
app.use("/api/posts", postRoutes);
// user Routes
app.use("/api/users", userRoutes);



export default app;