/*global directory, desc, task, jake, fail, complete, rmRf */
let karmaServerRunningInBackground = false;
const getKarmaProcess = "ps a -o pid,cmd | grep 'karma start' |grep -v grep";
const karmaTimeout_ms = 10000;

const SUPPORTED_BROWSERS = ["Firefox", "HeadlessChrome"];

(function() {
    "use strict";
    checkKarmaServer();

    const lint = require("./build/lint/lint_runner.js");

    const GENERATED_DIR = "generated";
    const TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";

    directory(TEMP_TESTFILE_DIR);

    desc("Delete auto generated files");
    task("clean", [], function () {
        jake.rmRf(GENERATED_DIR);
    });

    desc("Build and test");
    task("default", ["lint", "test"]);

    desc("Lint everything (but modules)");
    task("lint", ["lintNode", "lintClient"]);

    desc("Lint server");
    task("lintNode", [], function () {
        const passed = lint.validateFileList(nodeFiles(), nodeLintOptions(), {});
        if (!passed) fail(bold_red("Node linting failed!"));
    });

    desc("Lint Client");
    task("lintClient", [], function () {
        const passed = lint.validateFileList(clientFiles(), browserLintOptions(), {});
        if (!passed) fail(bold_red("Client linting failed!"));
    });

    desc("Test everything");
    task("test", ["testNode", "testClient"]);

    desc("Test node code");
    task("testNode", [TEMP_TESTFILE_DIR], function() {
        const reporter = require("nodeunit").reporters.default;
        reporter.run(nodeTestFiles(), null, function(failures) {
            if (failures) fail(bold_red("Node tests failed."));
            complete();
        });
    }, {async: true});

    desc("Test deployment on the web");
    task("releasetest", ["test"], function() {
        const reporter = require("nodeunit").reporters.default;
        reporter.run(releaseTestFiles(), null, function(failures) {
            if (failures) fail(bold_red("Website offline."));
            complete();
        });
    }, {async: true});

    desc("Test client code");
    task("testClient", ["karmaServer"], function() {
        // Client test files are defined in karma.conf.js
        let log = "";
        check_output("./karma.sh",
            function (output) {
            log += output;
        }, function (success) {
            stopKarmaServer();
            assertAllBrowsersWereTested(log);
            console.log(bold("Client tests successful."));
        }, function (failure) {
            stopKarmaServer();
            fail(bold_red("Client tests failed."));
        });
    }, {async: true});

    desc("Karma server (for client tests)");
    task("karmaServer", [], function() {
        startKarmaServer();
    }, {async: true});

    function bold(text) {
        return '\x1b[1m' + text + '\x1b[22m';
    }

    function red(text) {
        return '\x1b[31m' + text + '\x1b[0m';
    }

    function bold_red(text) {
        return bold(red(text));
    }

    function nodeFiles() {
        const lintFiles = new jake.FileList();
        lintFiles.include("**/*.js");
        lintFiles.exclude("src/client/**");
        lintFiles.exclude("node_modules");
        lintFiles.exclude("vendor_client/**");
        lintFiles.exclude("karma.conf.js");
        return lintFiles.toArray();
    }

    function nodeTestFiles() {
        const serverTestFiles = new jake.FileList();
        serverTestFiles.include("src/**/_*_test.js");
        serverTestFiles.exclude("src/client/**");
        serverTestFiles.exclude("_release_test.js");
        return serverTestFiles.toArray();
    }

    function clientFiles() {
        const lintFiles = new jake.FileList();
        lintFiles.include("src/client/**/*.js");
        return lintFiles.toArray();
    }

    function releaseTestFiles() {
        const testFiles = new jake.FileList();
        testFiles.include("src/releasetest/_*_test.js");
        return testFiles.toArray();
    }

    function globalLintOptions() {
        return {
            esversion: 6,
            bitwise: true,
            curly: false,
            eqeqeq: true,
            forin: true,
            immed: true,
            latedef: false,
            newcap: true,
            noarg: true,
            noempty: true,
            nonew: true,
            regexp: true,
            undef: true,
            strict: true,
            trailing: true
        };
    }

    function nodeLintOptions() {
        let options = globalLintOptions();
        options.node = true;
        return options;
    }

    function browserLintOptions() {
        let options = globalLintOptions();
        options.browser = true;
        options.mocha = true;
        return options;
    }

    function assertAllBrowsersWereTested(log) {
        SUPPORTED_BROWSERS.forEach(function (browser) {
            const found = (log.indexOf(browser) !== -1);
            if (!found) fail(bold_red("Browser not tested: " + browser));
        });
    }

    function checkKarmaServer() {
        run_silently(getKarmaProcess,
            function () {
                console.log("Server already running.");
                karmaServerRunningInBackground = true;
            }, function () {
                karmaServerRunningInBackground = false;
            });
    }

    function startKarmaServer() {
        if(!karmaServerRunningInBackground) {
            const karmaTimeout = setTimeout(function () {
                stopKarmaServer();
                fail(bold_red("Could not start Karma server in time (" + karmaTimeout_ms / 1000 + "s)"));
            }, karmaTimeout_ms);

            check_output("./karma_server.sh", function (data) {
                if (data.indexOf("[Firefox ") !== -1) {
                    clearTimeout(karmaTimeout);
                    complete();
                }
            }, function () {
                console.log("Karma server stopped.");
            }, function () {
                fail(bold_red("Karma server crashed."));
            });
        } else {
            console.log(bold("Karma server running in the background."));
            complete();
        }
    }

    function stopKarmaServer() {
        if(!karmaServerRunningInBackground) {
            const killKarmaServer = "kill -INT $(" + getKarmaProcess + " | awk '{ print $1 }')";
            check_output(killKarmaServer, function (output) {
                console.log(output);
            }, complete, function (stdout) {
                fail(bold_red("Could not stop Karma server: " + stdout));
            }, false);
        } else {
            console.log("Leaving Karma server up.");
        }
        complete();
    }

    function check_output(command, output, success, failure, print_bold = true, print_output = true) {
        let stdout = "";
        const child = jake.createExec(command);
        child.on("stdout", function (data) {
            stdout += data.toString();
            if (print_output) process.stderr.write(data);
            output(data.toString());
        });
        child.on("stderr", function (data) {
            if (print_output) process.stderr.write(data);
        });
        child.on("cmdEnd", function () {
            success();
        });
        child.on("error", function (msg, code) {
            if (print_output) console.log("Command failed with" + msg, code);
            failure(stdout);
        });

        let commandString = "> " + command;
        if(print_bold) {
            commandString = bold(commandString);
        }
        if (print_output) console.log(commandString);

        child.run();
    }

    function run_silently(command, success, failure) {
        check_output(command, function () {}, success, failure, false, false);
    }
}());
