const gulp = require('gulp');
const postcss = require('gulp-postcss');

gulp.task('default', function () {
  return gulp.src('./styles/*.css').pipe(
        postcss([
          require('precss')({ /* options */ })
        ])
    ).pipe(
        gulp.dest('./')
    );
});
