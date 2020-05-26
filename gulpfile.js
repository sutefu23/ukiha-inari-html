const gulp    = require('gulp');
const notify  = require("gulp-notify");
const plumber = require("gulp-plumber");
const sass    = require('gulp-sass');
const babel   = require('gulp-babel');
// const autoprefixer = require('gulp-autoprefixer');
// const uglify  = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync');

//setting : paths
const paths = {
  'root'    : './src/',
  'html'    : './src/**/*.html',
  'cssSrc'  : './sass/**/*.scss',
  'cssDist'   : './src/css/',
  'jsSrc' : './src/js/**/*.js',
  'jsDist': './src/js/',
  'imgSrc'  : './src/img',
  'imgDist'  : './src/img',
}

//gulpコマンドの省略
const { watch, series, task, src, dest, parallel } = require('gulp');

//Sass
task('sass', function () {
  return (
    src(paths.cssSrc)
      .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
      .pipe(sass({
        outputStyle: 'expanded'// Minifyするなら'compressed'
      }))
      .pipe(autoprefixer({
        browsers: ['ie >= 11'],
        cascade: false,
        grid: true
        }))
      .pipe(dest(paths.cssDist))
  );
});

//JS Compress
task('js', function () {
  return (
    src(paths.jsSrc)
      .pipe(plumber())
      .pipe(babel({
        presets: ['@babel/preset-env']
      }))
      .pipe(dest(paths.jsDist))
  );
});


// browser-sync
task('browser-sync', () => {
  return browserSync.init({
      server: {
          baseDir: paths.root
      },
      port: 8080,
      reloadOnRestart: true
  });
});

// browser-sync reload
task('reload', (done) => {
  browserSync.reload();
  done();
});

task("imagemin", function(){
    src( paths.imgSrc )
    .pipe(imagemin(
        [pngquant({quality: '40-70', speed: 1})]
    ))
    .pipe(dest( paths.imgDist ));
});

//watch
task('watch', (done) => {
  watch([paths.cssSrc], series('sass', 'reload'));
  watch([paths.jsSrc], series('js', 'reload'));
  watch([paths.imgDist], series('imagemin'));
  watch([paths.html], series('reload'));
  done();
});
task('default', parallel('watch', 'browser-sync'));