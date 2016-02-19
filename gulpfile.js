var gulp = require("gulp");
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var templateCache = require("gulp-angular-templatecache");
var templateCacheOptions = {
		standalone: true
};

gulp.task("sass", function(){
	gulp.src("app/styles/sass/*.scss")
		.pipe(sass().on("error", sass.logError))
		.pipe(autoprefixer())
		.pipe(gulp.dest("app/styles/compiled"));
});

gulp.task("cache_templates", function(){
	return gulp.src("app/components/**/*.html")
		.pipe(templateCache(templateCacheOptions))
		.pipe(gulp.dest("app/components/compiled"));
});

gulp.task("build", ["sass", "cache_templates"], function() {
  // do stuff
});