var mobileDetect = require('mobile-detect')

module.exports = function (app) {
  app.get('*', function (req, res) {
    var md       = new mobileDetect(req.headers['user-agent'])
    var isMobile = !!md.mobile()

    res.render('index', { isMobile: isMobile })
  })
}

