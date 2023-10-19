const express = require('express')
const router = express.Router()
const passport = require('passport')
const LocalStrategy = require('passport-local')
const FacebookStrategy = require('passport-facebook')
const db = require('../db/connection')
const User = require('../models/User')
const bcrypt = require('bcryptjs')

function isValidEmail(email) {
  const emailRegex = /^[A-Za-z0-9._%-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/;
  return emailRegex.test(email);
}
passport.use(new LocalStrategy(async function verify(username, password, done) {
  try {
    const user = await User.findOne({ username })
    if (!user) {
      return done(null, false, { message: 'Incorrect email' })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      console.log('pw no match')
      return done(null, false, { message: 'Incorrect Password'})
    }
    return done(null, user)
  } catch (error) {
    console.log(error)
  }
}))

// passport.use(new FacebookStrategy({
//   clientID: process.env.FACEBOOK_CLIENT_ID,
//   clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//   callbackURL: 'http://localhost:4000/return',
//   state: true
// }, async function verify(accessToken, refreshToken, profile, done) {

//   try {
//     const user = await User.findOne({ 'facebook.id': profile.id })

//     if (user) {
//       done(null, user)
//     } else { 

//       const newUser = new User({
//         username: profile.displayName,
//         password: '',
//         facebook: {
//           id: profile.id,
//           token: accessToken,
//           name: profile.displayName,
//           image: profile,
//         }
//       });

//       await newUser.save();
//       console.log('saving user...')
//       done(null, newUser);
//     }
//   } catch (error) {
//     console.log(error)
//     done(error)
//   }
// }))
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: 'http://localhost:4000/return',
  state: true
}, async function verify(accessToken, refreshToken, profile, done) {
  try {
    const user = await User.findOne({ 'facebook.id': profile.id });

    if (user) {
      done(null, user);
    } else {
      // Make a separate API request to fetch the profile picture URL from Facebook
      const pictureResponse = await fetch(`https://graph.facebook.com/v13.0/${profile.id}/picture?redirect=false&type=large`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (pictureResponse.status === 200) {
        const pictureData = await pictureResponse.json();
        console.log(pictureData)
        const newUser = new User({
          username: profile.displayName,
          password: '',
          facebook: {
            id: profile.id,
            token: accessToken,
            name: profile.displayName,
          },
          image: pictureData.data.url
        });

        await newUser.save();
        console.log('saving user...', newUser);
        done(null, newUser);
      } else {
        console.error('Failed to fetch profile picture');
        done(null, false);
      }
    }
  } catch (error) {
    console.log(error);
    done(error);
  }
}));


passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch(err) {
    done(err);
  };
});

router.post('/login', (req,res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Internal Error' })
    }
    if (!user) {
      return res.status(401).json({ success: false, message: info.message })
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err)
      }
      return res.json({
        success: true,
        user: {
          _id: user._id,
          username: user.username,
          test: user
        }})
    })
  })(req, res, next)
  
})

router.get('/login/facebook', passport.authenticate('facebook'))

router.get('/return', passport.authenticate('facebook', {
  successRedirect: 'http://localhost:3000',
  failureRedirect: 'http://localhost:3000/failure',
  failureMessage: 'facebook login failed',
  successMessage: 'facebook login successful'
}), (req, res) => {
  console.log('facebook done')
})

router.post('/logout', (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.clearCookie('connect.sid') 
    console.log('logged out')
    res.sendStatus(200)
  })
})

router.get('/profile', (req, res) => {
  console.log()
  if (req.isAuthenticated()) {
    res.json({ success: true, user: req.user })
  } else {
    res.json({ success: false, message: 'User failed auth'})
  }
})

router.post('/register', async (req, res, next) => {
  const { email, username, password, confirmPassword } = req.body

  if (!isValidEmail(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email'})
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message:'Password must be at least 8 characters long'})
  }
  if (password !== confirmPassword) {
    return res.status(400).json({ success: false, message: 'Passwords do not match'})
  }
  try {
    bcrypt.hash(password, 10, async (err, hashedPassword ) => {
      if (err) { console.log(err) }
      const newUser = await User.create({ email, username, password:hashedPassword })
    })
    console.log('user registered')
  } catch (error) {
    if (error) console.log(error, "user not registered")
  }
})


module.exports = router

