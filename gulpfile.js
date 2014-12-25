var gulp = require('gulp')

// load all plugins
var $ = require('gulp-load-plugins')()

var paths = {
	css: ['assets/css/*.less'],
	js: [ 'test/*.js', 'assets/js/**/*.js', '!assets/js/lib/**/*.js'],
	html: [ 'assets/html/**/*.html' ]
}

gulp.task('clean', function () {
  return gulp.src([ 'dist', '.tmp' ], { read: false }).pipe($.rimraf())
})

gulp.task('build', [ 'html', 'fonts' ])

gulp.task('default', [ 'clean' ], function () {
  gulp.start('build')
})

gulp.task('styles', function () {
  return gulp.src(paths.css)
    .pipe($.less())
    .pipe(gulp.dest('assets/css/'))
    .pipe($.size())
})

gulp.task('scripts', function () {
  return gulp.src(paths.js)
    .pipe($.jshint())
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.size())
})

gulp.task('style', function () {
  return gulp.src(paths.js)
    .pipe($.jscs())
    .pipe($.size())
})

gulp.task('partials', function () {
  return gulp.src(paths.html)
    .pipe($.minifyHtml({
      comments: true,
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.ngHtml2js({
      moduleName: "fakepost",
      prefix: "/assets/html/"
    }))
    .pipe(gulp.dest(".tmp/html"))
    .pipe($.size())
})

gulp.task('minify', [ 'styles', 'scripts', 'partials' ], function () {
  var jsFilter  = $.filter('**/*.js')
  var cssFilter = $.filter('**/*.css')

  return gulp.src('index.html')
    .pipe($.inject(gulp.src('.tmp/html/**/*.js'), {
      read: false,
      starttag: '<!-- inject:partials -->',
      addRootSlash: false
    }))
    .pipe($.useref.assets({ searchPath: '.' }))
    .pipe(jsFilter)
    .pipe($.ngAnnotate())
    .pipe($.uglify())
    .pipe(jsFilter.restore())
    .pipe(cssFilter)
    .pipe($.csso(true))
    .pipe(cssFilter.restore())
    .pipe($.useref.restore())
    .pipe($.useref())
    .pipe(gulp.dest('dist'))
    .pipe($.size())
})

gulp.task('html', [ 'minify' ], function () {
  return gulp.src('dist/index.html')
    .pipe(gulp.dest('dist'))
})

gulp.task('fonts', function () {
  return gulp.src([
    'assets/third-party/bootstrap/dist/fonts/*',
    'assets/third-party/font-awesome/fonts/*'
  ]).pipe($.filter('**/*.{eot,svg,ttf,woff}'))
    .pipe($.flatten())
    .pipe(gulp.dest('dist/build/fonts'))
})

