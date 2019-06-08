"use strict";

var http = require("http");
var server;

exports.start = function () {
    server = http.createServer();
    server.on("request", function (request, response) {
        response.end();
    });
    server.listen(8088); // TODO: factor out port
};

exports.stop = function (callback) {
    server.close(callback);
};
