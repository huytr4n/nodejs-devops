/**
 * Main point of server
 */
var express = require('express'),
    app = express(),
    config = require('../config/'),
    port = config.get('app:port');

// dumpmy
app.get('/dumpmy', function (req, res) {
  return res.send({status: 200, message: 'This is dumpmy api'});
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