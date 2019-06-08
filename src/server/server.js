"use strict";

const http = require("http");
let server;

exports.start = function (port) {
    server = http.createServer();
    server.on("request", function (request, response) {
        response.end("Hello World");
    });
    server.listen(port);
};

exports.stop = function (callback) {
    server.close(callback);
};
