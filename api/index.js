require('dotenv').config()
const express = require('express')
const passport = require("passport")
const session = require('express-session')
const db = require('./db/connection')
const cors = require('cors')
const authRouter = require('./routes/auth')
const friendsRouter = require('./routes/friends')
const postsRouter = require('./routes/posts')
const cookieParser = require('cookie-parser')
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
  resave: false,
  saveUninititalized: false,
  cookie: {
   maxAge: 24 * 60 * 60 * 1000,
   secure: false,
  }
}))
app.use(passport.initialize())
app.use(passport.session())


app.use('/', authRouter)
app.use('/', friendsRouter)
app.use('/', postsRouter)

app.listen(4000, () => {console.log('server running on port 4000')})