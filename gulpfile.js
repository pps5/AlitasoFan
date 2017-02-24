var gulp = require('gulp');
var ts = require('gulp-typescript');
var tsProject = ts.createProject('tsconfig.json');
var browserify = require('browserify');
var browserifyShim = require('browserify-shim');
var source = require('vinyl-source-stream');

gulp.task('build:ts', function() {
    return gulp.src(['./src/ts/*.ts'])
        .pipe(ts(tsProject.compilerOptions))
        .pipe(gulp.dest('./src/js/'));
})

gulp.task('merge:js', function() {
    return browserify({
        entries: './src/js/app.js'
    })
    .external(['firebase'])
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./js/'));
})

gulp.task('default', ['build:ts', 'merge:js']);