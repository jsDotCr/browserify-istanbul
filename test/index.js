var browserify = require('browserify');
var istanbul = require('../');
var babelify = require('babelify');
var vm = require('vm');
var assert = require('assert');

describe('browserify-istanbul', function() {
  it('should transform using default options', function(done) {
    browserify(__dirname + '/../testdata/tests/file.js')
      .transform(istanbul)
      .bundle(function(err, src) {
        if (err)
          return done(err);
          
        var ctx = {};
        vm.runInNewContext(src, ctx);
        
        assert.equal(typeof ctx.__coverage__, 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/file.js')], 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/ignored.js')], 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/tests/file.js')], 'undefined');
        done();
      });
  });

  it('should transform using default options (ES2015)', function(done) {
    browserify(__dirname + '/../testdata/tests/file-es2015.js')
      .transform(babelify.configure({
        sourceMaps: 'both'
      }))
      .transform(istanbul)
      .bundle(function(err, src) {
        if (err)
          return done(err);

        var ctx = {};
        vm.runInNewContext(src, ctx);

        assert.equal(typeof ctx.__coverage__, 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/file-es2015.js')], 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/ignored-es2015.js')], 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/tests/file-es2015.js')], 'undefined');
        done();
      });
  });
  
  it('should support ignore option in addition to default ignore option', function(done) {
    browserify(__dirname + '/../testdata/tests/file.js')
      .transform(istanbul({ ignore: ['**/ignored.js'] }))
      .bundle(function(err, src) {
        if (err)
          return done(err);
          
        var ctx = {};
        vm.runInNewContext(src, ctx);
        
        assert.equal(typeof ctx.__coverage__, 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/file.js')], 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/ignored.js')], 'undefined');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/tests/file.js')], 'undefined');
        done();
      });
  });

  it('should support ignore option in addition to default ignore option (ES2015)', function(done) {
    browserify(__dirname + '/../testdata/tests/file-es2015.js')
      .transform(babelify.configure({
        sourceMaps: 'both'
      }))
      .transform(istanbul({ ignore: ['**/ignored-es2015.js'] }))
      .bundle(function(err, src) {
        if (err)
          return done(err);

        var ctx = {};
        vm.runInNewContext(src, ctx);

        assert.equal(typeof ctx.__coverage__, 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/file-es2015.js')], 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/ignored-es2015.js')], 'undefined');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/tests/file-es2015.js')], 'undefined');
        done();
      });
  });

  it('should support disabling defaultIgnore', function(done) {
    browserify(__dirname + '/../testdata/tests/file.js')
      .transform(istanbul({ ignore: ['**/ignored.js'], defaultIgnore: false }))
      .bundle(function(err, src) {
        if (err)
          return done(err);
          
        var ctx = {};
        vm.runInNewContext(src, ctx);
        
        assert.equal(typeof ctx.__coverage__, 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/file.js')], 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/ignored.js')], 'undefined');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/tests/file.js')], 'object');
        done();
      });
  });

  it('should support disabling defaultIgnore (ES2015)', function(done) {
    browserify(__dirname + '/../testdata/tests/file-es2015.js')
      .transform(babelify.configure({
        sourceMaps: 'both'
      }))
      .transform(istanbul({ ignore: ['**/ignored-es2015.js'], defaultIgnore: false }))
      .bundle(function(err, src) {
        if (err)
          return done(err);

        var ctx = {};
        vm.runInNewContext(src, ctx);

        assert.equal(typeof ctx.__coverage__, 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/file-es2015.js')], 'object');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/src/ignored-es2015.js')], 'undefined');
        assert.equal(typeof ctx.__coverage__[require.resolve(__dirname + '/../testdata/tests/file-es2015.js')], 'object');
        done();
      });
  });
  
  it('should handle invalid .js', function(done) {
      browserify(__dirname + '/../testdata/tests/invalid.js')
          .transform(istanbul())
          .bundle(function(err, src) {
              assert.equal(typeof err, 'object');
              assert.notEqual(err, null, 'Should emit error');
              
              done();
          });
  });

  it('should handle invalid .js (ES2015)', function(done) {
      browserify(__dirname + '/../testdata/tests/invalid-es2015.js')
          .transform(babelify.configure({
            sourceMaps: 'both'
          }))
          .transform(istanbul())
          .bundle(function(err, src) {
              assert.equal(typeof err, 'object');
              assert.notEqual(err, null, 'Should emit error');

              done();
          });
  });
});
