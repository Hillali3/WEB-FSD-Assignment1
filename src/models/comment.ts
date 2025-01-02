import mongoose, { Document, Schema } from 'mongoose';

// Define the Comment interface
export interface Comment extends Document {
  postId: mongoose.Schema.Types.ObjectId;
  userId: mongoose.Schema.Types.ObjectId;
  text: String;
  creationDate: Date;
}

// Define the Comment schema
const commentSchema: Schema = new Schema({
  postId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Post',
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  text: { 
    type: String, 
    required: true 
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Comment model
const Comment = mongoose.model<Comment>('Comment', commentSchema);
export default Comment;
