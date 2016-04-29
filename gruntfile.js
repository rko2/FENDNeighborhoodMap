module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/js/perfmatters.js' : 'src/js/perfmatters.js'
        }
      }
    }
  });

  grunt.registerTask('default', [
    'uglify'
	]);

}
