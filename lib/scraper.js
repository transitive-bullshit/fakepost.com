module.exports = TopTwitterUsersScraper

var RateLimiter = require('limiter').RateLimiter
var request     = require('request')
var cheerio     = require('cheerio')

var request     = require('request')
var async       = require('async')
var fs          = require('fs')

require('http').globalAgent.maxSockets = 25

function TopTwitterUsersScraper () {
  var self = this

  // default rate limit
  self.limiter = new RateLimiter(16, 'second')
}

TopTwitterUsersScraper.prototype.get = function (url, cb) {
  var self = this

  self.limiter.removeTokens(1, function () {
    console.log(url)

    request(url, function (err, resp, body) {
      if (err) {
        cb(err)
      } else {
        cb(null, cheerio.load(body))
      }
    })
  })
}

TopTwitterUsersScraper.prototype.run = function (cb) {
  var self = this
  cb = cb || function () { }

  var pages = [
    'http://twittercounter.com/pages/100/0',
    'http://twittercounter.com/pages/100/100',
    'http://twittercounter.com/pages/100/200',
    'http://twittercounter.com/pages/100/300',
    'http://twittercounter.com/pages/100/400',
    'http://twittercounter.com/pages/100/500',
    'http://twittercounter.com/pages/100/600',
    'http://twittercounter.com/pages/100/700',
    'http://twittercounter.com/pages/100/800',
    'http://twittercounter.com/pages/100/900'
  ]
  var users = []

  async.eachSeries(pages, function (url, cb) {
    self.get(url, function (err, $) {
      if (err) {
        console.log(err, url)
        return cb()
      }

      $('#leaderboard li').each(function (_, el) {
        var $el = $(el)

        var avatar = $el.find('.avatar').attr('src')
        if (!!avatar) {
          users.push({
            image: avatar,
            fullname: $el.find('.name').text(),
            username: $el.find('.uname').text().substring(1)
          })
        }
      })

      cb()
    })
  }, function (err) {
    if (!err) {
      console.log(users)
    }

    fs.writeFileSync('./lib/users.js', 'module.exports = ' + JSON.stringify(users, null, 2))
    cb(err)
  })
}

var client = new TopTwitterUsersScraper()
client.run()

