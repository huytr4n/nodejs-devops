/**
 * REST controller base
 */
'use strict';

var assert = require('assert');

var _ = require('underscore'),
  oop = require('basejs');

var Controller = oop.extend({

  /**
   * Sub object must override this property
   */
  dbServiceName: null,

  /**
   * Sub object should overriden this property
   * if not, sub's file name will be used instead
   */
  controllerName: null,

  /**
   * Provide support method & binding function of current controller object
   */
  methods: {
    get: 'get',
    post: 'post',
    put: 'put',
    delete: 'del',
    head: 'head',
    patch: 'patch'
  },

  /**
   * Provide support action & binding function of current controller object
   * Sub object should override this property to provide actions
   */
  actions: {
    // format
    // 'actionName': {method: '', fn: ''}
  },

  /**
   * @constructor
   */
  constructor: function (opts) {
    // assert(this.dbServiceName, 'Sub object must define dbServiceName');
    this.app = opts.app;
    this.db = opts.app.db;
  },

  /**
   * Retrieve db service of this controller
   */
  getService: function () {
    return this.db.getInstance(this.dbServiceName);
  },

  /**
   * Handle request and delegate to correct perform method
   *
   * @param {string} opts.method The method of request (POST, GET, PUT or DELETE)
   * @param {string} opts.action The action (or id), this is optional
   * @param {object} opts.query The query of request url
   */
  handle: function (opts, callback) {
    assert(opts.method, 'Method is require');

    if (this.methods[opts.method]) {
      // cleaning form data before process
      this.preProcessingFormData(opts);

      // delegate
      return this.processMethod(opts.method, opts, callback);
    }
    return callback && callback('This method is not supported');
  },

  /**
   * Process rest method
   */
  processMethod: function (method, opts, callback) {
    if (opts.action && this.actions[opts.action]) {
      var actionObj = this.actions[opts.action];

      if (actionObj.method === method && this[actionObj.fn]) {
        // perform action
        return this[actionObj.fn](opts, callback);
      }
    }

    // perform default method
    this[this.methods[method]](opts, callback);
  },

  /**
   * Dump all apis support by this controller
   */
  dumpAPIs: function (name) {
    var results = [];

    // support methods
    _.each(this.methods, function (func, methodName) {
      var result = {};

      result[methodName.toUpperCase()] = ['/', name, '/:id'].join('');
      results.push(result);

      if (methodName === 'get') {
        result = {};
        result[methodName.toUpperCase()] = ['/', name].join('');
        results.push(result);
      }
    });

    // support actions
    _.each(this.actions, function (opt, action) {
      var result = {};
      result[opt.method.toUpperCase()] = ['/', name, '/', action].join('');
      results.push(result);
    });

    return results;
  },

  /**
   * Normalize qurey param for GET method
   */
  normalizeQueryParam: function (opts) {
    return this._normalizeQueryParam(opts);
  },

  _normalizeQueryParam: function (opts) {
    var search = {},
      sortField = null,
      sortType = null,
      params = {
        search: search
      };

    if (opts.query) {
      _.each(opts.query, function (value, key) {
        if (key === 'limit' || key === 'offset') {
          params[key] = value;
        } else if (key === 'sortField') {
          sortField = value;
        } else if (key === 'sortType') {
          sortType = value;
        } else {
          search[key] = value;
        }
      });

      // check sort
      if (sortField && sortType) {
        params.sort = {};
        params.sort[sortField] = sortType === 'asc' ? 1 : -1;
      }
    }

    return params;
  },

  /**
   * Get list data of collection with paging
   */
  list: function (opts, callback) {
    var self = this;
    this.getService().list(self.normalizeQueryParam(opts), function (err, datas, count) {
      if (err) {
        callback && callback(err);
      } else {
        callback && callback(null, {
          count: count,
          results: self.toJSONs(datas, opts)
        });
      }
    });
  },

  /**
   * Retrive current user
   */
  getCurrentUser: function (req) {
    if (!req || !req.user) {
      return null;
    }

    return {
      _id: req.user.id ? req.user.id : req.user._id,
      name: req.user.name
    };
  },

  /**
   * Retrive current user id
   */
  getCurrentUserId: function (req) {
    if (!req || !req.user) {
      return 'dumpuserid';
    }

    return req.user.id ? req.user.id : req.user._id;
  },

  /**
   * Retrive current user role id
   */
  getCurrentUserRoleId: function (req) {
    if (!req || !req.user) {
      return 'guest';
    }

    return req.user.roleId;
  },

  /**
   * Check role of current user equal to @role
   */
  checkRole: function (req, role) {
    var currentUserRoleId = this.getCurrentUserRoleId(req);

    return currentUserRoleId === role;
  },

  /**
   * Pre processing data before transfer to correct command
   */
  preProcessingFormData: function (opts) {
    if (opts.data && (opts.method === 'post' || opts.method === 'put')) {
      delete opts.data._id;
      delete opts.data._v;
    }
  },

  // serialize methods
  // -----------------

  /**
   * Serialize db object to json
   * this is dummies method, we should override for advance features
   */
  toJSON: function (obj, opts) {
    return obj;
  },

  /**
   * Serialize db objects to array of json
   * this is dummies method, we should override for advance features
   */
  toJSONs: function (objs, opts) {
    return objs;
  },

  // perform methods
  // those method can be override by sub object
  // ------------------------------------------
  get: function (opts, callback) {
    var self = this;
    if (opts.action) {
      this.getService().getById(opts.action, function (err, data) {
        callback(err, self.toJSON(data, opts));
      });
    } else {
      // filter
      this.list(opts, callback);
    }
  },

  /**
   * Create object or perform an action
   */
  post: function (opts, callback) {
    this.getService().create(opts.data, function (err, results) {
      // set status code
      results.statusCode = 201;
      // binding virtual id
      if (results && typeof results === 'object') {
        results.id = results._id;
      }

      return callback(err, results);
    });
  },

  /**
   * Update object
   */
  put: function (opts, callback) {
    if (opts.action) {
      this.getService().update(opts.action, opts.data, function (err, result) {
        // binding virtual id
        if (result && typeof result === 'object') {
          result.id = result._id;
        }

        return callback(err, result);
      });
    } else {
      return callback && callback('Id is required');
    }
  },

  /**
   * Update object (update a part of model instead of entry object)
   */
  patch: function (opts, callback) {
    this.put(opts, callback);
  },

  /**
   * Delete one object in collection
   *
   * @param {string} opts.action The id of object
   */
  del: function (opts, callback) {
    if (opts.action) {
      this.getService().del(opts.action, function (err, result) {
        // set status code
        result.statusCode = 204;

        return callback(err, result);
      });
    } else {
      return callback && callback('Id is required');
    }
  },

  /**
   * Head method
   */
  head: function (opts, callback) {
    // TODO: consider to implement
    callback && callback();
  }

});

module.exports = Controller;
