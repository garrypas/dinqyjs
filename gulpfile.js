var gulp = require('gulp');
var uglify = require('gulp-uglify');
var argv = require('yargs').argv;
var karma = require('karma').server;
var rename = require('gulp-rename');
var jshint = require('gulp-jshint'); 

var $RELEASE = argv.release == true; 
var tasks = $RELEASE ? ['jshint', 'tests', 'uglify'] : ['jshint', 'tests'];

gulp.task('uglify', function() {
	gulp.src('dinqyjs.js')
		.pipe(uglify())
		.pipe(rename('dinqyjs.min.js'))
		.pipe(gulp.dest('.'));
});

gulp.task('tests', function(done) {
	return karma.start({
		configFile: __dirname + '/karma.conf.js',
		singleRun: true
	}, done);	
});

gulp.task('jshint', function() {
  return gulp.src('dinqyjs.js')
    .pipe(jshint())
  	.pipe(jshint.reporter('default'))
  	.pipe(jshint.reporter('fail'));
});

gulp.task('default', tasks);