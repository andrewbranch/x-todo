module.exports = function (grunt) {

  // Project configuration.
  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    nuget_install: {
      file: {
        './api/x-todo.sln'
      }
    }

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
          site: 'x_todo',
          keepalive: true,
          verbose: true
        },
      }
    }
  });



  grunt.loadNpmTasks('grunt-msbuild');
  grunt.loadNpmTasks('grunt-iisexpress');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nuget-install');

  grunt.registerTask('install', ['nuget-install']);
  grunt.registerTask('build', ['msbuild', 'shell:emberbuild']);
  grunt.registerTask('default', ['install', 'msbuild', 'server']);

  var emberServerProcess,
      emberServerDone;
  grunt.registerTask('server', function () {
    var exec = require('child_process').exec,
        emberServerProcess = exec('cd frontend && ember server', function (error, stdout, stderr) {
          grunt.log.writeln(stdout);
          grunt.log.error(stderr);
          if (!error) {
            grunt.warn(error);
          }
        });
      grunt.log.write(emberServerProcess);
      emberServerProcess.stdout.on('data', function (data) {
        grunt.log.writeln(data.toString());
      });

      emberServerProcess.stderr.on('data', function (data) {
        grunt.warn(data.toString());
      });

      grunt.task.run('iisexpress');

  });

};
