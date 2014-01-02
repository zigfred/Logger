define([
  'module',
  'Logger'
], function (module, Logger) {
  "use strict";

  function start() {
    var log = Logger.register(module/*, {
      appenders: [{
        type: 'console',
        enable: false
      },{
        type: 'axaj',
        enable: true,
        url: 'test.com'
      }]
    }*/);
    log.info("foo Initialized");
    try {
      //do some stuff
      log.debug("foo debug");
      //do some stuff
    }catch (e){
      log.error(e);
    }

    log.info("foo end");
  }

  return {start: start};

});