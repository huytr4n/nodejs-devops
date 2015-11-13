/**
 * Implement api testing for product api
 */
'use strict';

var Lab = require('lab');
var lab = exports.lab = Lab.script();
var http = require('http');
var request = require('request');
var Code = require('code');

var server = require('../server/');
var ROOT_API = 'http://127.0.0.1:9090/api/products';
var product = {
  name: 'Node.js notebook',
  price: 10,
  currency: 'USD',
  type: 'book'
};

// start server before testing
// POST
lab.test('User can add a product', function (done) {
  request({
    url: ROOT_API,
    method: 'POST',
    body: JSON.stringify(product),
    headers: {
      'content-type': 'application/json'
    }
  }, function (error, res, body) {
    // status code must be 201
    Code.expect(res.statusCode).to.equal(201);

    // parsing body
    body = JSON.parse(body);

    // body must be json
    Code.expect(typeof body).to.equal('object');

    Code.expect(body.name).to.equal(product.name);
    Code.expect(body.price).to.equal(product.price);
    Code.expect(body.currency).to.equal(product.currency);
    Code.expect(body.type).to.equal(product.type);
    Code.expect(typeof body.id).to.equal('string');
    Code.expect(typeof body.createdAt).to.equal('string');

    // set product id
    product.id = body.id;

    done();
  });
});

// PUT
lab.test('User can update a product', function (done) {
  // set new value for product
  product.name += ' version 2';
  product.price += 10;
  product.currency = 'VND';
  product.type = 'others';

  request({
    url: [ROOT_API, '/', product.id].join(''),
    method: 'PUT',
    body: JSON.stringify(product),
    headers: {
      'content-type': 'application/json'
    }
  }, function (error, res, body) {
    // status code must be 201
    Code.expect(res.statusCode).to.equal(200);

    // parsing body
    body = JSON.parse(body);

    // body must be json
    Code.expect(typeof body).to.equal('object');

    Code.expect(body.name).to.equal(product.name);
    Code.expect(body.price).to.equal(product.price);
    Code.expect(body.currency).to.equal(product.currency);
    Code.expect(body.type).to.equal(product.type);
    Code.expect(typeof body.id).to.equal('string');
    Code.expect(typeof body.createdAt).to.equal('string');

    done();
  });
});

// GET BY ID
lab.test('User can get product by id', function (done) {
  request({
    url: [ROOT_API, '/', product.id].join(''),
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  }, function (error, res, body) {
    // status code must be 201
    Code.expect(res.statusCode).to.equal(200);

    // parsing body
    body = JSON.parse(body);

    // body must be json
    Code.expect(typeof body).to.equal('object');

    Code.expect(body.name).to.equal(product.name);
    Code.expect(body.price).to.equal(product.price);
    Code.expect(body.currency).to.equal(product.currency);
    Code.expect(body.type).to.equal(product.type);
    Code.expect(typeof body.id).to.equal('string');
    Code.expect(typeof body.createdAt).to.equal('string');

    done();
  });
});

// GET ALL
lab.test('User can get all products', function (done) {
  request({
    url: ROOT_API,
    method: 'GET',
    headers: {
      'content-type': 'application/json'
    }
  }, function (error, res, body) {
    // status code must be 201
    Code.expect(res.statusCode).to.equal(200);

    // parsing body
    body = JSON.parse(body);

    // body must be json
    Code.expect(typeof body).to.equal('object');

    Code.expect(body.count).to.be.above(0);

    done();
  });

  // DELETE
  lab.test('User can remove a product', function (done) {
    request({
      url: [ROOT_API, '/', product.id].join(''),
      method: 'DELETE',
      headers: {
        'content-type': 'application/json'
      }
    }, function (error, res, body) {
      // status code must be 201
      Code.expect(res.statusCode).to.equal(204);

      done();
    });
  });
});
