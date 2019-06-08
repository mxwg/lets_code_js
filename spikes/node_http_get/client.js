"use strict";

var http = require("http");

http.get("http://localhost:8088", function(res) {
    console.log("Got response: " + res.statusCode);
}).on('error', function(e) {
    console.log("Got error: " + e.message);
});
