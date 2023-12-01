'use strict';

const gulp          = require('gulp');
const babel         = require('gulp-babel');
const AES           = require('crypto-js/aes');
const concat        = require('gulp-concat');
const jsonTransform = require('gulp-json-transform');
const uglify        = require('gulp-uglify');
const sass          = require('gulp-sass')(require('sass'));

const javascriptFiles = [
  'src/*.es6'
];
const sassFiles = [
  'src/*.sass'
];
const jsonFiles = [
  'src/*.json'
];

gulp.task('build:js', (done) =>{
  gulp.src(javascriptFiles)
    .pipe(babel({ presets: ['@babel/env'] }))
    .pipe(concat('shared.js'))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'));
  done();
});

gulp.task('build:sass', (done) =>{
  gulp.src(sassFiles)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('shared.css'))
    .pipe(gulp.dest('dist/css'));
  done();
});

gulp.task('build:json', (done) =>{
  gulp.src(jsonFiles)
    .pipe(jsonTransform(function(data, file) {
      return data.map(v => v.map(t => t.toLowerCase().split(',').map(w => AES.encrypt(w.trim(), 'secret key 123').toString())));
    }))
    .pipe(concat('shared.json'))
    .pipe(gulp.dest('dist/json'));
  done();
});

gulp.task('build', gulp.parallel('build:js', 'build:sass', 'build:json'));
gulp.task('default', gulp.series('build'));
