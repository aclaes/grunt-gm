var extend, fs, gm, mkdirp, path;

extend = require('extend');

fs = require('fs');

gm = require('gm');

mkdirp = require('mkdirp');

path = require('path');

module.exports = function(grunt) {
  grunt.task.registerMultiTask('gm', function() {
    var count, done, errorItems, next, skippedItems, total;
    done = this.async();
    skippedItems = [];
    errorItems = [];
    count = 0;
    total = this.files.length;
    (next = (function(_this) {
      return function(file, files) {
        var arg, args, dir, i, name, opts, proc, task, _args, _i, _j, _len, _len1, _ref;
        if (!file) {
          if (skippedItems.length) {
            grunt.log.subhead("" + skippedItems.length + " items skipped:");
            grunt.log.writeln(grunt.log.wordlist(skippedItems, {
              color: 'cyan',
              separator: '\n'
            }));
          }
          if (errorItems.length) {
            grunt.log.subhead("" + errorItems.length + " items with error:");
            grunt.log.writeln(grunt.log.wordlist(errorItems, {
              color: 'red',
              separator: '\n'
            }));
          }
          return done(true);
        }
        count++;
        opts = extend({}, _this.data.options, file.options, {
          skipExisting: grunt.option('skipExisting'),
          stopOnError: grunt.option('stopOnError'),
          imageMagick: grunt.option('imageMagick')
        });
        if(opts.imageMagick){
            // Overwrite gm to use ImageMagick instead of GraphicsMagick
            gm = require('gm').subClass({imageMagick: true});
        }
        if (opts.skipExisting && fs.existsSync(file.dest) && fs.statSync(file.dest).size) {
          grunt.verbose.writeln("Processing " + file.src + "...skipped, " + count + "/" + total);
          skippedItems.push(file.dest);
          return next(files.shift(), files);
        } else {
          grunt.log.write("Processing " + file.src + "...");
          if (!fs.existsSync((dir = path.dirname(file.dest)))) {
            mkdirp(dir);
          }
          proc = gm(file.src[0]);
          _ref = file.tasks;
          for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
            task = _ref[i];
            for (name in task) {
              args = task[name];
              _args = [];
              for (_j = 0, _len1 = args.length; _j < _len1; _j++) {
                arg = args[_j];
                if (typeof arg === 'function') {
                  _args.push(arg(extend(true, {}, {
                    options: opts
                  }, file)));
                } else {
                  _args.push(arg);
                }
              }
              proc = proc[name].apply(proc, _args);
            }
            grunt.verbose.write("\n  " + (proc.args().join(' ')));
            if (i !== file.tasks.length) {
              proc = gm(proc.stream(), file.src[0]);
            }
          }
          grunt.verbose.write('\n');
          return proc.write(file.dest, function(e) {
            var from, to;
            if (e || !fs.existsSync(file.dest)) {
              grunt.log.error("Not written: " + file.dest + ", " + count + "/" + total);
              grunt.log.writeln(arguments[2]);
              errorItems.push(file.dest);
              if (opts.stopOnError) {
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
            return next(files.shift(), files);
          });
        }
      };
    })(this))(this.files.shift(), this.files);
    return null;
  });
  return null;
};
