'use strict';

var _ = require('lodash-node');
var inherit = require('inherit');
var vow = require('vow');

/**
 * @class Parser
 * */
var Parser = inherit(/** @lends Parser.prototype */ {

    /**
     * @protected
     * @memberOf {Parser}
     * @method
     *
     * @constructs
     *
     * @param {*} [params]
     * */
    __constructor: function (params) {

        if ( !_.isObject(params) ) {
            params = {};
        }

        /**
         * compat with https://www.npmjs.org/package/media-typer
         *
         * @public
         * @memberOf {Parser}
         * @property
         * @type {Object}
         * */
        this.params = _.extend({}, this.params, params.parameters, params);
        delete this.params.parameters;

        params = this.params;

        params.limit = +params.limit;

        if ( _.isNaN(params.limit) ) {
            params.limit = Infinity;
        }

        params.length = +params.length;

        if ( _.isNaN(params.length) ) {
            params.length = Infinity;
        }
    },

    /**
     * @public
     * @memberOf {Parser}
     * @method
     *
     * @param {Object} media
     *
     * @returns {vow.Promise}
     * */
    parse: function (media) {
        /* eslint no-unused-vars: 0*/

        return vow.resolve({});
    }

}, {

    /**
     * @public
     * @static
     * @memberOf Parser
     * @method
     *
     * @param {Object} [mixin]
     *
     * @returns {Error}
     * */
    ELIMIT: function (mixin) {
        var err = new RangeError('incoming body body size limit exceeded');

        return _.extend(err, {code: 'ELIMIT'}, mixin);
    },

    /**
     * @public
     * @static
     * @memberOf Parser
     * @method
     *
     *  @param {Object} [mixin]
     *
     * @returns {Error}
     * */
    ELENGTH: function (mixin) {
        var err = new RangeError('incoming http body length does not match');

        return _.extend(err, {code: 'ELENGTH'}, mixin);
    }

});

module.exports = Parser;
