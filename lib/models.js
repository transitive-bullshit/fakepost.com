
var mongoose = require('mongoose')

var FakeTweet = mongoose.model('FakeTweet', {
  image: { type: String, require: true },

  username: { type: String },
  fullname: { type: String },
  avatar: { type: String },
  verified: { type: String },
  retweets: { type: String },
  favorites: { type: String },
  status: { type: String },
  timestamp: { type: String },

  created: { type: Date, default: Date.now },

  __v: { type: Number, select: false }
})

module.exports = {
  FakeTweet: FakeTweet
}

