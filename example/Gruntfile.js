'use strict';

var Bluebird = require('bluebird');
var gap = require('../index');

module.exports = function (grunt) {
  grunt.loadTasks('tasks');

  gap.registerTask(grunt, 'inline', function () {
    return Bluebird.delay(100).then(function () {
      console.log('Inline task');
    });
  });

  gap.registerTask(grunt, 'failing', function () {
    return Bluebird.delay(100).then(function () {
      console.log('Failing task');
      throw new Error('Houston, we have problem');
    });
  });

  grunt.registerTask('default', ['inline', 'file']);
};
