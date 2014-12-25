
var Twitter = require('twitter')

module.exports = function (app) {
  var client = new Twitter({
    'consumer_key': 'mEEbF3HaFoyIFS581PZHqDmRX',
    'consumer_secret': 'dqDdsaeT1whAQ10NSK8EK2AAK697dGWcppyIcwdzQcyxWb9DXn'
  })

  app.get('/api/twitter/post/:id', function (req, res) {
    // TODO
    res.status(500).send('TODO').end()
  })

  app.get('/api/twitter/users/lookup/:screen_names', function (req, res) {
    client.get('users/lookup', {
      screen_names: req.param.screen_names
    }, function (err, result) {
      if (err) {
        res.status(404).send(err).end()
      } else {
        res.status(200).json(result).end()
      }
    })
  })
}

