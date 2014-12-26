
var querystring = require('querystring')
var webshot     = require('webshot')
var Q           = require('q')
var models      = require('../lib/models')
var FakeTweet   = models.FakeTweet

var AWS         = require('aws-sdk')
var s3Stream    = require('s3-upload-stream')(new AWS.S3())

module.exports = function (app) {
  AWS.config.update({
    region: process.env.AWS_S3_REGION
  })

  // use phantomjs to take a screenshot of a fake social network post
  app.post('/api/screenshot', function (req, res) {
    var network = req.body.network
    var width   = req.body.width
    var height  = req.body.height
    var params  = req.body.params
    var url
    params.screenshot = true

    if (network === 'twitter') {
      url = req.protocol + '://' + req.get('host') + '/twitter/create?' + querystring.stringify(params)
    } else {
      res.status(400).send('invalid network').end()
      return
    }

    console.log('URL', url)
    webshot(url, {
      windowSize: {
        width: width,
        height: height
      },
      streamType: 'png'
    }, function (err, renderStream) {
      if (err) {
        res.status(500).send(err).end()
      } else {
        uploadImageStreamToS3(renderStream, generateS3Key('png'))
          .then(function (url) {
            delete params.screenshot
            var doc

            if (network === 'twitter') {
              doc = new FakeTweet(params)
            }

            console.log('DOC', url)
            doc.image = url
            doc.save(function (err, doc) {
              if (err) {
                res.status(500).send(err).end()
              } else {
                res.status(200).json(doc).end()
              }
            })
          }, function (err) {
            res.status(500).send(err).end()
          })
      }
    })
  })

  function generateS3Key (extension) {
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0
      var v = c === 'x' ? r : (r & 0x3 | 0x8)

      return v.toString(16)
    })

    return Date.now() + '-' + id + '.' + extension
  }

  function uploadImageStreamToS3 (stream, key) {
    var s3UploadD = Q.defer()

    var base = "https://s3.amazonaws.com/" + process.env.AWS_S3_BUCKET + "/"
    var url  = base + key
    console.log(url)

    var upload = s3Stream.upload({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      ACL: 'public-read',
      StorageClass: 'REDUCED_REDUNDANCY',
      ContentType: 'image/png'
    })

    stream.pipe(upload)
    upload.on('uploaded', function () {
      s3UploadD.fulfill(url)
    })

    return s3UploadD.promise
  }
}

