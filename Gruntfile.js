module.exports = function(grunt) {

	//Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			minifyjs: {
				files: [{
					expand: true,
					cwd: 'src/js',
					src: ['*.js'],
					dest: 'build/js',
					ext: '.js'
				}]
			}
		},
		cssmin: {
			minifycss: {
				files: [{
					expand: true,
					cwd: 'src/css',
					src: ['*.css'],
					dest: 'build/css',
					ext: '.css'
				}]
			}
		},
		copy: {
			main: {
				files: [{
					expand: true,
					cwd: 'src',
					src: ['index.html'],
					dest: 'build/'
				}]
			}
		}
	});

	// Load the plugins that provide the tasks.
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-copy');

	// Default tasks.
	grunt.registerTask(
		'default', [
		'uglify',
		'cssmin',
		'copy'
		]);
};