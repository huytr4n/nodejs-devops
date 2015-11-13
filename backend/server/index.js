/**
 * Dashboard api server
 */
'use strict';

var assert = require('assert'),
  http = require('http');

var async = require('async'),
  express = require('express'),
  methodOverride = require('method-override'),
  bodyParser = require('body-parser'),
  logger = require('morgan');

var log = require('../utils/logger'),
  ServiceBase = require('../utils/service'),
  router = require('./router'),
  DatabaseManager = require('../platform');

/**
 * Web admin tool server
 *
 * @param {Configs} opts.configs
 *      The configuration
 *
 * @return itself
 */
var Server = ServiceBase.extend({

  constructor: function (opts) {
    opts = opts || {};

    var self = this;
    self.conf = opts.configs;

    // Create express application
    // --------------------------
    var webapp = self.webapp = express();

    // Define database manager
    this.db = new DatabaseManager(this);

    // webapp.use(express.logger());
    // webapp.use(express.json());
    // webapp.use(express.urlencoded());
    webapp.use(logger('dev'));
    webapp.use(bodyParser.json());
    webapp.use(bodyParser.urlencoded({extended: false}));
    webapp.use(methodOverride('X-HTTP-Method-Override'));

    // CrossDomain middleware
    var allowCrossDomain = function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    };
    webapp.use(allowCrossDomain);
    // webapp.use(webapp);

    // Config router
    router(this);
  },

  /**
   * Starts the service
   */
  onStart: function (callback) {
    var self = this,
      conf = this.conf;

    async.parallel([
      function initialDatabase(callback) {
        log.info('Init Database service ...');
        self.db.init([
          'dbProduct'
        ], function (err) {
          if (err) {
            return callback(err);
          }

          callback && callback();
        });
      },
      function startAPIServer(callback) {
        var port = conf.get('app:port');

        log.info('Dashboard api started successfully at port: ', port);
        self.httpServer = http.createServer(self.webapp).listen(port, callback);
      }
    ],
    function (err, results) {
      assert.ok(!err, 'E8884883388. Couldn\'t starts server');
      self.onPreStart();
      callback && callback(err, results);
    });
  },

  onStop: function (callback) {
    this.httpServer.close();
    callback && callback();
  },

  // Event handlers from pubsub
  // --------------------------

  onPreStart: function () {
    // TODO
  }
});

module.exports = Server;
