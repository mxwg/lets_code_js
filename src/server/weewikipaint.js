"use strict";

const server = require("./server.js");

server.start("src/server/content/homepage.html", "404.html", 8088, function () {
    console.log("Server started");
});
