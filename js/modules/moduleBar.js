define([
  'module',
  'Logger'
], function (module, Logger) {
  "use strict";

  function start() {
    var log = Logger.register(module);

    var log3 = Logger.register({
      id: 'root', // 'myLog123'
      level: 'error'
    });

    Logger.disable();
    log.error('should not fire');
    Logger.enable("warn");


    log.info("bar Initialized");
    try {
      //do some stuff
      log.debug("Blabla");
      log.qwe()
      //do some stuff
    }catch (e){
      log.error(e);
    }

    log.info("bar end");
  }

  return {start: start};

});