"use strict";

const PORT = 8088;
const TEST_FILE = "generated/test/test.html";
const EXPECTED_DATA = "data from file";

const fs = require("fs");
const http = require("http");
const server = require("./server.js");
const assert = require("assert");

exports.tearDown = function (done) {
    if (fs.existsSync(TEST_FILE)) {
        fs.unlinkSync(TEST_FILE);
        assert.ok(!fs.existsSync(TEST_FILE), "could not clean up " + TEST_FILE);
    }
    done();
};

exports.test_requiresFileToServe = function (test) {
    test.throws(function () {
        server.start();
    }, "should throw exception if file is missing");
    test.done();
};

exports.test_requiresPortNumber = function (test) {
    test.throws(function () {
        server.start(TEST_FILE);
    }, "should throw exception if port is missing");
    test.done();
};

exports.test_runsCallbackWhenStopCompletes = function (test) {
    server.start(TEST_FILE, PORT);
    server.stop(function () {
        test.done();
    });
};

exports.test_stopErrorsWhenRunning = function (test) {
    server.stop(function (err) {
        test.notStrictEqual(err, undefined, "should throw exception when called twice");
        test.done();
    });
};

exports.test_servesHomepageFromFile = function (test) {
    fs.writeFileSync(TEST_FILE, EXPECTED_DATA);

    getFromServer("/", function (response, responseData) {
        test.equals(200, response.statusCode, "status code");
        test.equals(EXPECTED_DATA, responseData, "response text");
        test.done();
    });
};

exports.test_returns404ForEverythingExceptHomepage = function (test) {
    getFromServer("/nonexistent", function (response) {
        test.equals(404, response.statusCode, "status code");
        test.done();
    });
};

exports.test_returnsHomepageWhenAskedForIndex = function (test) {
    fs.writeFileSync(TEST_FILE, EXPECTED_DATA);

    getFromServer("/index.html", function (response) {
        test.equals(200, response.statusCode, "status code");
        test.done();
    });
};

function getFromServer(url, callback) {
    server.start(TEST_FILE, PORT);
    const request = http.get("http://localhost:" + PORT + url);
    request.on("response", function (response) {
        let receivedData = "";
        response.setEncoding("utf8");
        response.on("data", function (chunk) {
            receivedData += chunk;
        });

        response.on("end", function () {
            server.stop();
            callback(response, receivedData);
        });
    });
}
