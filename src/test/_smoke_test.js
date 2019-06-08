/*
 * Copyright (c) 2019. See LICENSE.txt for details.
 */

// "smoke test" b/c it's to test that when the systems is run, no smoke comes out :-)
"use strict";

const HEROKU_DEFAULT_PORT = "5000";

const child_process = require("child_process");
const http = require("http");
const fs = require("fs");
const procfile = require("procfile");

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

exports.test_canGet404Page = function (test) {
    getFromServer("/nonexistent", function (response, receivedData) {
        test.equals(404, response.statusCode, "status code");
        const found404Marker = receivedData.indexOf("WeeWikiPaint 404") !== -1;
        test.ok(found404Marker, "404 page should have contained marker");
        test.done();
    });
};

function runServer(callback) {
    const web = procfile.parse(fs.readFileSync("Procfile", "utf8")).web;
    web.options = web.options.map(function (element) {
        if (element === "$PORT") return HEROKU_DEFAULT_PORT;
        else return element;
    });
    child = child_process.spawn(web.command,web.options);
    child.stdout.setEncoding("utf8");
    child.stdout.on("data", function (chunk) {
        if (chunk.trim() === "Server started")
        {
            callback();
        }
    });
}

function getFromServer(url, callback) {
    const request = http.get("http://localhost:" + HEROKU_DEFAULT_PORT + url);
    request.on("response", function (response) {
        let receivedData = "";
        response.setEncoding("utf8");
        response.on("data", function (chunk) {
            receivedData += chunk;
        });

        response.on("end", function () {
            callback(response, receivedData);
        });
    });
}
