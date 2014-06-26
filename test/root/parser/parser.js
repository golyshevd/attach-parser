'use strict';

var Parser = require('../../../parser/parser');
var Parted = require('../../util/parted');

module.exports = {

    Parser: [
        function (test) {
            var parser;

            parser = new Parser(null);

            test.deepEqual(parser.params, {
                length: Infinity,
                limit: Infinity
            });

            parser = new Parser({
                length: '5',
                limit: 42
            });

            test.deepEqual(parser.params, {
                length: 5,
                limit: 42
            });

            test.done();
        }
    ],

    'Parser.prototype.parse': [
        function (test) {
            var req = new Parted(['h1']);
            var parser = new Parser();

            parser.parse(req).done(function (res) {
                test.deepEqual(res, {});
                test.done();
            });
        }
    ],

    'Parser.ELIMIT': [
        function (test) {

            var error = Parser.ELIMIT({
                test: 'test'
            });

            test.deepEqual(error, {
                code: 'ELIMIT',
                test: 'test'
            });

            test.done();
        }
    ],
    'Parser.ELENGTH': [
        function (test) {

            var error = Parser.ELENGTH({
                test: 'test'
            });

            test.deepEqual(error, {
                code: 'ELENGTH',
                test: 'test'
            });

            test.done();
        }
    ]
};
