var gulp = require('gulp');
var ts = require('gulp-typescript');
var browserify = require('browserify');
var browserifyShim = require('browserify-shim');
var source = require('vinyl-source-stream');

var riot = require('gulp-riot');
var riotify = require('riotify')

gulp.task('compile:ts', function() {
    var tsconfig = require('./src/ts/tsconfig.json');
    return gulp.src(['./src/ts/*.ts'])
        .pipe(ts(tsconfig.compilerOptions))
        .pipe(gulp.dest('./src/js/'));
});

gulp.task('merge:js', function() {
    return browserify({
        entries: './src/js/app.js'
    })
    .external(['firebase'])
    .bundle()
    .pipe(source('app.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('merge:postjs', function() {
    return browserify({
        entries: './src/js/post.js'
    })
    .external(['firebase'])
    .bundle()
    .pipe(source('post.js'))
    .pipe(gulp.dest('./js/'));
})

gulp.task('compile:tag', function() {
    gulp.src('./src/tag/*.tag')
        .pipe(riot({
            type: 'typescript',
        }))
        .pipe(gulp.dest('./src/js/'));
});

gulp.task('merge:tag', function() {
    return browserify({
        entries: [
            './src/tag/gallery.tag',
            './src/tag/topbar.tag'
        ]
    }).transform([riotify])
    .bundle()
    .pipe(source('tags.js'))
    .pipe(gulp.dest('./js/'));
});

gulp.task('default', ['compile:ts', 'merge:js', 'merge:postjs', 'merge:tag']);