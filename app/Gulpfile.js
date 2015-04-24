var gulp = require('gulp'),
    server = require('gulp-express'),
    runSequence = require('run-sequence');

var paths = {
  server: {
    path: 'server.js'
  }
};

//Starts the server
gulp.task('server_dev', function() {
  console.log('### STARTING SERVER ###');
  return server.run([paths.server.path]);
});


gulp.task('watch', function() {
  console.log('### WATCHING ###');
  gulp.watch([paths.server.path], ['server_dev']);
});

gulp.task('dev', function(callback) {
  runSequence('server_dev', 'watch', callback);
});

gulp.task('default', function(callback) {
  runSequence('server_dev', 'watch', callback);
})
