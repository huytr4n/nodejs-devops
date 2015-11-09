var Lab = require('lab');
var lab = exports.lab = Lab.script();
var http = require('http');

var server = require('../server/');

var DUMMY_URL = 'http://127.0.0.1:9090/dumpmy';
var INDEX_URL = 'http://127.0.0.1:9090/';

// start server before testing
server.start(function () {
  console.log('server is started');

  lab.test('server is alive', function (done) {
    http.get(DUMMY_URL, function (res) {
      if (res.statusCode === 200) {
        done();
      } else {
        done({error: res.statusCode});
      }
    });
  });

  lab.test('index is up', function (done) {
    http.get(INDEX_URL, function (res) {
      if (res.statusCode === 200) {
        done();
      } else {
        done({error: res.statusCode});
      }
    });
  });
});
