import jwt from "jsonwebtoken";

// Load environment variables
import dotenv from "dotenv";
import User from "../models/user";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET as string;

// Generate Access Token
export const generateAccessToken = (userId: any): string => {
  return jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
