var gulp =        require('gulp');
var sass =        require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref =      require('gulp-useref');
var uglify =      require('gulp-uglify');
var gulpIf =      require('gulp-if');
var cssnano =     require('gulp-cssnano');
var imagemin =    require('gulp-imagemin');
var cache =       require('gulp-cache');
var del =         require('del');
var runSequence = require('run-sequence');

// Compiles SASS to CSS
gulp.task('sass', function(){
  return gulp.src('./app/stylesheets/sass/*.sass')
    .pipe(sass())
    .pipe(gulp.dest('./app/stylesheets/css/'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// Watches for changes in SASS files
gulp.task('watch', ['browserSync', 'sass'], function(){
  gulp.watch('./app/stylesheets/sass/*.sass', ['sass']);
  // Reloads browser whenever HTML or JS Files are changed.
  gulp.watch('./app/*.html', browserSync.reload);
  gulp.watch('./app/js/*.js', browserSync.reload);
});

// Opens browser tab and updates any changes to view
gulp.task('browserSync', function(){
  browserSync.init({
    server: {
      baseDir: 'app'
    },
  })
});

gulp.task('useref', function(){
  return gulp.src('./app/*.html')
    .pipe(useref())
    // Minifies JS Files
    .pipe(gulpIf('*.js', uglify()))
    // Minifies CSS Files
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'))
});

// Optimizes Image Files
gulp.task('image', function(){
  return gulp.src('./app/assets/img/*.+(png|jpg|gif|svg)')
    .pipe(cache(imagemin({
      interlaced: true
    })))
    .pipe(gulp.dest('dist/images'))
});

gulp.task('clean:dist', function(){
  return del.sync('dist');
});

gulp.task('build', function(callback){
  runSequence('clean:dist',
    ['sass', 'useref', 'images'],
    callback
  )
});
gulp.task('default', function(callback){
  runSequence(['sass','browserSync', 'watch'],
  callback
  )
});
