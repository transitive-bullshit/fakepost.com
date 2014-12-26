
var querystring = require('querystring')
var through = require('through')
var webshot = require('webshot')

module.exports = function (app) {
  // use phantomjs to take a screenshot of a fake social network post
  app.post('/api/screenshot', function (req, res) {
    var network = req.body.network
    var width   = req.body.width
    var height  = req.body.height
    var params  = req.body.params
    params.screenshot = true

    if (network === 'twitter') {
      var url = req.protocol + '://' + req.get('host') + '/twitter/create?' + querystring.stringify(params)

      webshot(url, {
        windowSize: {
          width: width,
          height: height
        },
        streamType: 'png'
      }, function (err, renderStream) {
        var bufs = []
        function data (buf) {
          bufs.push(buf)
        }

        function end () {
          res.status(200).send(bufferToDataURL(Buffer.concat(bufs), 'image/png')).end()
        }

        if (err) {
          res.status(500).send(err).end()
        } else {
          renderStream.pipe(through(data, end))
        }
      })
    } else {
      res.status(400).send('invalid network').end()
    }
  })

  function bufferToDataURL (buffer, type) {
    return 'data:' + type + ';base64,' + buffer.toString('base64')
  }
}

