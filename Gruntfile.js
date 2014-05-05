module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        
        uglify: {
            minify: {
                files: [ {
                    'engine/yespix.min.js': 'engine/yespix.js'
                } ]
            }
        }
    });

    grunt.registerTask('default', ['uglify:minify']);
};
