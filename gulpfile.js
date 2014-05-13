var gulp = require('gulp');

var autoprefix = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var es = require('event-stream');
var exec = require('child_process').exec;
var gutil = require('gulp-util');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var sass = require('gulp-ruby-sass');
var order = require('gulp-order');

var source = {
  coffee: '_js/**/*.coffee',
  mainSass: '_sass/master.scss',
  liquidSass: '_sass/liquid.scss'
};

var dest = {
  assets: './assets'
};

var watchFiles = {
  sass: '_sass/*.scss',
  shopify: [
    'assets/*',
    'config/*',
    'layout/*',
    'snippets/*',
    'templates/**'
  ]
};

function mainSass() {
  // Autoprefixer doesn't work with if Liquid tags are present as CSS values
  // Liquid tags inside strings do work, like in url('{{ liquid }}')
  return gulp.src(source.mainSass)
    .pipe( plumber() )
    .pipe( sass({ style: 'nested', bundleExec: true, precision: 7 }) )
    .pipe( autoprefix() ); 
}

function liquidSass() {
  return gulp.src(source.liquidSass)
    .pipe( plumber() )
    .pipe( sass({ style: 'nested', bundleExec: true, precision: 7 }) );
}

gulp.task('sass', function() {
  return es.merge( liquidSass(), mainSass() )
    .pipe( order(['liquid.css', 'master.css']) )
    .pipe( concat('custom.css.liquid') )
    .pipe( gulp.dest(dest.assets) );
});

gulp.task('coffee', function() {
  return gulp.src(source.coffee)
    .pipe( plumber() )
    .pipe( coffee({map: true}).on('error', gutil.log) )
    .pipe( gulp.dest(dest.assets) );
});

gulp.task('watch', function() {

  gulp.watch(watchFiles.sass, ['sass']);

  gulp.watch(watchFiles.shopify, function(event) {
    var cwd = process.cwd().toString() + '/';
    var pathArray = event.path.toString().split(cwd);
    var relativePath = pathArray[1];
    var command = 'bundle exec theme upload ' + relativePath;

    console.log('File '+relativePath+' was '+event.type+', running Shopify Theme...');

    exec(command, function(error, stdout, stderr) {
      console.log('Shopify Theme:');
      console.log(stdout.trim());
      console.log(stderr);

      if (error !== null) {
        console.log('exec error: ' + error);
      }
    });
  });

});

gulp.task('default', ['watch']);

