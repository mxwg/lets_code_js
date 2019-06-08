/*
 * Copyright (c) 2019. See LICENSE.txt for details.
 */

"use strict";

const PORT = 8088;
const TEST_HOME_PAGE = "generated/test/test.html";
const TEST_404_PAGE = "generated/test/test404.html";
const EXPECTED_DATA = "data from file";

const fs = require("fs");
const http = require("http");
const server = require("../server/server.js");
const assert = require("assert");

exports.tearDown = function (done) {
    cleanUpFile(TEST_HOME_PAGE);
    cleanUpFile(TEST_404_PAGE);
    done();
};

exports.test_requiresHomePageToServe = function (test) {
    test.throws(function () {
        server.start();
    }, "should throw exception if file is missing");
    test.done();
};

exports.test_requires404PageToServe = function (test) {
    test.throws(function () {
        server.start(TEST_HOME_PAGE);
    }, "should throw exception if file is missing");
    test.done();
};

exports.test_requiresPortNumber = function (test) {
    test.throws(function () {
        server.start(TEST_HOME_PAGE, TEST_404_PAGE);
    }, "should throw exception if port is missing");
    test.done();
};

exports.test_runsCallbackWhenStopCompletes = function (test) {
    server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT);
    server.stop(function () {
        test.done();
    });
};

exports.test_stopErrorsWhenRunning = function (test) {
    server.stop(function (err) {
        test.notStrictEqual(undefined, err, "should throw exception when called twice");
        test.done();
    });
};

exports.test_servesHomepageFromFile = function (test) {
    fs.writeFileSync(TEST_HOME_PAGE, EXPECTED_DATA);

    getFromServer("/", function (response, responseData) {
        test.equals(200, response.statusCode, "status code");
        test.equals(EXPECTED_DATA, responseData, "response text");
        test.done();
    });
};

exports.test_returns404ForEverythingExceptHomepage = function (test) {
    fs.writeFileSync(TEST_404_PAGE, EXPECTED_DATA);
    getFromServer("/nonexistent", function (response, responseData) {
        test.equals(404, response.statusCode, "status code");
        test.equals(EXPECTED_DATA, responseData, "response text");
        test.done();
    });
};

exports.test_returnsHomepageWhenAskedForIndex = function (test) {
    fs.writeFileSync(TEST_HOME_PAGE, EXPECTED_DATA);

    getFromServer("/index.html", function (response, responseData) {
        test.equals(200, response.statusCode, "status code");
        test.equals(EXPECTED_DATA, responseData, "response text");
        test.done();
    });
};

function getFromServer(url, callback) {
    server.start(TEST_HOME_PAGE, TEST_404_PAGE, PORT, function () {
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
    });
}

function cleanUpFile(file) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
        assert.ok(!fs.existsSync(file), "could not clean up " + file);
    }
}
