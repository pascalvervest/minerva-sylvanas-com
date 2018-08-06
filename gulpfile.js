'use strict';

let browserify = require('browserify');
let buffer = require('gulp-buffer');
let cleanCss = require('gulp-clean-css');
let concat = require('gulp-concat');
let gulp = require('gulp');
let gutil = require('gulp-util');
let merge = require('merge-stream');
let plumber = require('gulp-plumber');
let prettify = require('pretty-hrtime');
let rebase = require('gulp-css-rebase-urls');
let sass = require('gulp-sass');
let source = require('vinyl-source-stream');
let sourcemaps = require('gulp-sourcemaps');
let uglify = require('gulp-uglify');
let path = require('path');

// CSS resources
let CSS_ADMIN = {
    'admin.css' : [
        './assets/scss/admin.scss',
    ]
};

let CSS_FRONTEND = {
    'frontend.css': [
        './assets/scss/frontend.scss',
    ]
};

// Libraries
let JS_LIBS = [
    './node_modules/jquery/dist/jquery.min.js',
    './node_modules/what-input/dist/what-input.min.js',
    './node_modules/foundation-sites/dist/js/foundation.min.js',
];

// Application javascripts
let JS_ADMIN = [
    './assets/js/admin.js',
];

let JS_FRONTEND = [
    './assets/js/frontend.js',
];

let FONTS = [
    './node_modules/@fortawesome/fontawesome-free/webfonts/*'
];

// Compile modules using Browserify
function bundle(b, file) {
    gutil.log('Bundling', gutil.colors.cyan(file));
    let start = process.hrtime();

    return b.bundle()
        .on('error', function(err) {
            gutil.log(gutil.colors.red('Browserify Error'), err.message, 'in', err.filename);
        })
        .pipe(source(path.basename(file)))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(uglify({mangle: false}))
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
        .pipe(uglify({mangle: false}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('public/js'));
}

gulp.task('css_admin', function () {
    return merge(Object.keys(CSS_ADMIN).map(function (target) {
        return bundleCss(target, CSS_ADMIN[target]);
    }));
});

gulp.task('css_frontend', function () {
    return merge(Object.keys(CSS_FRONTEND).map(function (target) {
        return bundleCss(target, CSS_FRONTEND[target]);
    }));
});


gulp.task('libs', function() {
    return bundleJs('libs.js', JS_LIBS);
});

gulp.task('js_admin', function () {
    return merge(JS_ADMIN.map(function (file) {
        return bundle(browserify(file, {debug: true}), file);
    }));
});

gulp.task('js_frontend', function () {
    return merge(JS_FRONTEND.map(function (file) {
        return bundle(browserify(file, {debug: true}), file);
    }));
});

gulp.task('fonts', function() {
    return gulp.src(FONTS)
        .pipe(gulp.dest('public/webfonts'));
});

gulp.task('default', ['css_admin', 'css_frontend', 'fonts', 'libs', 'js_admin', 'js_frontend']);
