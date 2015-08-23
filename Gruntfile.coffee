module.exports = (grunt) ->

  grunt.initConfig

    coffee:
      install:
        options:
          bare: true
        expand: true
        filter: 'isFile'
        cwd: 'src'
        src: ['**/*.coffee']
        ext: '.js'

    gm:
      test:
        options:
          skipExisting: false
          stopOnError: false
          imageMagick: false
          yourcustomopt:
            'test/gruntjs.png': '"JavaScript Task Runner"'
            'test/nodejs.png': '"JavaScript Runtime"'
        files: [
            cwd: 'test'
            dest: 'test/out'
            expand: true
            filter: 'isFile'
            src: ['**/*', '!**/out/*', '!{film,sample}.png']
            options:
              skipExisting: false
              stopOnError: true
            tasks: [
                resize: [200]
                command: ['composite']
                in: ['test/sample.png']
              ,
                gravity: ['Center']
                extent: [400, 360]
              ,
                command: ['composite']
                in: ['test/film.png']
              ,
                gravity: ['North']
                font: ['arial', 30]
                draw: [
                  'skewX', -13
                  'fill', '#999', 'text', 2, 67, (f) -> f.options.yourcustomopt[f.src[0]]
                  'fill', '#000', 'text', 0, 65, (f) -> f.options.yourcustomopt[f.src[0]]
                ]
            ]
        ]
      testImageMagick:
        options:
          skipExisting: false
          stopOnError: false
          imageMagick: true
          yourcustomopt:
            'test/gruntjs.png': '"JavaScript Task Runner"'
            'test/nodejs.png': '"JavaScript Runtime"'
        files: [
            cwd: 'test'
            dest: 'test/out'
            expand: true
            filter: 'isFile'
            src: ['**/*', '!**/out/*', '!{film,sample}.png']
            options:
              skipExisting: false
              stopOnError: true
            tasks: [
                resize: [200]
                command: ['composite']
                in: ['test/sample.png']
              ,
                gravity: ['Center']
                extent: [400, 360]
              ,
                command: ['composite']
                in: ['test/film.png']
              ,
                gravity: ['North']
                font: ['arial', 30]
                draw: [
                  'skewX', -13
                  'fill', '#999', 'text', 2, 67, (f) -> f.options.yourcustomopt[f.src[0]]
                  'fill', '#000', 'text', 0, 65, (f) -> f.options.yourcustomopt[f.src[0]]
                ]
            ]
        ]

  grunt.loadNpmTasks 'grunt-contrib-coffee'
  grunt.loadTasks 'tasks'

  grunt.registerTask 'default', ['gm:test']
