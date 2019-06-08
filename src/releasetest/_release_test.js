// "smoke test" for the deployed version
"use strict";

const http = require("http");


exports.test_isOnWeb = function (test) {
    getFromServer("http://weepaint.herokuapp.com", function (response, receivedData) {
        const foundHomepage = receivedData.indexOf("WeeWikiPaint home page") !== -1;
        test.ok(foundHomepage, "homepage should have contained WeeWikiPaint marker");
        test.done();
    });
};

function getFromServer(url, callback) {
    const request = http.get(url);
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
