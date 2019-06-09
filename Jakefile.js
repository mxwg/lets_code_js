
/*global directory, desc, task, jake, fail, complete, rmRf */
(function() {
    "use strict";

    const GENERATED_DIR = "generated";
    const TEMP_TESTFILE_DIR = GENERATED_DIR + "/test";

    const lint = require("./build/lint/lint_runner.js");

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
        if (!passed) fail("Node linting failed!");
    });

    desc("Lint Client");
    task("lintClient", [], function () {
        const passed = lint.validateFileList(clientFiles(), browserLintOptions(), {});
        if (!passed) fail("Client linting failed!");
    });

    desc("Test everything");
    task("test", ["testNode", "testClient"]);

    desc("Test node code");
    task("testNode", [TEMP_TESTFILE_DIR], function() {
        const reporter = require("nodeunit").reporters.default;
        reporter.run(nodeTestFiles(), null, function(failures) {
            if (failures) fail("Node tests failed.");
            complete();
        });
    }, {async: true});

    desc("Test deployment on the web");
    task("releasetest", ["test"], function() {
        const reporter = require("nodeunit").reporters.default;
        reporter.run(releaseTestFiles(), null, function(failures) {
            if (failures) fail("Website offline.");
            complete();
        });
    }, {async: true});

    desc("Test client code");
    task("testClient", ["karmaServer"], function() {
        // Client test files are defined in karma.conf.js
        check_output("./karma.sh", function (output) {
        }, function (success) {
            console.log(bold("Client tests successful."));
            stopKarmaServer();
        }, function (failure) {
            fail("Client tests failed.");
            stopKarmaServer();
        });
    }, {async: true});

    desc("Karma server (for client tests)");
    task("karmaServer", [], function() {
        startKarmaServer();
    }, {async: true});

    function bold(text) {
        return '\x1b[1m' + text + '\x1b[22m';
    }

    function nodeFiles() {
        const lintFiles = new jake.FileList();
        lintFiles.include("**/*.js");
        lintFiles.exclude("src/client/**");
        lintFiles.exclude("node_modules");
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

    function startKarmaServer() {
        check_output("./karma_server.sh", function (data) {
            if (data.indexOf("Firefox 67.0.0") !== -1) {
                complete();
            }
        }, function () {
            console.log("Karma server stopped.");
        }, function () {
            fail("Karma server crashed.");
        });
    }

    function stopKarmaServer() {
        const killKarmaServer = "kill -INT $(ps a -o pid,cmd |grep 'karma start' |grep -v grep | awk '{ print $1 }')";
        check_output(killKarmaServer, function (output) {
            console.log(output);
        }, complete, function (stdout) {
            fail("Could not stop Karma server: " + stdout);
        }, false);
    }

    function check_output(command, output, success, failure, print_bold = true) {
        let stdout = "";
        const child = jake.createExec(command);
        child.on("stdout", function (data) {
            stdout += data.toString();
            process.stderr.write(data);
            output(data.toString());
        });
        child.on("stderr", function (data) {
            process.stderr.write(data);
        });
        child.on("cmdEnd", function () {
            success();
        });
        child.on("error", function (msg, code) {
            console.log("Command failed with" + msg, code);
            failure(stdout);
        });
        let commandString = "> " + command;
        if(print_bold) {
            commandString = bold(commandString);
        }
        console.log(commandString);


        child.run();
    }

}());
