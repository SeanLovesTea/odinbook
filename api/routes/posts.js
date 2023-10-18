const express = require('express')
const router = express.Router()
const User = require('../models/User')
const Post = require('../models/Post')

router.get('/posts', async (req, res) => {
  const allPosts = await Post.find()
  .populate('author')
  .populate({
    path: 'likes',
    populate: {
      path: 'author'
    }
  })
  res.send(allPosts)
})
router.post('/post/add',async (req, res) => {
  try {
    const { text, author } = req.body
    await Post.create({
    text,
    author,
  })
  res.status(200).json({ message: 'Post Added'})
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
router.get('/allposts', async (req, res) => {
  try {
    const allPosts = await Post.find()
    if (allPosts) {
      res.status(200).json(allPosts)
    } else {
      res.status(404).json({ message: 'posts not found'})
    }
    
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error' })
  }
  
})
router.get('/allposts/:id', async (req, res) => {
  try {
    const userId = req.params.id
    const userPosts = await Post.find({ author: userId })

    res.status(200).json({ message: 'User Posts found', data: userPosts })
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal server error' })
  }
})
router.post('/like', async (req, res) => {
  
  try {
    const { postId, currentUserId, like } = req.body
    const post = await Post.findById(postId)

    if (like) {
      post.likes = post.likes.filter((like) => like.author.toString() !== currentUserId)
      console.log('like removed')
      res.send({
        message: 'like removed',
        numberOfLikes:post.likes.length,
        like: false
      })
    } else {
      post.likes.push({ author: currentUserId})
      console.log('like added')
      res.send({
        message: 'like added',
        numberOfLikes:post.likes.length,
        like: true,
      })
    }
    await post.save()
  } catch (error) {
    console.log(error)
  }
})
router.post('/comment/add', async (req, res) => {
  try {
    const { text, commentAuthor, postId } = req.body
    const currentPost = await Post.findById(postId)
    if (currentPost) {
      currentPost.comments.push({
        text,
        author:commentAuthor
      })
      await currentPost.save()
      res.send({ message: 'comment saved' })
    } else {
      console.log('post not found')
      res.send({ message: 'Post not found'})
    }
  } catch (error) {
    console.log(error)
    res.send({ message: 'There was an error saving comment' })
  }
})
router.get('/comments/:id', async (req, res) => {
  try {
    const currentPost = await Post.findById(req.params.id)
    .populate({
      path: 'comments',
      populate: {
        path: 'author',
      },
    })
    if (currentPost) {
      const commentsArray = currentPost.comments
      res.send(commentsArray)
    } else {
      res.send({ message: 'post not found'})
    }  
  } catch (error) {
    console.log(error)
  }
})
router.get('/db', async (req, res) => {
  const allPosts = await User.find()
  res.send(allPosts)
  //await User.findById('651d7fd9b3774600eb04fb93')
  // const email = 'test@test.com'
  // const findEmail = await User.findOne({ email })
  // res.send(findEmail)
})
module.exports = router