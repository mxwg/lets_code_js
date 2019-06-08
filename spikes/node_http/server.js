// A spike of an http server with node

"use strict";

var http = require("http");

var server = http.createServer();

server.on("request", function(request, response) {
    console.log("Got request.");

    var body = "<html><head><title>Node HTTP server</title></head>" +
        "<body><p>This text is being served by nodejs.</p></body></html>";

    response.end(body);
});

var port = 8088;

server.listen(port);

console.log("Server started on http://localhost:" + port);
