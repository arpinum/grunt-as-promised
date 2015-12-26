'use strict';

require('chai').use(require('sinon-chai')).should();
var Bluebird = require('bluebird');
var sinon = require('sinon');
var GruntAsPromised = require('./GruntAsPromised');

describe('Grunt as promised', function () {

  var grunt;
  var withAsync;

  beforeEach(function () {
    grunt = {
      registerTask: sinon.spy(),
      log: {error: sinon.spy()}
    };
    new GruntAsPromised().configure(grunt);
    withAsync = {async: sinon.stub()};
  });

  context('when registering a task', function () {
    it('should pass the name and a function to grunt', function () {
      grunt.registerPromiseTask('the name', function () {
      });

      grunt.registerTask.lastCall.args.should.have.lengthOf(2);
      grunt.registerTask.should.have.been.calledWith('the name');
      grunt.registerTask.lastCall.args[1].should.be.an.instanceOf(Function);
    });

    it('should tell grunt the execution is done after promise is resolved', function () {
      var done = sinon.spy();
      withAsync.async.returns(done);

      grunt.registerPromiseTask('', Bluebird.resolve);

      var passedFunction = grunt.registerTask.lastCall.args[1];
      return passedFunction.call(withAsync, grunt).then(function () {
        done.should.have.been.called;
      });
    });

    it('should tell grunt the execution is done with error after promise is rejected', function () {
      var done = sinon.spy();
      withAsync.async.returns(done);

      grunt.registerPromiseTask('', function () {
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

      grunt.registerPromiseTask('', function () {
        return Bluebird.reject();
      });

      var passedFunction = grunt.registerTask.lastCall.args[1];
      return passedFunction.call(withAsync, grunt).then(function () {
        grunt.log.error.should.not.have.been.called;
      });
    });
  });
});
