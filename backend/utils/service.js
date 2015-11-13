/**
 *  Server base service
 */
'use strict';

var oop = require('basejs');

var Service = oop.extend({
  start: function (callback) {
    if (this.started) {
      return callback();
    }

    this.started = true;
    return this.onStart(callback);
  },

  onStart: function (callback) {
    return callback();
  },

  stop: function (callback) {
    if (!this.started) {
      return callback();
    }

    this.started = false;
    return this.onStop(callback);
  },

  onStop: function (callback) {
    return callback();
  }
});

module.exports = Service;
