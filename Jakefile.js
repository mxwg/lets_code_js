/*global directory, desc, task, jake, fail, complete, rmRf */
(function() {
    "use strict";

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
    task("lint", [], function () {
        const lint = require("./build/lint/lint_runner.js");

        const files = new jake.FileList();
        files.include("**/*.js");
        files.exclude("node_modules");

        const options = nodeLintOptions();
        const passed = lint.validateFileList(files.toArray(), options, {});
        if (!passed) fail("Lint failed!");
    });

    desc("Test everything");
    task("test", [TEMP_TESTFILE_DIR], function() {
        const reporter = require("nodeunit").reporters.default;

        const testFiles = new jake.FileList();
        testFiles.include("src/**/_*_test.js");

        reporter.run(testFiles.toArray(), null, function(failures) {
            if (failures) fail("Tests failed.");
            complete();
        });
    }, {async: true});

    function nodeLintOptions() {
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
            trailing: true,
            node: true
        };
    }
}());
