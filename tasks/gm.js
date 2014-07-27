module.exports = function(grunt) {
  var fs, mkdirp, path;
  fs = require('fs');
  mkdirp = require('mkdirp');
  path = require('path');
  grunt.task.registerMultiTask('gm', function() {
    var count, done, files, next, opts, skipExisting, stopOnError, total;
    done = this.async();
    files = this.files;
    opts = this.data.options;
    skipExisting = grunt.option('skipExisting') || opts.skipExisting;
    stopOnError = grunt.option('stopOnError') || opts.stopOnError;
    count = 0;
    total = files.length;
    (next = function(file) {
      var args, cmd, dir, name, _ref, _ref1, _skipExisting, _stopOnError;
      if (!file) {
        return done(true);
      }
      count++;
      _skipExisting = skipExisting || !!((_ref = file.options) != null ? _ref.skipExisting : void 0);
      _stopOnError = stopOnError || !!((_ref1 = file.options) != null ? _ref1.stopOnError : void 0);
      grunt.log.write("Processing " + file.src + "... ");
      if (_skipExisting && grunt.file.exists(file.dest) && fs.statSync(file.dest).size) {
        grunt.log.writeln("skipped, " + count + "/" + total);
        return next(files.shift());
      }
      if (!grunt.file.exists((dir = path.dirname(file.dest)))) {
        mkdirp(dir);
      }
      cmd = "require(\"" + __dirname + "/../node_modules/gm\")(\"" + file.src + "\")";
      for (name in file.tasks) {
        args = file.tasks[name].map(function(arg) {
          if (typeof arg !== 'object') {
            return arg;
          } else {
            return JSON.stringify(arg);
          }
        });
        cmd += "." + name + "(" + args + ")";
      }
      cmd += ".write(\"" + file.dest + "\",function(e){if(e)throw new Error(e)})";
      grunt.verbose.write("" + process.argv[0] + " -e '" + cmd + "'... ");
      return grunt.util.spawn({
        cmd: process.argv[0],
        args: ['-e', cmd],
        opts: {
          stdio: 'inherit'
        }
      }, function(e) {
        var from, to;
        if (e || !grunt.file.exists(file.dest)) {
          grunt.log.error("Not written: " + file.dest + ", " + count + "/" + total);
          if (_stopOnError) {
            return done(false);
          }
        } else {
          from = fs.statSync(file.src[0]).size;
          to = fs.statSync(file.dest).size;
          grunt.log.write(grunt.log.wordlist([(from / 1000).toFixed(2) + ' kB', (to / 1000).toFixed(2) + ' kB'], {
            color: 'green',
            separator: ' → '
          }));
          grunt.log.writeln(", " + ((((to - from) / from) * 100).toFixed(2)) + "%, " + count + "/" + total);
        }
        return next(files.shift());
      });
    })(files.shift());
    return null;
  });
  return null;
};
