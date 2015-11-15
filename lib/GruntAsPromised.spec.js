'use strict';

require('chai').use(require('sinon-chai')).should();
var Bluebird = require('bluebird');
var sinon = require('sinon');
var GruntAsPromised = require('./GruntAsPromised');

describe('Grunt as promised', function () {

  var grunt;
  var gap;
  var withAsync;

  beforeEach(function () {
    grunt = {
      registerTask: sinon.spy(),
      log: {error: sinon.spy()}
    };
    gap = new GruntAsPromised();
    withAsync = {async: sinon.stub()};
  });

  describe('when registering a task', function () {
    it('should pass the name and a function to grunt', function () {
      gap.registerTask(grunt, 'the name', function () {
      });

      grunt.registerTask.lastCall.args.should.have.lengthOf(2);
      grunt.registerTask.should.have.been.calledWith('the name');
      grunt.registerTask.lastCall.args[1].should.be.an.instanceOf(Function);
    });

    it('should tell grunt the execution is done after promise is resolved', function () {
      var done = sinon.spy();
      withAsync.async.returns(done);

      gap.registerTask(grunt, '', Bluebird.resolve);

      var passedFunction = grunt.registerTask.lastCall.args[1];
      return passedFunction.call(withAsync, grunt).then(function () {
        done.should.have.been.called;
      });
    });

    it('should tell grunt the execution is done with error after promise is rejected', function () {
      var done = sinon.spy();
      withAsync.async.returns(done);

      gap.registerTask(grunt, '', function () {
        return Bluebird.reject('bleh');
      });

      var passedFunction = grunt.registerTask.lastCall.args[1];
      return passedFunction.call(withAsync, grunt).then(function () {
        done.should.have.been.calledWith(false);
        grunt.log.error.should.have.been.calledWith('bleh');
      });
    });

    it('should log nothing when promise is rejected for no reason', function () {
      var done = sinon.spy();
      withAsync.async.returns(done);

      gap.registerTask(grunt, '', function () {
        return Bluebird.reject();
      });

      var passedFunction = grunt.registerTask.lastCall.args[1];
      return passedFunction.call(withAsync, grunt).then(function () {
        grunt.log.error.should.not.have.been.called;
      });
    });
  });
});
