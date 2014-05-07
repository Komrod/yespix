module.exports = function(grunt) {

    /**
     * List of pgrunt packages
     */
    var packages = ['grunt',
        'grunt-contrib-uglify',
        'grunt-contrib-clean',
        'grunt-contrib-watch',
        'grunt-contrib-concat',
        'grunt-contrib-copy',
        'grunt-contrib-jshint',
        'grunt-shell',
        'grunt-fixmyjs'
    ];


    var packages_count = 0;

    var selfupdate_cmd = '';

    // load packages and build selfupdate command
    console.log('--------------------------');
    for (index = 0; index < packages.length; ++index) {
        if (packages[index] != 'grunt') {
            console.log('Loading package "' + packages[index] + '"');
            grunt.loadNpmTasks(packages[index]);
            packages_count++;
        }
        selfupdate_cmd = selfupdate_cmd + 'npm install ' + packages[index] + ' --save-dev; ';
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
                command: selfupdate_cmd
            }
        },

        // fixing code
        fixmyjs: {
            options: {
                indent: 'spaces'
            },
            test: {
                files: [{
                    src: ['../**/*.js'],
                    dest: '../build/',
                    ext: '.js'
                }]
            }
        },

        // jshint
        jshint: {
            beforeconcat: ['../engine/core/*.js'],
            afterconcat: ['../engine/yespix.js']
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
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
            },
            build: {
                src: [
                    // start
                    '../engine/template/yespix_start.js',

                    // core
                    '../engine/core/*.js',

                    // entities
                    '../engine/entities/*.js',

                    // end
                    '../engine/template/yespix_end.js'

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

    });

    // update grunt packages
    grunt.registerTask('selfupdate', ['shell:update']);

    // default task
    grunt.registerTask('default', ['clean:build', 'concat:build', 'uglify:minify']);

    // fix
    grunt.registerTask('fix', ['fixmyjs:test']);

    // jshint
    grunt.registerTask('check', ['jshint:beforeconcat']);

    // delete build files
    grunt.registerTask('mop', ['clean:build']);

    // build files
    grunt.registerTask('build', ['concat:build']);

    // minify
    grunt.registerTask('mini', ['uglify:minify']);

};