const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    minlength: 1,
  },
  content: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
    minlength: 1,
  },
});

const Posts = mongoose.model("Posts", postSchema);

module.exports = Posts;
