import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';


import authRoutes from './modules/auth/auth.routes.js';
import postRoutes from './modules/post/post.routes.js';
import userRoutes from './modules/users/user.routes.js';
import schoolRoutes from './modules/schools/school.routes.js';
import worldBankRoutes from './modules/world-bank/world-bank.routes.js';


import gradeRouter from './modules/grades/grade.routes.js';










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
// post Routes
app.use("/api/posts", postRoutes);
// user Routes
app.use("/api/users", userRoutes);
// School Routes
app.use("/api/schools", schoolRoutes);
// World Bank Data Routes
app.use("/api/world-bank", worldBankRoutes);



app.use("/api/grades", gradeRouter);
app.use("/api/schools", schoolRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

app.use((err, req, res, next) => {
  // Log the full error in development so you can debug
  if (process.env.NODE_ENV === "development") {
    console.error("[ERROR]", err);
  }

  const statusCode = err.statusCode || 500;
  const message    = err.message    || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    // Only show stack trace in development — never expose it in production
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;