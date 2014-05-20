define(function(require) {
    "use strict";

    var logger = require("logger"),
        module = require("module");

    var log = logger.register(module);

    function start() {

        logger.disable();
        log.warn('should not fire');
        logger.enable("debug");

        log.info("Initialized");
        log.info(document);

        try {
            //do some stuff
            log.debug("try to execute...");
            log.qwe();
            //do some stuff
            log.warn("should not execute!!!");
        } catch (e) {
            log.error(e);
        }

        log.info("Finish");
    }

    return {start: start};

});