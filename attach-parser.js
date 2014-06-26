'use strict';

var Json = /** @type Json */ require('./parser/json');
var Multipart = /** @type Multipart */ require('./parser/multipart');
var Parser = /** @type Parser */ require('./parser/parser');
var Raw = /** @type Raw */ require('./parser/raw');
var Urlencoded = /** @type Urlencoded */ require('./parser/urlencoded');

var _ = require('lodash-node');
var bundled = [Urlencoded, Multipart, Json];
var inherit = require('inherit');

/**
 * @class AttachParser
 * */
var AttachParser = inherit(/** @lends AttachParser.prototype */ {

    /**
     * @private
     * @memberOf {AttachParser}
     * @method
     *
     * @constructs
     *
     * @param {Number} [params.length]
     * @param {Number} [params.limit]
     * */
    __constructor: function (params) {

        /**
         * @public
         * @memberOf {AttachParser}
         * @property
         * @type {Parser}
         * */
        this.parser = this.__createParser(params) ||
            //  Если парсер не был содан то создастся
            // дефолтный для прозрачности
            new Parser(params);

        /**
         * @private
         * @memberOf {AttachParser}
         * @property
         * @type {Object}
         * */
        this.__templates = {};

        this._addTemplate('multipart', function (res) {

            return {
                type: this.parser.type,
                input: res[0],
                files: res[1]
            };
        });
    },

    /**
     * @private
     * @memberOf {AttachParser}
     * @method
     *
     * @param {Object} params
     *
     * @returns {*}
     * */
    __createParser: function (params) {
        /*eslint new-cap: 0*/
        var length;

        if ( !params ) {

            return null;
        }

        length = +params.length;

        //  Не передана длина тела (content-length),
        // предполагается что в таком случае его просто нет
        if ( _.isNaN(length) || 0 === length ) {

            return null;
        }

        //  Если парсер не был найден то будет скачано raw-body
        return this._findParser(params) || new Raw(params);
    },

    /**
     * Этот метод можно переопределить
     * если хочется добавить свои парсеры
     *
     * @protected
     * @memberOf {AttachParser}
     * @method
     *
     * @param {Object} params
     *
     * @returns {Parser|null}
     * */
    _findParser: function (params) {

        var i;
        var l;

        for ( i = 0, l = bundled.length; i < l; i += 1 ) {

            if ( bundled[i].matchMedia(params) ) {

                return new bundled[i](params);
            }
        }

        return null;
    },

    /**
     * @public
     * @memberOf {AttachParser}
     * @method
     *
     * @param {Object} stream
     *
     * @returns {vow.Promise}
     * */
    parse: function (stream) {

        return this.parser.parse(stream).
            then(this.__applyTemplate, this);
    },

    /**
     * @protected
     * @memberOf {AttachParser}
     * @method
     *
     * @param {String} type
     * @param {Function} func
     * */
    _addTemplate: function (type, func) {
        this.__templates[type] = _.bind(func, this);
    },

    /**
     * @private
     * @memberOf {AttachParser}
     * @method
     *
     * @param {*} res
     *
     * @returns {Object}
     * */
    __applyTemplate: function (res) {

        if ( _.has(this.__templates, this.parser.type) ) {

            return this.__templates[this.parser.type](res);
        }

        return {
            type: this.parser.type,
            input: res
        };
    }

});

module.exports = AttachParser;
