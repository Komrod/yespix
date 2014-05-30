module.exports = function(grunt) {

    /**
     * List of pgrunt packages
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
                    '../engine/core/*.js'
                ]
            }
        },

        jsbeautifier:
        {
            all: {
                src : [
                    '../engine/core/*.js',
                    '../engine/entities/*.js',
                    '../engine/yespix.js'
                    ]
            },
            yp: {
                src : [
                    '../engine/yespix.js'
                    ]
            }
        },

        // clean config
        clean: {
            options: {
                force: true,
            },
            build: {
                src: ['../engine/yespix.min.js', '../engine/yespix.js'],
            }
        },

        // build js files
        concat: {
            build: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
                },
                src: [
                    // core
                    '../engine/template/core_start.js',
                    '../engine/core/*.js',

                    // entities
                    '../engine/template/entities_start.js',
                    '../engine/entities/*.js',
                    '../engine/template/entities_end.js',
                    
                    '../engine/template/core_end.js',
                ],
                dest: '../engine/yespix.js',
                nonull: true,
            }
        },

        // minify config
        uglify: {
            minify: {
                files: [{
                    '../engine/yespix.min.js': '../engine/yespix.js'
                }]
            }
        },

        watch: {
            scripts: {
                files: ['../engine/**/*.js'],
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