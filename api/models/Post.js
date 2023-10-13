const mongoose = require('mongoose')
const Schema = mongoose.Schema

// Define a Comment schema
const CommentSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model for the author
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
})

// Define a Like schema
const LikeSchema = new Schema({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model for the user who liked the post
    required: true,
  },
})

// Define a Post schema
const PostSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Reference to a User model for the author
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  comments: [CommentSchema], // Array of Comment documents
  likes: [LikeSchema], // Array of Like documents
})

const Post = mongoose.model('Post', PostSchema)
module.exports = Post
