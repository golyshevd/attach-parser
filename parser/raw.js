'use strict';

var Parser = /** @type Parser */ require('./parser');

var inherit = require('inherit');
var vow = require('vow');

/**
 * @class Raw
 * @extends Parser
 * */
var Raw = inherit(Parser, /** @lends Raw.prototype */ {

    /**
     * @public
     * @memberOf {Raw}
     * @method
     *
     * @param {Object} stream
     *
     * @returns {vow.Promise}
     * */
    parse: function (stream) {

        return download(stream, this.params);
    },

    /**
     * @public
     * @memberOf {Raw}
     * @property
     * @type {String}
     * */
    type: 'raw'

});

/**
 * @private
 * @static
 * @memberOf Raw
 * @method
 *
 * @param {Object} stream
 * @param {Object} params
 *
 * @returns {vow.Promise}
 * */
function download (stream, params) {

    var buf = [];
    var received = 0;
    var defer = vow.defer();

    function cleanup () {
        stream.removeListener('data', data);
        stream.removeListener('error', error);
        stream.removeListener('end', end);
        stream.removeListener('close', cleanup);
    }

    function data (chunk) {

        if ( !Buffer.isBuffer(chunk) ) {
            chunk = new Buffer(String(chunk));
        }

        received += chunk.length;

        if ( received > params.limit ) {
            stream.emit('error', Parser.ELIMIT({
                expected: params.limit,
                received: received
            }));

            return;
        }

        buf[buf.length] = chunk;
    }

    function error (err) {

        if ( 'function' === typeof stream.pause ) {
            stream.pause();
        }

        cleanup();
        defer.reject(err);
    }

    function end () {

        if ( Infinity !== params.length && received !== params.length ) {
            stream.emit('error', Parser.ELENGTH({
                expected: params.length,
                received: received
            }));

            return;
        }

        cleanup();
        defer.resolve(Buffer.concat(buf));
    }

    stream.on('data', data);
    stream.on('error', error);
    stream.on('end', end);
    stream.on('close', cleanup);

    return defer.promise();
}

module.exports = Raw;
