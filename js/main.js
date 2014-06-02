requirejs.config({
    baseUrl: "js",
    paths: {
        "underscore": "libs/underscore-min",
        "logger": "common/logging/logger",
        "jasmine": "libs/jasmine",
        "jasmine-html": "libs/jasmine-html",
        "jasmine-sinon": "libs/jasmine-sinon",
        "sinon": "libs/sinon-1.7.3",

        "request": "modules/request",
        "nav": "modules/nav",
        "viewer": "modules/viewer"
    },
    shim: {
        "jasmine": {
            exports: "jasmine"
        },
        "underscore": {
            exports: "_"
        }
    },
    config: {
        logger: {
            root: {
                level: "off",
                appenders: ["console"]
            },
            modules: {
                "request": "info",
                "viewer": "debug"
            }
        }
    }
});

require([
    "nav",
    "viewer",
    "request",
    "logger"
],function(nav, viewer, request, logger) {

    var log = logger.register("app");

    log.info("app starting");

    request.init("url");

    viewer.init({navType: "top", width: 800});

    nav.config(viewer.$navContainer, "top");

    nav.on("action", function(action){
        viewer.navAction(action);
    });

    viewer.show("home");

    log.info("app started");


    // fake user actions
    setTimeout(function(){
        log.info("user clicked link to page1");
        nav.trigger("click", "page1");
    }, 3000);

    setTimeout(function(){
        log.info("user clicked link to page2");
        nav.trigger("click", "page2");
    }, 6000);


});