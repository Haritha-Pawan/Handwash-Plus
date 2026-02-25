import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import authRoutes from './modules/auth/auth.routes.js';
import classroomRoutes from './modules/classrooms/classroom.routes.js';
import studentRoutes from './modules/students/student.routes.js';
import quizRoutes from './modules/quiz/quiz.routes.js';
import ClassroomBottles from './modules/classroomBottles/classroomBottles.routes.js';
const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.json({ message: 'Handwash+ Backend Running ' });
});

app.use("/api/auth", authRoutes);
app.use("/api/classrooms",classroomRoutes);
app.use("/api/classroomsBottles",ClassroomBottles);
app.use("/api/students",studentRoutes);
app.use("/api/quiz",quizRoutes);



export default app;