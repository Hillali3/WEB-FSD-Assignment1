const Comment = require('../models/comment');
const mongoose = require("mongoose");

// GET all comments
const getComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching comments', error });
  }
};

// GET comment by ID
const getCommentById = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }
    
    try {
      const comment = await Comment.findById(id);
      if (!comment) {
        return res.status(404).json({ message: 'Comment not found' });
      }
      res.status(200).json(comment);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching comment', error });
    }
};

// CREATE a new comment
const createComment = async (req, res) => {
  const { content, author } = req.body;
  
  try {
    const newComment = new Comment({
      content,
      author,
    });
  
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ message: 'Error creating comment', error });
  }
};

// UPDATE a comment by ID
const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content, author } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid id" });
  }
  
  try {
    const updatedComment = await Comment.findByIdAndUpdate(
      id,
      { content, sender: author },
      { new: true }
    );
    if (!updatedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json(updatedComment);
  } catch (error) {
    res.status(500).json({ message: 'Error updating comment', error });
  }
};

// DELETE comment by ID
const deleteComment = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedComment = await Comment.findByIdAndDelete(id);
    if (!deletedComment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    res.status(200).json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting comment', error });
  }
};

module.exports = { 
  getComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment
}; 