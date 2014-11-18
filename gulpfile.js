var gulp = require('gulp');
var mocha = require('gulp-mocha');

gulp.task('test', function () {
	gulp.src('./test/index.js', {read: false})
		.pipe(mocha({reporter: 'nyan'}));
});

gulp.task('watch:test', function() {
	gulp.watch('./test/*.js', ['test']);
})