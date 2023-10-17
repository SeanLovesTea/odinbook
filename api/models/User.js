const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({   
  username:{
    type: String,
    unique: true,
    required: true,
  },
  email:{
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: false
  },
  password:{
    type: String,
    required: false
  },
  facebook:{
    id: String ,
    token: String ,
    name: String ,
  },
  profile: {
    work: String,
    study: String,
    address: String,
    member: String,
  },
  friends: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      status: {
        type: String,
        enum: ['friend', 'incomingRequest', 'outgoingRequest', 'deletedRequest' ]
      }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("User", UserSchema);