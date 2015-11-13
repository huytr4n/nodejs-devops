'use strict';

var _ = require('underscore');

var ControllerManager = require('./controller-manager'),
  log = require('../utils/logger');

/**
 * Router configuration endpoint
 */
module.exports = function (app) {
  var webapp = app.webapp,
    conf = app.conf,
    controllerManager = new ControllerManager({app: app}).initControllers();

  /**
   * api handler
   */
  var apiHandler = function (req, res, next) {
    var requestParams = {
      controller: req.params.controller,

      // action can be an id
      action: req.params.action,
      query: req.query,
      method: req.method ? req.method.toString().toLowerCase() : null,
      data: req.body
    };

    log.info('Dashboard REST', requestParams);

    // avoid log to much data we need add req, res & next later
    requestParams = _.extend(requestParams, {
      req: req,
      res: res,
      next: next
    });

    // delegate request to
    controllerManager.handle(requestParams, function (err, result) {
      let statusCode = 200;

      // always use json
      res.set('Content-Type', 'application/json');
      if (err) {
        log.error('Dashboard REST api call fail', err);
        if (typeof err === 'string') {
          res.send(404, JSON.stringify(err));
        } else {
          res.send(err.errCode, err.errMsg);
        }
      } else {
        // getting custom status code
        if (result.statusCode) {
          statusCode = _.clone(result.statusCode);
          delete result.statusCode;
        }

        res.send(statusCode, result);
      }
    });
  };

  /**
   * REST api router
   */
  webapp.all('/api/:controller/:action', apiHandler);
  webapp.all('/api/:controller', apiHandler);

  // dummy api
  webapp.get('/dumpmy', function (req, res) {
    res.status(200).send({alive: true});
  });

  // index
  webapp.get('/', function (req, res) {
    res.status(200).send('index page');
  });
};
