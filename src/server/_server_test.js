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

exports.testServerRespondsToGetRequests = function (test) {
    server.start();
    http.get("http://localhost:8088", function (response) {
        response.on("data", function () {
        });
        test.done();
    });
};
