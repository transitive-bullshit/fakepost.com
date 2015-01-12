
var Twitter   = require('twitter')
var topUsers  = require('../lib/users')
var models    = require('../lib/models')
var FakeTweet = models.FakeTweet

module.exports = function (app) {
  var client = new Twitter({
    'consumer_key': process.env.TWITTER_KEY,
    'consumer_secret': process.env.TWITTER_SECRET
  })

  app.get('/api/twitter/tweet/:id', function (req, res) {
    FakeTweet.findById(req.params.id, function (err, doc) {
      if (err) {
        res.status(500).send(err).end()
      } else {
        res.status(200).json(doc).end()
      }
    })
  })

  app.get('/api/twitter/users/show/:username', function (req, res) {
    client.get('/users/show', {
      'screen_name': req.params.username
    }, function (err, result) {
      if (err) {
        res.status(404).send(err).end()
      } else {
        res.status(200).json(result).end()
      }
    })
  })

  app.get('/api/twitter/users.json', function (req, res) {
    res.status(200).json(topUsers).end()
  })
}

