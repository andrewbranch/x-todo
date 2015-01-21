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
      server: ['shell:emberserver', 'iisexpress'],
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


  // grunt.registerTask('emberserver', function () {
  //
  //   var done = this.async();
  //
  //   var spawn = grunt.util.spawn({
  //     cmd: 'cd',
  //     args: ['--proxy ' + this.options().apiHost]
  //   });
  //
  //   spawn.stdout.on('data', function (data) {
  //     grunt.log.write(data.toString());
  //   });
  //
  //   spawn.stderr.on('data', function (data) {
  //     grunt.fail.warn(data);
  //   });
  //
  //   process.on('exit', done);
  //   process.on('SIGINT', done);
  //   process.on('SIGHUP', done);
  //   process.on('SIGBREAK', done);
  //
  // });

  // Default task(s).
  grunt.registerTask('server', ['concurrent:server']);
  grunt.registerTask('default', ['build', 'server']);

};
