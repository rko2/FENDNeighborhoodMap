module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/js/app.js' : 'src/js/app.js',
          'dist/js/map.js' : 'src/js/map.js'
        }
      }
    },
  });

  grunt.registerTask('default', [
    'uglify'
	]);
}
