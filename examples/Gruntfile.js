'use strict';

// var gap = require('grunt-as-promised');
var gap = require('../index');
var Bluebird = require('bluebird');

module.exports = function (grunt) {
  gap.configure(grunt);
  grunt.loadTasks('tasks');

  grunt.registerPromiseTask('inline', function () {
    return Bluebird.delay(100).then(function () {
      console.log('Inline task');
    });
  });

  grunt.registerPromiseTask('failing', function () {
    return Bluebird.delay(100).then(function () {
      console.log('Failing task');
      throw new Error('Houston, we have problem');
    });
  });

  grunt.registerTask('default', ['inline', 'file']);
};
