const express = require('express')
const router = express.Router()
const User = require('../models/User')


router.get('/users', async (req, res) => {
  try {
    const allUsers = await User.find()
    res.json(allUsers)
  } catch (error) {
    console.log(error)
  }
})
router.get('/friends/:id',async (req, res) => {
  const currentUserId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId).populate('friends.user')
    if (!currentUser) {
      return res.status(404).json({ message: 'User not found' })
    }
    const arrayOfFriendUsers = currentUser.friends
    .filter((friend) => friend.status === 'friend') // Use filter to select friends with status 'friend'
    .map((friend) => friend.user);
    // console.log("arrayOfFriendUsers : ", arrayOfFriendUsers)
    res.json(arrayOfFriendUsers)
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error fetching friends' })
  }
})

router.post('/friends/add', async (req, res) => {
  const { requester, recipient, action } = req.body;

  try {
    const userRequester = await User.findById(requester).populate('friends.user');
    const userRecipient = await User.findById(recipient).populate('friends.user');

    if (!userRequester || !userRecipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    let recipientStatus;
    let requesterStatus;

    if (action === 'add') {
      recipientStatus = 'incomingRequest';
      requesterStatus = 'outgoingRequest';
    } else {
      recipientStatus = 'friend';
      requesterStatus = 'friend';
    }

    // Check if the users are already friends
    const isAlreadyFriendRequester = userRequester.friends.find(
      (friend) => friend.user._id.toString() === recipient
    );

    const isAlreadyFriendRecipient = userRecipient.friends.find(
      (friend) => friend.user._id.toString() === requester
    );

    if (!isAlreadyFriendRequester) {
      // Add the friend entry for the requester
      userRequester.friends.push({ user: recipient, status: requesterStatus });
    } else {
      // Update the status of the existing entry
      isAlreadyFriendRequester.status = requesterStatus;
    }

    if (!isAlreadyFriendRecipient) {
      // Add the friend entry for the recipient
      userRecipient.friends.push({ user: requester, status: recipientStatus });
    } else {
      // Update the status of the existing entry
      isAlreadyFriendRecipient.status = recipientStatus;
    }

    // Save the user documents with the updated friends arrays
    await userRequester.save();
    await userRecipient.save();

    res.status(200).json({ message: 'Request has been sent' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error adding friends' });
  }
});

router.post('/friends/accept', async (req, res) => {

})

router.post('/friends/remove', async (req, res) => {
  const { friendId, userId } = req.body
  try {
    const currentUser = await User.findById(userId)
    currentUser.friends = currentUser.friends.filter((friend) => friend.user._id.toString() !== friendId)

    const friend = await User.findById(friendId)
    friend.friends = friend.friends.filter((friend) => friend.user._id.toString() !== userId)

    await currentUser.save()
    await friend.save()
    
    res.status(200).json({ message: 'Friend removed successfully' })

    console.log("currentUser :", currentUser)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Internal Server Error', error })
  }
})

router.get('/friends/status/:id', async (req, res) => {
  const currentUserId = req.params.id
  try {
    const currentUser = await User.findById(currentUserId)
    .populate('friends.user')
    res.status(200).json({ message: 'User Status found', currentUser})
  } catch (error) {
    console.log(error)
  }
})

router.post('/friends/action', async (req, res) => {

})
router.get('/db', async (req, res) => {
  const allUsers = await User.find()
  res.send(allUsers)
  //await User.findById('651d7fd9b3774600eb04fb93')
  // const email = 'test@test.com'
  // const findEmail = await User.findOne({ email })
  // res.send(findEmail)
})
module.exports = router