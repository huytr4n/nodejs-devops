/**
 * Controller manager for REST api
 */
'use strict';

var assert = require('assert'),
  fs = require('fs'),
  path = require('path');

var oop = require('basejs'),
  _ = require('underscore');

var basename = path.basename;

/**
 * @class
 */
var ControllerManager = oop.extend({

  /**
   * @constructor
   */
  constructor: function (opts) {
    this.app = opts.app;
    this.controllers = {};
  },

  /**
   * Init handlers read from ./controllers folder
   */
  initControllers: function (fn) {
    var self = this,
      app = this.app;

    fs.readdirSync(path.join(__dirname, '/../controllers')).forEach(function (filename) {
      if (!/\.js$/.test(filename)) {
        return;
      }

      var name = basename(filename, '.js');
      var ConstrollerClass = require('./../controllers/' + name);
      var constroller = new ConstrollerClass({app: app}),
        constrollerName = constroller.controllerName || name;

      self.controllers[constrollerName] = constroller;
    });

    fn && fn();

    return this;
  },

  /**
   * Handler rest api
   */
  handle: function (opts, fn) {
    assert(opts.controller, 'Constroller is required');

    var constroller = this.controllers[opts.controller];

    // delegate for invidule controller
    if (constroller) {
      constroller.handle(opts, fn);
    } else {
      return fn && fn('Wrong request');
    }
  },

  /**
   * Dump all apis support by this web app
   */
  dumpAPIs: function () {
    var results = {};

    _.each(this.controllers, function (obj, name) {
      results[name] = obj.dumpAPIs(name);
    });

    return results;
  }

});

/**
 * Expose.
 */
module.exports = ControllerManager;
