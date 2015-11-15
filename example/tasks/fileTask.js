'use strict';

var Bluebird = require('bluebird');
var gap = require('../../index');

module.exports = function (grunt) {
  gap.registerTask(grunt, 'file', function () {
    return Bluebird.delay(100).then(function () {
      console.log('File task');
    });
  });
};
