module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    less: {
      development: {
        options: {
          paths: ["assets/css"]
        },
        files: {
          "css/style3.css": "css/backupless.less"
        }
      }
      // ,
      // production: {
      //   options: {
      //     paths: ["assets/css"],
      //     plugins: [
      //       new require('less-plugin-autoprefix')({browsers: ["last 2 versions"]}),
      //       new require('less-plugin-clean-css')(cleanCssOptions)
      //     ],
      //     modifyVars: {
      //       imgPath: '"http://mycdn.com/path/to/images"',
      //       bgColor: 'red'
      //     }
      //   },
      //   files: {
      //     "path/to/result.css": "path/to/source.less"
      //   }
      // }
    }
  });

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-less');

  // Default task(s).
  grunt.registerTask('default', ['less:development']);

};