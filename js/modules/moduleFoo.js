define([
  'module',
  'Logger'
], function (module, Logger) {
  "use strict";

  function start() {
    var log = Logger.register(module);
    log.info("Initialized");
    try {
      //do some stuff
      log.debug("Blabla");
      //do some stuff
    }catch (e){
      log.error(e);
    }

    log.info("Initialized");
  }

  return {start: start};

});