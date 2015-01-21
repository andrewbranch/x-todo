module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    msbuild: {
      src: ['./api/x-todo.sln'],
      options: {
        projectConfiguration: 'Release',
        targets: ['Clean', 'Rebuild'],
        stdout: true
      }
    },

    iisexpress: {
      server: {
        options: {
          site: 'x_todo',
          keepalive: true,
          verbose: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-msbuild');
  // grunt.loadNpmTasks('grunt-iisexpress');

  grunt.registerTask('build', ['msbuild']);
  // grunt.registerTask('server', ['iisexpress']);

  grunt.registerTask('iis', function () {
    grunt.util.spawn({
      cmd: 'C:\\Program Files\\IIS Express\\iisexpress.exe',
      args: ['/site:x_todo'],
    }).stdout.on('data', function (data) {
      var str = data.toString(),
          url = (str.match(/"http(s?):\/\/[a-zA-Z-]+?:[0-9]{1,9}.*?"/) || [])[0];
      grunt.log.write(str);
      if (url) {
        grunt.event.emit('iis.ready', url.slice(1, url.length - 1));
      }
    });

    grunt.event.on('iis.ready', function (url) {
      grunt.log.ok('IIS Express URL: ' + url);
    });

    this.async();
  });

  // Default task(s).
  grunt.registerTask('default', ['build', 'server']);

};
