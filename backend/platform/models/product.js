/**
 * Product schema
 */
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = new Schema({
  name: String,
  price: Number,
  currency: String,
  type: String,
  createdAt: {type: Date, default: new Date()}
});

// make expose id for serialize
productSchema.set('toJSON', {virtuals: true});

module.exports = mongoose.model('DBProduct', productSchema);
