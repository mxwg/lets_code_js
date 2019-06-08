"use strict";

const http = require("http");
let server;

exports.start = function () {
    server = http.createServer();
    server.on("request", function (request, response) {
        response.end("Hello World");
    });
    server.listen(8088); // TODO: factor out port
};

exports.stop = function (callback) {
    server.close(callback);
};
