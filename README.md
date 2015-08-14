# browserify-istanbul

A [browserify](http://github.com/substack/node-browserify) transform for the [istanbul](https://github.com/gotwarlost/istanbul) code coverage tool, with source map support for coverage reporting.

## Installing

    npm install jsdotcr/browserify-istanbul
    
## Usage

There are several ways to register browserify transforms: on the command line, in your `package.json`, or using the browserify API.
You can use all of these with browserify-istanbul: see the [browserify docs](http://github.com/substack/node-browserify) for more info.

There are a few options available to browserify-istanbul when you use it from JavaScript.  They are shown in the following code example:

```javascript
var istanbul = require('browserify-istanbul');

// use without any options...
browserifyBundle.transform(istanbul);

// or with some options...
browserifyBundle.transform(istanbul({
  // ignore these glob paths (the ones shown are the defaults)
  ignore: ['**/node_modules/**', '**/bower_components/**', '**/test/**', '**/tests/**', '**/*.json'],
  
  // by default, any paths you include in the ignore option are ignored 
  // in addition to the defaults. set the defaultIgnore option to false 
  // to only ignore the paths you specify.
  defaultIgnore: true
}));
```

Or in your `karma.conf.js` file:

```javascript
var istanbul = require('browserify-istanbul');

module.exports = function(karma) {
  karma.set({
    frameworks: ['browserify', 'mocha'],
    preprocessors: {
      'test/**/*.js': ['browserify'],
      'src/**/*.js': ['browserify', 'coverage']
    },
    browsers: ['PhantomJS'],
    logLevel: 'LOG_DEBUG',
    autoWatch: true,
    colors: true,
    browserify: {
      debug: true,
      transform: [
        ['babelify', { sourceMaps: 'both' }],
        istanbul
      ],
      bundleDelay: 1000
    },
    reporters: ['progress', 'coverage'],
    coverageReporter: {
      reporters: [
        {
          type: 'html',
          dir: 'test/coverage-html/',
          subdir: function(browser) {
            return browser.toLowerCase().split(/[ /-]/)[0];
          }
        },
        {
          type: 'lcovonly',
          dir: 'test/coverage-lcov/',
          subdir: function(browser) {
            return browser.toLowerCase().split(/[ /-]/)[0];
          }
        }
      ]
    }
  });
};
```

## License

MIT
