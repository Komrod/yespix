module.exports = function(grunt) {

    grunt.initConfig({
        
        pkg: grunt.file.readJSON('package.json'),

        // js hint
        jshint: {
            options: {
                jshintrc: 'jshintrc.json'
            },
            out: {
                src: [
                      './src/engine/core/*.js',
                      './src/engine/core/**/*.js',
                      './src/engine/entity/*.js',
                      './src/engine/entity/**/*.js',
                      './src/engine/class/*.js',
                      './src/engine/class/**/*.js'
                ]
            }
        },

        jsbeautifier:
        {
            all: {
                src : [
                    './src/engine/core/**/*.js',
                    './src/engine/entity/**/*.js',
                    './src/engine/class/**/*.js',
                    './build/yespix.js'
                    ]
            },
            yp: {
                src : [
                    './build/yespix.js'
                    ]
            }
        },

        // clean config
        clean: {
//            options: { force: true },
            build: {
                src: ['./build/yespix.min.js', './build/yespix.js']
            }
        },

        // build js files
        concat: {
            build: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */'
                },
                src: [

                    // core start
                    './src/engine/template/core_start.js',

                    // core
                    './src/engine/core/*.js',

                    // entities start
                    './src/engine/template/entities_start.js',

                    // classes
                    './src/engine/class/animation.js',
                    './src/engine/class/aspect.js',
                    './src/engine/class/collision.js',
                    './src/engine/class/elementList.js',
                    './src/engine/class/gfxManager.js',
                    './src/engine/class/image.js',
                    './src/engine/class/input.js',
                    './src/engine/class/loader.js',
                    './src/engine/class/loop.js',
                    './src/engine/class/path.js',
                    './src/engine/class/physicsBox2d.js',
                    './src/engine/class/position.js',
                    './src/engine/class/sound.js',
                    './src/engine/class/speed.js',
                    './src/engine/class/sprite.js',
                    './src/engine/class/text.js',
                    './src/engine/class/video.js',
                    './src/engine/class/prerender.js',
                    './src/engine/class/eventHandler.js',

                    // classes with inheritance
                    './src/engine/class/actor.js',
                    './src/engine/class/actor2w.js',
                    './src/engine/class/player2w.js',
                    './src/engine/class/actorPlatform.js',

                    // entities
                    './src/engine/entity/base.js',
                    './src/engine/entity/gfx.js',
                    './src/engine/entity/canvas.js',
                    './src/engine/entity/path.js',
                    './src/engine/entity/text.js',
                    './src/engine/entity/image.js',
                    './src/engine/entity/sound.js',
                    './src/engine/entity/sprite.js',
                    './src/engine/entity/video.js',
                    './src/engine/entity/animation.js',
                    './src/engine/entity/fps.js',

                    // entities end
                    './src/engine/template/entities_end.js',
                    
                    // core end
                    './src/engine/template/core_end.js'
                ],
                dest: './build/yespix.js',
                nonull: true,
            }
        },

        // minify config
        uglify: {
            minify: {
                files: [{
                    './build/yespix.min.js': './build/yespix.js'
                }]
            }
        },

        watch: {
            scripts: {
                files: [
                    './src/engine/core/*.js', 
                    './src/engine/core/**/*.js', 
                    './src/engine/entity/*.js',
                    './src/engine/entity/**/*.js',
                    './src/engine/class/*.js',
                    './src/engine/class/**/*.js'
                    ],
                tasks: ['default'],
                options: {
                    spawn: false,
                    livereload: true,
                }
            },
        },


        qunit: {
            all: ['./src/unit/*.html'],
            basic: ['./src/unit/basic.html'],
            core_general: ['./src/unit/core_general.html']
        }
    });

    // Actually load this plugin's task(s).
    //grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    // default task
    grunt.registerTask('default', ['clean:build', 'concat:build', 'uglify:minify', 'jsbeautifier:yp']);

    // prepare commit
    grunt.registerTask('commit', ['clean:build', 'jsbeautifier:all', 'concat:build', 'uglify:minify', 'jsbeautifier:yp']);

    // js hint
    grunt.registerTask('check', ['jshint:out']);

    // beautifier
    grunt.registerTask('beauty', ['jsbeautifier:all']);

    // delete build files
    grunt.registerTask('mop', ['clean:build']);

    // build files
    grunt.registerTask('build', ['concat:build']);

    // minify
    grunt.registerTask('mini', ['uglify:minify']);

    // watch
    grunt.registerTask('dog', ['watch:scripts']);
    
    // unit test
    grunt.registerTask('unit', ['qunit:all']);
    grunt.registerTask('unit_basic', ['qunit:basic']);
    grunt.registerTask('unit_core_general', ['qunit:core_general']);
    
};