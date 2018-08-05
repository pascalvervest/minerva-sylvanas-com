'use strict';

var browserify = require('browserify');
var buffer = require('gulp-buffer');
var cleanCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var gulp = require('gulp');
var gutil = require('gulp-util');
var merge = require('merge-stream');
var plumber = require('gulp-plumber');
var prettify = require('pretty-hrtime');
var rebase = require('gulp-css-rebase-urls');
var sass = require('gulp-sass');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var path = require('path');

// CSS resources
var CSS = {
    'app.css': [
        './assets/scss/app.scss',
    ]
};

// Libraries
var JS_LIBS = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/what-input/dist/what-input.min.js',
    './node_modules/foundation-sites/dist/js/foundation.min.js',
];

// Application javascripts
var JS_APP = [
    './assets/js/app.js',
];

var FONTS = [
    './node_modules/@fortawesome/fontawesome-free/webfonts/*'
];

// Compile modules using Browserify
function bundle(b, file) {
    gutil.log('Bundling', gutil.colors.cyan(file));
    var start = process.hrtime();

    return b.bundle()
        .on('error', function(err) {
            gutil.log(gutil.colors.red('Browserify Error'), err.message, 'in', err.filename);
        })
        .pipe(source(path.basename(file)))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(uglify({mangle: false, preserveComments: 'some'}))
        .pipe(sourcemaps.write('./maps')) // writes .map file
        .pipe(gulp.dest('./public/js'))
        .on('end', function() {
            gutil.log('Finished', gutil.colors.cyan(file), 'after', gutil.colors.magenta(prettify(process.hrtime(start))));
        });
}

// Compile CSS
function bundleCss(target, files) {
    return gulp.src(files)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sass({
            includePaths: [
                'node_modules/@fortawesome/fontawesome-free/scss',
                'node_modules/foundation-sites/scss'
            ]
        }).on('error', sass.logError))
        .pipe(rebase({root: '/public/css'}))
        .pipe(cleanCss())
        .pipe(concat(target))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./public/css'));
}

// Compile generic JS
function bundleJs(target, files) {
    return gulp.src(files)
        .pipe(plumber())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(concat(target))
        .pipe(uglify({mangle: false, preserveComments: 'some'}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('public/js'));
}

gulp.task('css', function () {
    return merge(Object.keys(CSS).map(function (target) {
        return bundleCss(target, CSS[target]);
    }));
});


gulp.task('libs', function() {
    return bundleJs('libs.js', JS_LIBS);
});

gulp.task('js', function () {
    return merge(JS_APP.map(function (file) {
        return bundle(browserify(file, {debug: true}), file);
    }));
});

gulp.task('fonts', function() {
    return gulp.src(FONTS)
        .pipe(gulp.dest('public/webfonts'));
});

gulp.task('default', ['css', 'fonts', 'libs', 'js']);
