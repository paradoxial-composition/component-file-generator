var assert = require('assert');
var ask = require('./ask');

it('when running generator by keyword as params `reactjs`\n', function() {
    try{
        var src = require('../index');
        src.exec('reactjs');
        assert.ok(true);
    }
    catch (e) {
        assert.fail(e.message)
    }
});

describe('ask', function () {
  it('asks a question', function (done) {
    setTimeout(done, 500);
    return ask('test')
      .then(function () {
        assert.ok(true);
      });
  });
});
