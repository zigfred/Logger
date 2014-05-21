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
        logger: {}
    }
});

require([
    "tests/index"
], function(test) {
    test.start();

});