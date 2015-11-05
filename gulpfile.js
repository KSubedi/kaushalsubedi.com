var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var scss = require('gulp-sass');
var livereload = require('gulp-livereload');
var hf = require('gulp-headerfooter');
var minifyHTML = require('gulp-minify-html');
var tap = require('gulp-tap');
var StringDecoder = require('string_decoder').StringDecoder;

var path = require("path");


var fs = require('fs');

var paths = {
    css: [
        'ext/bootstrap/dist/css/bootstrap.css',
        'ext/bootstrap/dist/css/bootstrap-theme.css',
        'css/*.css'
    ],
    scss: [
        'scss/*.scss'
    ],
    html: [
        'html/**/*.html',
        '!html/includes/*.html'
    ],
    js: [
        'ext/jquery/dist/jquery.min.js',
        'js/*.js'
    ],
    fonts: [
        'ext/bootstrap/fonts/*'
    ]
}

gulp.task('scss', function() {
    return gulp.src(paths.scss)
        .pipe(scss({
            errLogToConsole: true
        }))
        .pipe(gulp.dest('css'))
})

gulp.task('css', ['scss'], function() {
    return gulp.src(paths.css)
        .pipe(minify({
            keepSpecialComments: 0
        }))
        .pipe(concat('final.min.css'))
        .pipe(gulp.dest('public/assets/'))
        .pipe(livereload());
});

gulp.task('js', function() {
    return gulp.src(paths.js)
        .pipe(concat('final.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('public/assets/'))
        .pipe(livereload());
});

gulp.task('html', function() {

    //Read the header and footers
    var header = fs.readFileSync('html/includes/header.html');
    var footer = fs.readFileSync('html/includes/footer.html');

    return gulp.src(paths.html)
        //Set the header and footers
        .pipe(hf.header(header))
        .pipe(hf.footer(footer))
        .pipe(minifyHTML())
        .pipe(tap(function(file) {
            //Get the titles from config file
            var titles = require("./config/titles.json");
            //Get the base name of the file
            var baseName = path.basename(file.path, ".html");

            //Change the contents from the pipe to string
            var oldContent = file.contents.toString("utf8");
            var newContent = oldContent;

            var title = titles[baseName];

            if(title == undefined){
                newContent = oldContent.replace("{{title}}", "");
            //If its not for the index page, change the title
            }else{
                newContent = oldContent.replace("{{title}}", title + " - ");
            }

            //Pipe the contents back as buffer
            file.contents = new Buffer(newContent);

            //Also change the path so that each file has its own directory
            if (baseName !== "index") {
                file.path = path.dirname(file.path) + "/" + baseName + "/index.html";
            }
        }))
        .pipe(gulp.dest("public"))
        .pipe(livereload());
});

//Copy bootstrap fonts to the public directory
gulp.task('fonts', function() {
    return gulp.src(paths.fonts)
        .pipe(gulp.dest("public/fonts/"));
})



gulp.task('watch', function() {
    livereload.listen();
    gulp.watch(paths.css, ['css']);
    gulp.watch(paths.scss, ['css']);
    gulp.watch(paths.js, ['js']);
    gulp.watch(paths.html, ['html']);
});

gulp.task('default', ['css', 'js', 'html', 'fonts', 'watch']);
