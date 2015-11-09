/**
 * Main point of server
 */
var express = require('express');
var config = require('../config/');
var app = express();
var port = config.get('app:port');

// dumpmy
app.get('/dumpmy', function (req, res) {
  return res.send({status: 200, message: 'This is dumpmy api'});
});

// index
app.get('/', function (req, res) {
  return res.send({status: 200, message: 'Index page is simple'});
});

/**
 * Expose.
 */
module.exports = {
  start: function (fn) {
    console.log('start application at port', port);
    app.listen(port, fn);
  }
};
