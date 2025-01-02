import bcrypt from "bcryptjs";
import { Request, Response } from "express";
import User from "../models/user";
import {
  generateAccessToken,
  generateRefreshToken,
  getUserFromToken,
} from "../utils/jwtUtils";

// User Registration
export const register = async (req: Request, res: Response) => {
  const { username, name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, name, email, password: hashedPassword });

    // Generate JWT tokens
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.tokens = [refreshToken];
    await user.save();
    const userId = user._id;

    res.status(201).json({
      message: "User registered successfully",
      accessToken,
      refreshToken,
      userId,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// User Login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password as string);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    if (user.tokens == null) user.tokens = [refreshToken];
    else user.tokens.push(refreshToken);

    await user.save();

    res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Refresh Token
export const refreshToken = async (req: Request, res: Response) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const user = await getUserFromToken(token);
    if (!user || !user.tokens.includes(token)) {
      return res.status(403).json({ message: "Invalid request" });
    }

    const accessToken = generateAccessToken(user._id);
    const newRefreshToken = generateRefreshToken(user._id);

    user.tokens[user.tokens.indexOf(token)] = newRefreshToken;

    await user.save();
    res.status(200).json({ accessToken, refreshToken: newRefreshToken });
  } catch (error) {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};
