"use strict";

const http = require("http");
const server = require("./server.js");

exports.tearDown = function (done) {
    server.stop(function () {
        done();
    });
};

// TODO: handle stop() being called before start()
// TODO: test stop() taking a callback

exports.testServerReturnsHelloWorld = function (test) {
    server.start();
    const request = http.get("http://localhost:8088");
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
            test.done();
        });
    });
};
