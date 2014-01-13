define(function() {
    "use strict";

    var Logger = require("logger"),
        module = require("module");

    var log = Logger.register(module);

    function start() {

        Logger.disable();
        log.warn('should not fire');
        Logger.enable("debug");

        log.info("Initialized");
        try {
            //do some stuff
            log.debug("try to execute...");
            log.qwe()
            //do some stuff
            log.warn("should not execute!!!");
        } catch (e) {
            log.error(e);
        }

        log.info("Finish");
    }

    return {start: start};

});