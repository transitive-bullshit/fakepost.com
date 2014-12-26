
var mongoose     = require('mongoose')

var express      = require('express')
var errorhandler = require('errorhandler')
var exphbs       = require('express-handlebars')
var bodyParser   = require('body-parser')
var logger       = require('morgan')

var utils        = require('./lib/utils')
var path         = require('path')
var app          = express()

mongoose.connect(process.env.MONGODB)

app.set('port', process.env.PORT || 5000)

app.use('/assets', express.static('assets'))
app.use('/build', express.static('dist/build'))

var templateConfig = {
  defaultLayout: false,
  extname: '.html',
}

if (utils.isProd()) {
  templateConfig.partialsDir = path.join(__dirname, 'dist')
} else {
  templateConfig.partialsDir = __dirname
}

app.engine('html', exphbs(templateConfig))
app.set('view engine', 'html')
app.set('views', templateConfig.partialsDir)

app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

if (utils.isProd()) {
  app.use(logger())
} else {
  app.use(errorhandler())
  app.use(logger('dev'))
}

require('./routes/twitter')(app)
require('./routes/screenshot')(app)
require('./routes/views')(app)

app.listen(app.get('port'), function () {
  console.log("Node app is running at localhost:" + app.get('port'))
})

