const gulp       = require('gulp');
const clean      = require('gulp-clean');
const eslint     = require('gulp-eslint');
const babel      = require('gulp-babel');
const Cache      = require('gulp-file-cache');
const nodemon    = require('gulp-nodemon');
const concat     = require('gulp-concat');
const minify     = require('gulp-minify');
const sourcemaps = require('gulp-sourcemaps');

// const ENTRYPOINT = './src/app.js';
const cache = new Cache();

gulp.task('clean', () => {
    return gulp.src('dist', {read: false})
        .pipe(clean());
});

gulp.task('lint-prod', () => {
    return gulp.src(['./src/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError())
});

gulp.task('lint-dev', () => {
    return gulp.src(['./src/**/*.js', '!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
});

gulp.task('compile-dev', () => {
    return gulp.src('./src/**/*.js')
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(cache.filter())
        .pipe(babel({
            'presets': [
              [
                'env', {
                  'targets': {
                    'node': 'current'
                  }
                }
              ]
            ],
            'plugins': [
                ['transform-runtime']
            ]
          }))
        .pipe(sourcemaps.write('./src'))
        .pipe(gulp.dest('./dist'))
});

gulp.task('compile-prod', () => {
    return gulp.src('./src/**/*.js')
        .pipe(babel({
            'presets': [
              [
                'env', {
                  'targets': {
                    'node': 'current'
                  }
                }
              ]
            ],
            'plugins': [
                ['transform-runtime']
            ]
          }))
        .pipe(gulp.dest('./dist'))
});

gulp.task('dev', ['clean', 'lint-dev', 'compile-dev'], () => {
    return nodemon({
        script: './dist/app.js',
        watch: './src',
        env: {
            'DEBUG': '*_'
        },
        tasks: ['lint-dev', 'compile-dev']
    });
});

gulp.task('prod', ['clean', 'lint-prod', 'compile-prod'], () => {
    
});
