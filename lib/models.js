
var mongoose = require('mongoose')

var FakeTweet = mongoose.model('FakeTweet', {
  slug: { type: String, required: true, unique: true, index: true },

  __v: { type: Number, select: false }
})

module.exports = {
  FakeTweet: FakeTweet
}

