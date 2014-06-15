var gulp = require('gulp');
var gutil = require('gulp-util');

var clean = require('gulp-clean');
var tsc = require('gulp-tsc');
var mocha = require('gulp-mocha');
var runSequence = require('run-sequence');

var paths = {
  lib: {
    ts: ['lib/**/*.ts'],
    js: ['tmp/lib/**/*.js']
  },
  test: {
    fixtures: {
      ts: ['test/fixtures/*.ts'],
      js: ['tmp/test/fixtures/*.js'],
      css: ['tmp/test/fixtures/*.css']
    },
    spec: {
      ts: ['test/spec/**/*.ts'],
      js: ['tmp/test/*.js', 'tmp/test/spec/**/*.js']
    }
  }
};

gulp.task('default', ['watch']);

gulp.task('watch', ['test'], function() {
  gulp.watch(paths.lib.ts, function() {
    runSequence('ts:lib', 'mocha');
  });
  gulp.watch(paths.test.fixtures.ts, function() {
    runSequence('ts:fixtures', 'mocha');
  });
  gulp.watch(paths.test.spec.ts, function() {
    runSequence('ts:specs', 'mocha');
  });
});

gulp.task('test', ['ts'], function() {
  runSequence('blink', 'mocha');
});

gulp.task('ts', ['clean', 'ts:lib', 'ts:fixtures', 'ts:specs']);

gulp.task('clean', function() {
  return gulp.src(['tmp'], { read: false })
    .pipe(clean());
});

gulp.task('ts:lib', function() {
  return gulp.src(paths.lib.ts)
    .pipe(tsc({ target: 'es5' }))
    .pipe(gulp.dest('tmp/lib'));
});

gulp.task('ts:fixtures', function() {
  return gulp.src(paths.test.fixtures.ts)
    .pipe(tsc({ target: 'es5' }))
    .pipe(gulp.dest('tmp/test/fixtures'));
});

gulp.task('ts:specs', function() {
  return gulp.src(paths.test.spec.ts)
    .pipe(tsc({ target: 'es5' }))
    .pipe(gulp.dest('tmp/test'));
});

gulp.task('blink', ['blink:buffer', 'blink:stream']);

gulp.task('blink:buffer', function() {
  var blink = require('./tmp/lib/blink.js');
  return gulp.src(paths.test.fixtures.js)
    .pipe(blink())
    .pipe(gulp.dest('tmp/test/actual/buffer'));
});

gulp.task('blink:stream', function() {
  var blink = require('./tmp/lib/blink.js');
  return gulp.src(paths.test.fixtures.js, { buffer: false })
    .pipe(blink())
    .pipe(gulp.dest('tmp/test/actual/stream'));
});

gulp.task('mocha', function() {
  return gulp.src(paths.test.spec.js, { read: false })
    .pipe(mocha({
      reporter: 'spec',
      clearRequireCache: true
    }));
});
