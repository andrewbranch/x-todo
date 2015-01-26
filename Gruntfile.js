module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    nuget_install: {
      file: './api/x-todo.sln'
    },

    msbuild: {
      src: ['./api/x-todo.sln'],
      options: {
        projectConfiguration: 'Release',
        targets: ['Clean', 'Rebuild'],
        stdout: true
      }
    },

    shell: {
      emberbuild: {
        command: 'ember build',
        options: {
          execOptions: {
            cwd: 'frontend'
          }
        }
      }
    },

    iisexpress: {
      server: {
        options: {
          path: require('path').resolve('./api/x-todo'),
          port: '50993',
          keepalive: true,
          verbose: true
        },
        killOn: 'exit'
      }
    }
  });



  grunt.loadNpmTasks('grunt-msbuild');
  grunt.loadNpmTasks('grunt-iisexpress');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nuget-install');

  grunt.registerTask('install', ['nuget_install']);
  grunt.registerTask('build', ['msbuild', 'shell:emberbuild']);
  grunt.registerTask('default', ['install', 'msbuild', 'server']);

  grunt.registerTask('server', function () {
    var exec = require('child_process').exec,
        kill = require('tree-kill'),
        emberServerProcess = exec('cd frontend && ember server', function (error, stdout, stderr) {
          grunt.log.writeln(stdout);
          grunt.log.error(stderr);
          if (!error) {
            grunt.warn(error);
          }
        });

      emberServerProcess.stdout.on('data', function (data) {
        grunt.log.writeln(data.toString());
      });

      emberServerProcess.stderr.on('data', function (data) {
        kill(emberServerProcess.pid, 'SIGKILL');
        grunt.warn(data.toString());
      });

      process.on('SIGINT', function () {
        grunt.log.writeln('Stopping Ember server');
        kill(emberServerProcess.pid, 'SIGKILL');
      });

      grunt.task.run('iisexpress');

  });

};
