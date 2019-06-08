// How to serve a static file with node http
"use strict";

const http = require("http");
const fs = require("fs");

const server = http.createServer();

server.on("request", function(request, response) {
    console.log("Got request.");

    fs.readFile("file.html", function (err, data) {
       if (err) throw err;
       response.end(data);
    });
});

const port = 8088;

server.listen(port);

console.log("Server started on http://localhost:" + port);
