require('dotenv').config()
const express = require('express')
const passport = require("passport")
const session = require('express-session')
const db = require('./db/connection')
const cors = require('cors')
const authRouter = require('./routes/auth')
const usersRouter = require('./routes/users')
const postsRouter = require('./routes/posts')
const cookieParser = require('cookie-parser')
const path = require('path')

const multer = require('multer')
const User = require('./models/User')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const date = Date.now();
    const newFileName = `${date}${originalName}`;

    cb(null, newFileName);
  }
})

const upload = multer({storage: storage})

const app = express()

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000'
}))
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninititalized: true,
  cookie: {
   maxAge: 24 * 60 * 60 * 1000,
   secure: false,
  }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use('/images', express.static('images'))

app.use('/', authRouter)
app.use('/', usersRouter)
app.use('/', postsRouter)

app.post('/upload', upload.single('image'), async (req, res) => {
  console.log(req.file.filename, req.body.userId)
  try {
    const userId = req.body.userId
    const filename = req.file.filename
    const user = await User.findById(userId)

    user.image = filename

    await user.save()

    res.status(200).json({ message: 'Profile picture update successfuly', image: filename })
  } catch (error) {
    console.error('Error updating profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }

})

app.listen(4000, () => {console.log('server running on port 4000')})