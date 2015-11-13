/**
 * Mongodb connection manager
 */
'use strict';

var _ = require('underscore');
var mongoose = require('mongoose');
var db = mongoose.connection;
var isConnected = false;
var isConnecting = false;
var fnQueue = [];

module.exports = {

  connect: function (connectionString, fn) {
    fnQueue.push(fn);
    if (isConnecting) {
      return;
    }

    isConnecting = true;

    if (isConnected) {
      fn && fn();
    } else {
      mongoose.connect(connectionString);
      db.once('open', function callback() {
        isConnecting = false;
        isConnected = true;
        _.each(fnQueue, function (oneFn) {
          oneFn && oneFn();
        });
      });
    }
  },

  disconnect: function () {
    if (isConnected) {
      mongoose.disconnect();
    }
  }
};
