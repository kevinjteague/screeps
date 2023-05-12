let matchdep = require('matchdep');
let mergeFiles = require('./grunt-scripts/mergeFiles');

module.exports = function (grunt) {
	matchdep.filterAll(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks);
	mergeFiles(grunt);

	grunt.initConfig({
		screeps: {
			options: {
				email:    '*****************',
				password: '*****************',
				branch:   'default',
				ptr:      false,
			},
			dist:    {
				src: ['dist/*.js']
			}
		},

		copy:      {
			main: {
				expand:  true,
				flatten: true,
				filter:  'isFile',
				cwd:     'dist/',
				src:     '**',
				dest:    'C:/Users/kman7/AppData/Local/Screeps/scripts/screeps.com/default'
			},
		},
	});

	grunt.registerTask('main', ['test', 'merge', 'write']);
	grunt.registerTask('sandbox', ['merge', 'write-private']);
	grunt.registerTask('merge', 'mergeFiles');
	grunt.registerTask('write', 'screeps');
	grunt.registerTask('write-private', 'copy');
};
