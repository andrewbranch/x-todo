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

    shell: {
      apiHost: 'http://localhost:50993',
      emberserver: {
        command: 'ember server --proxy <%= apiHost %>',
        options: {
          execOptions: {
            cwd: 'frontend',
            killSignal: 'SIGINT'
          }
        }
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
    },

    concurrent: {
      server: ['iisexpress', 'shell:emberserver'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-msbuild');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-iisexpress');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('build', ['msbuild']);
  grunt.registerTask('server', ['concurrent:server']);
  grunt.registerTask('default', ['build', 'server']);

};
