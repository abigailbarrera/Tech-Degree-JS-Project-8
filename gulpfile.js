"use strict";

var gulp = require('gulp'),
  uglify = require('gulp-uglify'),
  concat = require('gulp-concat'),
  rename = require('gulp-rename'),
   	sass = require('gulp-sass'),
   	maps = require('gulp-sourcemaps'),
     del = require('del'),
imagemin = require('gulp-imagemin'),
sequence = require('run-sequence'),
 connect = require('gulp-connect');

var options = {
	src: 'src',
	dist: 'dist'
};

gulp.task("concatScripts", function() {
    return gulp.src([
        'js/circle/autogrow.js',
        'js/circle/circle.js',
        'js/global.js'
        ])
    .pipe(maps.init())
    .pipe(concat('global.js'))
    .pipe(maps.write('./'))
    .pipe(rename('all.js'))
    .pipe(gulp.dest('dist/scripts'));
});

gulp.task("scripts", ["concatScripts"], function() {
	return gulp.src('dist/scripts/all.js')
				.pipe(uglify())
				.pipe(rename('all.min.js'))
				.pipe(gulp.dest('dist/scripts'));
});

gulp.task('styles', function() {
	return gulp.src(["sass/**.scss"])
				.pipe(maps.init())
				.pipe(sass())
				.pipe(maps.write('./'))
				.pipe(rename('all.min.css'))
				.pipe(gulp.dest('dist/styles'))
				.pipe(connect.reload());
});

gulp.task('watch', function () {
  gulp.watch(['sass/**/*.scss', 'sass/**/*.sass'], ['styles']);
  gulp.watch(['js/**/*.js'], ['scripts']);
});

gulp.task('images', function() {
  return gulp.src('images/*')
        .pipe(imagemin())
        .pipe(gulp.dest('dist/content'));
});

gulp.task('clean', function() {
  del(['dist/content/**', 'dist/scripts/**', 'dist/styles/**']);
});

gulp.task('build', function() {
  sequence('clean', ['scripts', 'styles', 'images']);
});


gulp.task('serve', ['watch']);

gulp.task("default", function() {
  gulp.start(['build', 'watch'])
});