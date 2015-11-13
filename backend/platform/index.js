'use strict';

var oop = require('basejs'),
  async = require('async'),
  _ = require('underscore');
var log = require('../utils/logger');

// Services
var DBProduct = require('./services/product');

/**
 * List of database service
 */
var servicesClasses = {
  dbProduct: DBProduct
};

/**
 * @class
 */
var DatabaseManager = oop.extend({

  constructor: function (app) {
    this.container = {};
    this.app = app;
    return this;
  },

  /**
   * Initial service instances
   */
  init: function (neededServices, fn) {
    var container = this.container,
      app = this.app;
    async.each(neededServices, function (neededService, done) {
      var service = container[neededService] = new servicesClasses[neededService](app);
      service.init(done);
    }, function (error) {
      if (error) {
        log.error('Database service init fail', error);
      } else {
        log.info('Database service init success');
      }

      fn(error);
    });
  },

  /**
   * Destroy server
   */
  destroy: function () {
    _.each(this.container, function (instance) {
      instance.terminal();
    });
  },

  /**
   * Get instance of service by name
   */
  getInstance: function (name) {
    return this.container[name];
  }

}, servicesClasses);

/**
 * Expose.
 */
module.exports = DatabaseManager;
