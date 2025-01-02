import { Request, Response } from "express";
import Post from "../models/post";
import User from "../models/user";
import mongoose from "mongoose";

// Create a new post
export const createPost = async (req: Request, res: Response) => {
  const { userId, title, content } = req.body;

  if (!userId || !title || !content) {
    return res
      .status(400)
      .json({ message: "UserId, title and content are required" });
  }

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid userId" });
  }

  try {
    const newPost = new Post({ userId, title, content });
    await newPost.save();
    return res.status(201).json(newPost);
  } catch (error) {
    return res.status(500).json({ message: "Error creating post", error });
  }
};
