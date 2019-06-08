/*
 * Copyright (c) 2019. See LICENSE.txt for details.
 */

// "smoke test" b/c it's to test that when the systems is run, no smoke comes out :-)
"use strict";

const child_process = require("child_process");
const http = require("http");

let child;

exports.setUp = function(done) {
    runServer(done);
};

exports.tearDown = function(done) {
    child.on("exit", function() {
       done();
    });
    child.kill();
  };

exports.test_canGetHomepage = function (test) {
    getFromServer("/", function (response, receivedData) {
        const foundHomepage = receivedData.indexOf("WeeWikiPaint home page") !== -1;
        test.ok(foundHomepage, "homepage should have contained WeeWikiPaint marker");
        test.done();
    });
};

function runServer(callback) {
    child = child_process.spawn("node",["src/server/weewikipaint", "8088"]);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (chunk) {
        if (chunk.trim() === "Server started")
        {
            callback();
        }
    });
}

// TODO duplicated w/ _server_test.js
function getFromServer(url, callback) {
    // server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT);
    const request = http.get("http://localhost:8088" + url);
    request.on("response", function (response) {
        let receivedData = "";
        response.setEncoding("utf8");
        response.on("data", function (chunk) {
            receivedData += chunk;
        });

        response.on("end", function () {
            // server.stop();
            callback(response, receivedData);
        });
    });
}
