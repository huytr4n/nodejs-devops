'use strict';

var _ = require('underscore');
var mongooseConnectionManager = require('../utils/mongoose-connection-manager'),
  BaseDBService = require('./base-db-service');

require('mongoose-pagination');

module.exports = BaseDBService.extend({

  modelClass: null,

  /**
   * @overriden
   */
  init: function (fn) {
    mongooseConnectionManager.connect(this.app.conf.get('database:mongodb:connectionString'), fn);
  },

  /**
   * @overriden
   */
  terminal: function (fn) {
    mongooseConnectionManager.disconnect();
    fn && fn();
  },

  /**
   * Count total records
   */
  countTotal: function (fn) {
    this.modelClass.count(fn);
  },

  /**
   * Get all user in db
   */
  getAll: function (fn) {
    this.modelClass.find(fn);
  },

  /**
   * Find one records
   */
  getOne: function (opts, fn) {
    this.modelClass.findOne(opts, fn);
  },

  getById: function (id, fn) {
    this.modelClass.findById(id, fn);
  },

  /**
   * Return list data with paging
   */
  list: function (opts, fn) {
    var searchOpts = opts.search || {},
      limit = opts.limit || 200,
      offset = opts.offset || 0,
      sortOpts = opts.sort || {
        _id: -1
      },
      responseFields = opts.fields || null,
      findQuerySet = this.modelClass.find(searchOpts, responseFields);

    if (limit) {
      findQuerySet = findQuerySet.limit(limit);
    }

    findQuerySet
      .skip(offset)
      .sort(sortOpts)
      .exec(function (err, datas) {
        findQuerySet.count().exec(function (err, count) {
          fn(err, datas, count);
        });
      });
  },

  /**
   * Find records
   *
   * @param {Object}   opt
   *                   opt.paginate
   *                   opt.sort
   *                   opt.search
   *                   opt.fields
   * @param {Function} fn  - Callback function
   */
  find: function (opt, fn) {
    var paginate = opt.paginate || {
        page: 0,
        limit: 100
      },
      sortOpts = opt.sort || {
        _id: -1
      },
      searchOpts = opt.search || {},
      responseFields = opt.fields || null;

    var findQuerySet = null,
      modelClass = this.modelClass;
    if (responseFields) {
      findQuerySet = modelClass.find(searchOpts, responseFields);
    } else {
      findQuerySet = modelClass.find(searchOpts);
    }

    var perPage = paginate.limit,
      page = paginate.page;

    // query & paging
    findQuerySet
      .limit(perPage)
      .skip(perPage * page)
      .sort(sortOpts)
      .exec(function (err, datas) {
        findQuerySet.count().exec(function (err, count) {
          fn(err, datas, count);
        });
      });
      // .paginate(paginate.page, paginate.limit, fn);
  },

  /**
   * Create new record
   */
  create: function (data, fn) {
    var Model = this.modelClass;
    var entity = new Model(data);
    entity.save(fn);
  },

  /**
   * Find & update
   */
  updateById: function (id, data, fn) {
    this.modelClass.findByIdAndUpdate(id, data, fn);
  },

  /**
   * Update
   */
  update: function (id, data, fn) {
    this.modelClass.findOne({_id: id}, function (err, model) {
      if (model) {
        _.each(data, function (value, key) {
          model[key] = value;
        });
        model.save(fn);
      } else {
        // self.create(data, fn);
        fn && fn(null);
      }
    });
  },

  /**
   * Remove object by id
   */
  del: function (id, fn) {
    this.modelClass.findByIdAndRemove(id, fn);
  },

  /**
   * Remove documents by codition
   */
  delBy: function (opts, fn) {
    this.modelClass.remove(opts, fn);
  },

  /**
   * Check if document existed or not
   */
  exists: function (opts, fn) {
    this.modelClass
      .find(opts)
      .count()
      .exec(function (err, count) {
        if (err) {
          return fn(false);
        }
        return fn(count > 0);
      });
  }

});
