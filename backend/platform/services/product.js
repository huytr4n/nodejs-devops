/**
 * Product services
 */
'use strict';

var BaseDBService = require('../base-mongo-service'),
  productModel = require('../models/product');

module.exports = BaseDBService.extend({
  modelClass: productModel
});
