'use strict';

var oop = require('basejs');

module.exports = oop.extend({

  constructor: function (app, opts) {
    this.app = app;
    this.opts = opts;
  },

  /**
  * Initialize service
  * Should be overriden by subclass
  */
  init: function (fn) {
    if (typeof fn === 'object') {
      fn();
    }
  },

  /**
   * Terminal service
   * Should be overriden by subclass
  */
  terminal: function (fn) {
    if (typeof fn === 'object') {
      fn();
    }
  }
});
