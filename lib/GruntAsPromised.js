'use strict';

var Bluebird = require('bluebird');

function GruntAsPromised() {
  this.configure = configure;

  function configure(grunt) {
    grunt.registerPromiseTask = registerPromiseTask;

    function registerPromiseTask(name, promiseFunction) {
      grunt.registerTask(name, function () {
        /* eslint no-invalid-this:0 */
        var done = this.async();

        return Bluebird
          .try(promiseFunction)
          .then(function () {
            done();
          })
          .catch(function (error) {
            if (error) {
              grunt.log.error(error);
            }
            done(false);
          });
      });
    }
  }
}

module.exports = GruntAsPromised;
