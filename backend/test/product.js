/**
 * Implement unit testing for product api
 */
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var http = require('http');
var request = require('request');

var server = require('../server/');
var ROOT_API = 'http://127.0.0.1:9090/api/products';

// start server before testing
// POST
lab.test('User can add a product', function (done) {
  done();
});

// PUT
lab.test('User can update a product', function (done) {
  done();
});

// GET BY ID
lab.test('User can get product by id', function (done) {
  done();
});

// GET ALL
lab.test('User can get all products', function (done) {
  done();
});

// DELETE
lab.test('User can remove a product', function (done) {
  done();
});
