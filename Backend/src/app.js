import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';

import authRoutes from './modules/auth/auth.routes.js';
import postRoutes from './modules/post/post.routes.js';
import userRoutes from './modules/users/user.routes.js';
import schoolRoutes from './modules/schools/school.routes.js';





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



export default app;