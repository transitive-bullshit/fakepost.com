
var express  = require('express')
var mongoose = require('mongoose')
var exphbs   = require('express-handlebars')
var utils    = require('./lib/utils')
var path     = require('path')
var app      = express()

var MONGODB_DEV = "mongodb://t:burnfisch@dogen.mongohq.com:10043/fakepost"
mongoose.connect(process.env.MONGODB || MONGODB_DEV)

app.set('port', process.env.PORT || 5000)

app.use('/assets', express.static('assets'))
app.use('/build', express.static('dist/build'))

var templateConfig = {
  defaultLayout: false,
  extname: '.html',
}

if (utils.isEC2()) {
  templateConfig.partialsDir = path.join(__dirname, 'dist')
} else {
  templateConfig.partialsDir = __dirname
}

app.engine('html', exphbs(templateConfig))
app.set('view engine', 'html')
app.set('views', templateConfig.partialsDir)

require('./routes/twitter')(app)
require('./routes/views')(app)

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})

