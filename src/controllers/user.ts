import { Request, Response } from "express";
import User from "../models/user";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { sendError } from "../utils/sendError";

// Create a new user
export const createUser = async (req: Request, res: Response) => {
  const { username, name, email, password } = req.body;

  if (!username || !name || !email || !password) {
    return res
      .status(400)
      .json({ message: "username, name, email and password are required" });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const encryptedPAssword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      name,
      email,
      password: encryptedPAssword,
    });
    await newUser.save();
    return res.status(201).json(newUser);
  } catch {
    return sendError(res, "Fail registration");
  }
};
