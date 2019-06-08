"use strict";

const server = require("./server.js");
const contentDir = "src/server/content";
const port = process.argv[2];

server.start(contentDir + "/homepage.html", contentDir +"/404.html", port, function () {
    console.log("Server started");
});
