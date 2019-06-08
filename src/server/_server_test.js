"use strict";

const PORT = 8088;

const http = require("http");
const server = require("./server.js");


exports.test_serverRequiresPortNumber = function(test) {
    test.throws(function () {
        server.start();
    }, "should throw exception if port is missing");
    test.done();
};

exports.test_serverReturnsHelloWorld = function (test) {
    server.start(PORT);
    const request = http.get("http://localhost:" + PORT);
    request.on("response", function (response) {
        let receivedData = false;
        response.setEncoding("utf8");
        test.equals(200, response.statusCode, "status code");
        response.on("data", function (chunk) {
            receivedData = true;
            test.equals("Hello World", chunk, "response text");
        });

        response.on("end", function () {
            test.ok(receivedData, "should have received response data");
            server.stop();
            test.done();
        });
    });
};

exports.test_serverRunsCallbackWhenStopCompletes = function (test) {
    server.start(PORT);
    server.stop(function () {
        test.done();
    });
};

exports.test_stopErrorsWhenServerNotRunning = function (test) {
    server.stop(function (err) {
        test.notStrictEqual(err, undefined, "should throw exception when called twice");
        test.done();
    });
};
