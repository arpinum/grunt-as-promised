'use strict';

var Bluebird = require('bluebird');

module.exports = function (grunt) {
  grunt.registerPromiseTask('file', function () {
    return Bluebird.delay(100).then(function () {
      console.log('File task');
    });
  });
};
