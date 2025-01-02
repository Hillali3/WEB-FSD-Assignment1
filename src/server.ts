import express, { Express } from 'express';
import postRoutes from './routes/post_route';
import commentRoutes from './routes/comment_route';
import userRoutes from './routes/user_route';
import authRoutes from './routes/auth_route';
import connectDB from './config/db';
import setupSwaggerDocs from './swagger';
import mongoose from 'mongoose';
require("dotenv").config();

export const app = express();
const port = process.env.PORT;

// Connect to MongoDB
connectDB();

// Middleware to parse JSON request body
app.use(express.json());

// Use Swagger docs
setupSwaggerDocs(app);

// Register routes
app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/comments', commentRoutes);
app.use('/users', userRoutes);

// Start the server
const initApp = () => {
  return new Promise<Express>((resolve, reject) => {
    if (!process.env.DATABASE_URL) {
      reject("DB_CONNECT is not defined in .env file");
    } else {
      mongoose
        .connect(process.env.DATABASE_URL)
        .then(() => {
          resolve(app);
        })
        .catch((error) => {
          reject(error);
        });
    }
  });
};

export default initApp;