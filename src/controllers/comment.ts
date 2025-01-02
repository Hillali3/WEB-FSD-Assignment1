import { Request, Response } from "express";
import Comment from "../models/comment";
import Post from "../models/post";
import User from "../models/user";

// Create a new comment
export const createComment = async (req: Request, res: Response) => {
  const { postId, userId, text } = req.body;
  if (!postId || !userId || !text) {
    return res
      .status(400)
      .json({ message: "PostId, UserId, and text are required" });
  }

  try {
    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const newComment = new Comment({
      postId,
      userId,
      text,
    });

    await newComment.save();

    return res.status(201).json(newComment);
  } catch (error) {
    return res.status(500).json({ message: "Error creating comment", error });
  }
};
