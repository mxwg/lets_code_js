"use strict";

const PORT = 8088;
const TEST_FILE = "generated/test/test.html";

const fs = require("fs");
const http = require("http");
const server = require("./server.js");
const assert = require("assert");

exports.tearDown = function(done) {
      if (fs.existsSync(TEST_FILE)) {
          fs.unlinkSync(TEST_FILE);
          assert.ok(!fs.existsSync(TEST_FILE), "could not delete " + TEST_FILE);
      }

      done();
};

exports.test_serverRequiresPortNumber = function(test) {
    test.throws(function () {
        server.start();
    }, "should throw exception if port is missing");
    test.done();
};


exports.test_serverRunsCallbackWhenStopCompletes = function (test) {
    server.start(TEST_FILE, PORT);
    server.stop(function () {
        test.done();
    });
};

exports.test_stopErrorsWhenServerNotRunning = function (test) {
    server.stop(function (err) {
        test.notStrictEqual(err, undefined, "should throw exception when called twice");
        test.done();
    });
};

exports.test_serverServesAFile = function (test) {
    fs.writeFileSync(TEST_FILE, "data from file");

    server.start(TEST_FILE, PORT);
    const request = http.get("http://localhost:" + PORT);
    request.on("response", function (response) {
        let receivedData = false;
        response.setEncoding("utf8");
        test.equals(200, response.statusCode, "status code");
        response.on("data", function (chunk) {
            receivedData = true;
            test.equals("data from file", chunk, "response text");
        });

        response.on("end", function () {
            test.ok(receivedData, "should have received response data");
            server.stop();
            test.done();
        });
    });
};
