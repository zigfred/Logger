define(['module', 'logger'], function(module, Logger) {
    "use strict";

    function start() {
        var log = Logger.register(module);
        log.info("Initialized");
        try {
            //do some stuff
            log.debug("foo debug");
            //do some stuff
        } catch (e) {
            log.error(e);
        }
        log.info("Finish");
    }

    return {start: start};

});
