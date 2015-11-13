var Lab = require('lab');
var lab = exports.lab = Lab.script();
var http = require('http');
var Code = require('code');

var DUMMY_URL = 'http://localhost:9090/dumpmy';
var INDEX_URL = 'http://localhost:9090/';

lab.test('server is alive', function (done) {
  http.get(DUMMY_URL, function (res) {
    Code.expect(res.statusCode).to.equal(200);
    done();
  });
});

lab.test('index is up', function (done) {
  http.get(INDEX_URL, function (res) {
    Code.expect(res.statusCode).to.equal(200);
    done();
  });
});
