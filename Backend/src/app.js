import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import swaggerUi from 'swagger-ui-express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './modules/auth/auth.routes.js';
import classroomRoutes from './modules/classrooms/classroom.routes.js';
import studentRoutes from './modules/students/student.routes.js';
import quizRoutes from './modules/quiz/quiz.routes.js';
import ClassroomBottles from './modules/classroomBottles/classroomBottles.routes.js';
import postRoutes from './modules/post/post.routes.js';
import userRoutes from './modules/users/user.routes.js';
import schoolRoutes from './modules/schools/school.routes.js';
import worldBankRoutes from './modules/world-bank/world-bank.routes.js';
import gradeRouter from './modules/grades/grade.routes.js';
import schoolRouter from './modules/schools/school.routes.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();



app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger UI - Load from YAML files
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(null, {
  explorer: true, // Enable the search bar and top bar
  swaggerOptions: {
    urls: [
      { url: '/swagger.yaml', name: 'Main API' },
      { url: '/swagger-grades.yaml', name: 'Grades API' }
    ],
    persistAuthorization: true,
  },
}));

// Serve the Main Swagger YAML file
app.get('/swagger.yaml', (req, res) => {
  res.setHeader('Content-Type', 'application/yaml');
  res.sendFile(path.join(__dirname, '../docs/api/swagger.yaml'));
});

// Serve the Grades Swagger YAML file
app.get('/swagger-grades.yaml', (req, res) => {
  res.setHeader('Content-Type', 'application/yaml');
  res.sendFile(path.join(__dirname, '../docs/api/swagger-grades.yaml'));
});

mongoose.connection.once("open", () => {
  console.log("Connected to DB:", mongoose.connection.name);
});


app.get('/', (req, res) => {
  res.json({ message: 'Handwash+ Backend Running ', docs: '/api-docs' });
});

// auth Routes
app.use("/api/auth", authRoutes);
app.use("/api/classrooms", classroomRoutes);
app.use("/api/classroomsBottles", ClassroomBottles);
app.use("/api/students", studentRoutes);
app.use("/api/quiz", quizRoutes);
// post Routes
app.use("/api/posts", postRoutes);
// user Routes
app.use("/api/users", userRoutes);
// School Routes

app.use("/api/schools", schoolRoutes);
// World Bank Data Routes
app.use("/api/world-bank", worldBankRoutes);
// Grade Routes
app.use("/api/grades", gradeRouter);




app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {

  if (process.env.NODE_ENV === "development") {
    console.error("[ERROR]", err);
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,

    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;