var Lab = require('lab');
var lab = exports.lab = Lab.script();
var server = require('../server/');

// dummy test
lab.test('returns true when 1 + 1 equals 2', function (done) {
  done();
});

// turn on server
server.start(function () {
  console.log('server is started');
});
