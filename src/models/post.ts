import mongoose, { Document, Schema } from 'mongoose';

// Define the Post interface
export interface Post extends Document {
  userId: mongoose.Schema.Types.ObjectId;
  title: String;
  content: String;
  creationDate: Date;
}

// Define the Post schema
const postSchema: Schema = new Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  title: { 
    type: String,
    required: true 
  },
  content: { 
    type: String,
    required: true 
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
});

// Create and export the Post model
const Post = mongoose.model<Post>('Post', postSchema);
export default Post;