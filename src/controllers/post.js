const Posts = require("../models/post.js");
const mongoose = require('mongoose');

const createPost = async (req, res) => {
  const { title, content, sender } = req.body;

  if (!title || !content || !sender) {
    return res
      .status(400)
      .json({ message: "Title, content and sender are required" });
  }

  try {
    const post = await Posts.create({
      title,
      content,
      sender,
    });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).send("Error creating post", error);
  }
};

const getPostById = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const post = await Posts.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ message: "Error fetching post", error });
  }
};

const getPosts = async (req, res) => {
  try {
    if (req.query.sender) {
      posts = await Posts.find({ sender: req.query.sender });
    } else {
      posts = await Posts.find();
    }
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: "Error fetching Posts", error });
  }
};

const updatePost = async (req, res) => {
  const id = req.params.id;
  const { title, content, sender } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  if (!title && !content && !sender) {
    return res
      .status(400)
      .json({ message: "Title, content or sender are required" });
  }

  try {
    const updatedPost = await Posts.findByIdAndUpdate(
      id,
      { title, content, sender },
      { new: true }
    );
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: "Error updating post", error });
  }
};

const deletePost = async (req, res) => {
  const id = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }

  try {
    const post = await Posts.findByIdAndDelete(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting post", error });
  }
};

module.exports = { createPost, getPosts, getPostById, updatePost, deletePost };
