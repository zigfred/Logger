requirejs.config({
    baseUrl: "js",
    paths: {
        "underscore": "libs/underscore-min",
        "logger": "common/logging/logger",
        "jasmine": "libs/jasmine",
        "jasmine-html": "libs/jasmine-html",
        "jasmine-sinon": "libs/jasmine-sinon",
        "sinon": "libs/sinon-1.7.3"
    },
    shim: {
        "jasmine": {
            exports: "jasmine"
        },
        "underscore": {
            exports: "_"
        },
        "jasmine-html": {
            deps: ["jasmine"],
            exports: "jasmine"
        },
        "jasmine-sinon": {
            deps: ["jasmine", "sinon"],
            exports: "jasmine"
        }
    },
    config: {
        logger: {
            enabled: true,
            level: "debug",
            appenders: ["console"]
        }
    }
});

require([
    "tests/index", "modules/moduleFoo", "modules/moduleBar"
], function(test, moduleFoo, moduleBar) {

        test.start();

        moduleFoo.start();
        moduleBar.start();
});