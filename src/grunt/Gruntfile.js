module.exports = function(grunt) {

    /**
     * List of grunt packages
     */
    var packages = [
        'grunt-contrib-uglify',
        'grunt-contrib-clean',
        'grunt-contrib-watch',
        'grunt-contrib-concat',
        'grunt-contrib-copy',
        'grunt-contrib-jshint',
        'grunt-shell',
        'grunt-jsbeautifier',
        'grunt-contrib-watch',
        'grunt-contrib-qunit'
    ];


    var packages_count = 0;
    var pupdate_cmd = '';
    
    // load packages and build selfupdate command
    console.log('--------------------------');
    for (index = 0; index < packages.length; ++index) {
        console.log('Loading package "' + packages[index] + '"');
        grunt.loadNpmTasks(packages[index]);
        packages_count++;
        pupdate_cmd = pupdate_cmd + 'npm install ' + packages[index] + ' --save-dev; ';
    }
    
    console.info(packages_count + ' package(s) loaded');
    console.log('--------------------------');

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        shell: {
            update: {
                options: {
                    stderr: false
                },
                command: pupdate_cmd
            }
        },

        // js hint
        jshint: {
            options: {
                jshintrc: 'jshintrc.json'
            },
            out: {
                src: [
                      '../engine/core/*.js',
                      '../engine/core/**/*.js',
                      '../engine/entity/*.js',
                      '../engine/entity/**/*.js',
                      '../engine/class/*.js',
                      '../engine/class/**/*.js'
                ]
            }
        },

        jsbeautifier:
        {
            all: {
                src : [
                    '../engine/core/**/*.js',
                    '../engine/entity/**/*.js',
                    '../engine/class/**/*.js',
                    '../../build/yespix.js'
                    ]
            },
            yp: {
                src : [
                    '../../build/yespix.js'
                    ]
            }
        },

        // clean config
        clean: {
            options: {
                force: true,
            },
            build: {
                src: ['../../build/yespix.min.js', '../../build/yespix.js'],
            }
        },

        // build js files
        concat: {
            build: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
                },
                src: [

                    // core start
                    '../engine/template/core_start.js',

                    // core
                    '../engine/core/*.js',

                    // entities start
                    '../engine/template/entities_start.js',

                    // classes
                    '../engine/class/animation.js',
                    '../engine/class/aspect.js',
                    '../engine/class/collision.js',
                    '../engine/class/elementList.js',
                    '../engine/class/gfxManager.js',
                    '../engine/class/image.js',
                    '../engine/class/input.js',
                    '../engine/class/loader.js',
                    '../engine/class/loop.js',
                    '../engine/class/path.js',
                    '../engine/class/physicsBox2d.js',
                    '../engine/class/position.js',
                    '../engine/class/sound.js',
                    '../engine/class/speed.js',
                    '../engine/class/sprite.js',
                    '../engine/class/text.js',
                    '../engine/class/video.js',

                    // classes with inheritance
                    '../engine/class/actor.js',
                    '../engine/class/actor2w.js',
                    '../engine/class/player2w.js',
                    '../engine/class/actorPlatform.js',

                    // entities
                    '../engine/entity/base.js',
                    '../engine/entity/gfx.js',
                    '../engine/entity/canvas.js',
                    '../engine/entity/path.js',
                    '../engine/entity/text.js',
                    '../engine/entity/image.js',
                    '../engine/entity/sound.js',
                    '../engine/entity/sprite.js',
                    '../engine/entity/video.js',
                    '../engine/entity/animation.js',

                    // entities end
                    '../engine/template/entities_end.js',
                    
                    // core end
                    '../engine/template/core_end.js', 
                ],
                dest: '../../build/yespix.js',
                nonull: true,
            }
        },

        // minify config
        uglify: {
            minify: {
                files: [{
                    '../../build/yespix.min.js': '../../build/yespix.js'
                }]
            }
        },

        watch: {
            scripts: {
                files: [
                    '../engine/core/*.js', 
                    '../engine/core/**/*.js', 
                    '../engine/entity/*.js',
                    '../engine/entity/**/*.js',
                    '../engine/class/*.js',
                    '../engine/class/**/*.js'
                    ],
                tasks: ['default'],
                options: {
                    spawn: false,
                    livereload: true,
                }
            },
        },


        qunit: {
            all: ['../unit/*.html'],
            basic: ['../unit/basic.html'],
            core_general: ['../unit/core_general.html']
        }        
    });

    // install and update grunt packages
    grunt.registerTask('packupdate', ['shell:update']);

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