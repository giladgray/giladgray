var gulp = require('gulp');
var gutil = require('gulp-util');
var watch = require('gulp-watch');
var browserSync = require('browser-sync').create();

const SRC = './src'
const DEST = './dist'

const WATCHING = gutil.env.w || gutil.env.watch

const config = {
  sass: {
    src: `${SRC}/index.scss`,
    dest: DEST,
    watch: `${SRC}/**/*.scss`
  },

  jade: {
    src: `${SRC}/*.jade`,
    dest: DEST,
    watch: true
  }
}

function maybeWatch(task) {
  if (task.watch && WATCHING) {
    let glob = typeof task.watch === 'string' ? task.watch : task.src;
    return watch(glob);
  }
  return gutil.noop();
}

gulp.task('sass', () => {
  var plumber = require('gulp-plumber');
  var sass = require('gulp-sass');
  var autoprefixer = require('gulp-autoprefixer');

  gulp.src(config.sass.src)
    .pipe(maybeWatch(config.sass))
    .pipe(plumber())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(gulp.dest(config.sass.dest))
    .pipe(browserSync.stream())
})

gulp.task('jade', () => {
  var jade = require('gulp-jade');

  gulp.src(config.jade.src)
    .pipe(maybeWatch(config.jade))
    .pipe(jade())
    .pipe(gulp.dest(config.jade.dest))
    .pipe(browserSync.stream())
})

// gulp.task('jade-watch', ['jade'], browserSync.reload)

gulp.task('serve', ['jade', 'sass'], () => {
  browserSync.init({
    server: {
      baseDir: './dist'
    }
  })

  // watch(config.jade.src, () => { gulp.start('jade-watch') })
})

gulp.task('default', ['serve'])
