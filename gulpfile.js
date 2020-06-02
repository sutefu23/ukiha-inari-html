const gulp    = require('gulp');
const notify  = require("gulp-notify");
const plumber = require("gulp-plumber");
const sass    = require('gulp-sass');
const babel   = require('gulp-babel');
const autoprefixer = require('gulp-autoprefixer');
const packageImporter = require('node-sass-package-importer');
// const uglify  = require('gulp-uglify');
const concat = require("gulp-concat");
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const browserSync = require('browser-sync');

//setting : paths
const paths = {
  'root'    : './src/',
  'html'    : './src/*.html',
  'scssSrc'  : './src/scss/*.scss',
  'cssSrc'  : './src/css/*.css',
  'cssDist'   : './src/css/',
  'jsSrc' : './src/js-src/*.js',
  'jsDist': './src/js/',
  'imgSrc'  : './src/img/*.png',
  'imgDist'  : './src/img/',
}

//gulpコマンドの省略
const { watch, series, task, src, dest, parallel } = require('gulp');

//Sass
task('sass', () => {
  return (
    src(paths.scssSrc)
      .pipe(plumber({ errorHandler: notify.onError("Error: <%= error.message %>") }))
      .pipe(sass({
        outputStyle: 'expanded', // Minifyするなら'compressed'
        importer: packageImporter({
          extensions: ['.scss', '.css']
        })
      }))
      .pipe(autoprefixer({
        cascade: false,
        grid: true
        }))
      .pipe(dest(paths.cssDist))
  );
});

// ファイル結合タスクを作成
task("concat", () => {
    return (
      // 結合元のファイルを指定
      src(paths.cssSrc)
      // 結合後のファイル名を指定
      .pipe(concat("style.css"))
      // 出力フォルダを指定
      .pipe(dest(paths.cssDist))
    )
  }
);

//JS Compress
task('js', () => {
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

task("imagemin", (done) => {
    src( paths.imgSrc )
    .pipe(imagemin(
        [pngquant({quality: [.6,.8], speed: 1})]
    ))
    .pipe(dest( paths.imgDist ));
    done();
});

//watch
task('watch', (done) => {
  watch([paths.scssSrc], series('sass', 'reload'));
  watch([paths.jsSrc], series('js', 'reload'));
  watch([paths.html], series('reload'));
  done();
});
task('default', parallel('watch', 'browser-sync'));