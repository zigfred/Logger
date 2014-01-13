requirejs.config({
    baseUrl: "js",
    paths: {
        "QUnit": "libs/qunit-1.12.0",
        "logger": "Logger/logger",
        "jasmine": "libs/jasmine",
        "jasmine-html": "libs/jasmine-html"
    },
    shim: {
        "jasmine": {
            exports: "jasmine"
        },
        "jasmine-html": {
            deps: ["jasmine"],
            exports: "jasmine"
        }
    },
    config: {
        logger: {
            enabled: true,
            level: "debug"
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