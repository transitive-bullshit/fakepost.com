
var querystring = require('querystring')
var webshot     = require('webshot')
var path        = require('path')
var fs          = require('fs')
var Q           = require('q')

var Uploader    = require('s3-upload-stream').Uploader

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
        /*var bufs = []
        function data (buf) {
          bufs.push(buf)
        }

        function end () {
          res.status(200).send(bufferToDataURL(Buffer.concat(bufs), 'image/png')).end()
        }*/

        if (err) {
          res.status(500).send(err).end()
        } else {
          //renderStream.pipe(through(data, end))
          uploadImageStreamToS3(renderStream, process.env.AWS_S3_BUCKET, generateS3Key('png'))
            .then(function (url) {
              res.status(200).send(url).end()
            }, function (err) {
              res.status(500).send(err).end()
            })
        }
      })
    } else {
      res.status(400).send('invalid network').end()
    }
  })

  function bufferToDataURL (buffer, type) {
    return 'data:' + type + ';base64,' + buffer.toString('base64')
  }

  function generateS3Key (extension) {
    var id = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0
      var v = c === 'x' ? r : (r & 0x3 | 0x8)

      return v.toString(16)
    })

    return Date.now() + id + '.' + extension
  }

  function uploadImageStreamToS3 (stream, bucket, key) {
    var s3UploadD = Q.defer()

    var base = "https://s3.amazonaws.com/" + bucket + "/"
    var url  = base + key

    new Uploader({
      accessKeyId: process.env.AWS_S3_KEY,
      secretAccessKey: process.env.AWS_S3_SECRET,
      region: process.env.AWS_S3_REGION
    }, {
      Bucket: bucket,
      Key: key,
      ContentType: 'image/png',
      ACL: 'public-read'
    }, function (err, uploadStream) {
      if (err) {
        console.error(err, uploadStream)
        s3UploadD.reject(err)
      } else {
        uploadStream.on('uploaded', function () {
          s3UploadD.fulfill(url)
        })

        console.log("uploading...")
        stream.pipe(uploadStream)
      }
    })

    return s3UploadD.promise
  }
}

