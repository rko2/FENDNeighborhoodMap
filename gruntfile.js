module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/js/perfmatters.js' : 'src/js/perfmatters.js'
        }
      },
      views: {
        files: {
          'dist/views/js/main.js' : 'src/views/js/main.js'
        }
      }
    }
  });

  grunt.registerTask('default', [
    'uglify'
	]);

}
