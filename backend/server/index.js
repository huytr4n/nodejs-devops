/**
 * Main point of server
 */
var express = require('express'),
    app = express(),
    port = process.env.PORT || 9090;

// dumpmy
app.get('/dumpmy', function (req, res) {
  return res.send({status: 200, message: 'This is dumpmy api'});
});

/**
 * Expose.
 */
module.exports = {
  start: function (fn) {
    app.listen(port, fn);
  }
};