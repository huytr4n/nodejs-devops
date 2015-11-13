/**
 * Product controller
 */
'use strict';

var BaseController = require('./../server/rest-controller-base');

var ProductController = BaseController.extend({

  /**
   * @override
   */
  dbServiceName: 'dbProduct'
});

module.exports = ProductController;
