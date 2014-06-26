'use strict';

var AttachParser = require('../../../attach-parser');

var mediaTyper = require('media-typer');
var http = require('../util/http');

var _ = require('lodash-node');

module.exports = {

    'AttachParser.prototype.parse': [
        function (test) {

            http({
                method: 'get'
            }, function (req, res) {

                var parser = new AttachParser();

                parser.parse(req).done(function (data) {
                    test.deepEqual(data, {
                        input: {},
                        type: void 0
                    });
                    res.end();
                });
            }, function (err) {
                test.ok(!err);
                test.done();
            });
        },
        function (test) {
            http({
                method: 'post',
                body: 'asd'
            }, function (req, res) {
                var parser = new AttachParser();

                parser.parse(req).done(function (data) {
                    test.deepEqual(data, {
                        input: {},
                        type: void 0
                    });
                    res.end();
                });
            }, function (err) {
                test.ok(!err);
                test.done();
            });
        },
        function (test) {
            http({
                method: 'get',
                body: 'asd',
                headers: {
                    'content-type': 'text/plain'
                }
            }, function (req, res) {

                var mime = mediaTyper.parse(req.headers['content-type']);

                var parser = new AttachParser(_.extend(mime, {
                    length: req.headers['content-length']
                }));

                parser.parse(req).done(function (data) {
                    test.deepEqual(data, {
                        input: new Buffer('asd'),
                        type: 'raw'
                    });
                    res.end();
                });
            }, function (err) {
                test.ok(!err);
                test.done();
            });
        },
        function (test) {
            http({
                method: 'post',
                body: 'a=42',
                headers: {
                    'content-type': 'application/x-www-form-urlencoded'
                }
            }, function (req, res) {

                var mime = mediaTyper.parse(req.headers['content-type']);

                var parser = new AttachParser(_.extend(mime, {
                    length: req.headers['content-length']
                }));

                parser.parse(req).done(function (data) {
                    test.deepEqual(data, {
                        input: {
                            a: '42'
                        },
                        type: 'urlencoded'
                    });
                    res.end();
                });

            }, function (err) {
                test.ok(!err);
                test.done();
            });
        },
        function (test) {
            http({
                method: 'post',
                body: '{"a": "42"}',
                headers: {
                    'content-type': 'application/json'
                }
            }, function (req, res) {

                var mime = mediaTyper.parse(req.headers['content-type']);

                var parser = new AttachParser(_.extend(mime, {
                    length: req.headers['content-length']
                }));

                parser.parse(req).done(function (data) {
                    test.deepEqual(data, {
                        input: {
                            a: '42'
                        },
                        type: 'json'
                    });
                    res.end();
                });
            }, function (err) {
                test.ok(!err);
                test.done();
            });
        },
        function (test) {
            http({
                method: 'post',
                body: '{"a": "42"}',
                headers: {
                    'content-type': 'application/foo+json'
                }
            }, function (req, res) {

                var mime = mediaTyper.parse(req.headers['content-type']);

                var parser = new AttachParser(_.extend(mime, {
                    length: req.headers['content-length']
                }));

                parser.parse(req).done(function (data) {
                    test.deepEqual(data, {
                        input: {
                            a: '42'
                        },
                        type: 'json'
                    });
                    res.end();
                });
            }, function (err) {
                test.ok(!err);
                test.done();
            });
        },
        function (test) {
            http({
                method: 'post',
                body: '{"a": "42}',
                headers: {
                    'content-type': 'application/json'
                }
            }, function (req, res) {

                var mime = mediaTyper.parse(req.headers['content-type']);

                var parser = new AttachParser(_.extend(mime, {
                    length: req.headers['content-length']
                }));

                parser.parse(req).fail(function (err) {
                    test.ok(err instanceof SyntaxError);
                    res.end();
                }).done();
            }, function (err) {
                test.ok(!err);
                test.done();
            });
        },
        function (test) {
            http({
                method: 'get',
                headers: {
                    'content-type': 'application/json'
                }
            }, function (req, res) {

                var mime = mediaTyper.parse(req.headers['content-type']);

                var parser = new AttachParser(_.extend(mime, {
                    length: req.headers['content-length']
                }));

                parser.parse(req).done(function (body) {
                    test.deepEqual(body, {
                        type: void 0,
                        input: {}
                    });
                    res.end();
                });
            }, function (err) {
                test.ok(!err);
                test.done();
            });
        },
        function (test) {
            http({
                method: 'post',
                body: {
                    dima: 'ok'
                },
                bodyEncoding: 'multipart'
            }, function (req, res) {

                var mime = mediaTyper.parse(req.headers['content-type']);

                var parser = new AttachParser(_.extend(mime, {
                    length: req.headers['content-length']
                }));

                parser.parse(req).done(function (data) {
                    test.deepEqual(data, {
                        input: {
                            dima: 'ok'
                        },
                        files: {},
                        type: 'multipart'
                    });
                    res.end();
                });
            }, function (err) {
                test.ok(!err);
                test.done();
            });
        }
    ]

};
