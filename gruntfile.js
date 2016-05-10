module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-inline-css');

  grunt.initConfig({
    uglify: {
      dist: {
        files: {
          'dist/js/app.js' : 'src/js/app.js'
        }
      }
    },
    inlinecss: {
        main: {
            options: {
            },
            files: {
                'dist/index.html': 'src/index.html'
            }
        }
    }
  });

  grunt.registerTask('default', [
    'uglify',
    'inlinecss'
	]);
}
