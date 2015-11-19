'use strict';

var Bluebird = require('bluebird');

function GruntAsPromised() {
  this.registerTask = registerTask;

  function registerTask(grunt, name, promiseFunction) {
    grunt.registerTask(name, function (localGrunt) {
      /* eslint no-invalid-this:0 */
      var done = this.async();

      return Bluebird
      .try(promiseFunction)
      .then(function () {
        done();
      })
      .catch(function (error) {
        if (error) {
          localGrunt.log.error(error);
        }
        done(false);
      });
    });
  }
}

module.exports = GruntAsPromised;
