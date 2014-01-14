define(function(require) {
    "use strict";

    var Logger = require("logger"),
        module = require("module");

    var log = Logger.register(module);
    var logAjax = Logger.register("ajax");

    function makeAjaxRequest(data){
        logAjax.debug("data to send", data);
        // make request

        setTimeout(function(){
            logAjax.debug("response", "200 ok");
        }, 500);
    }

    function start() {

        log.info("Initialized");
        log.debug("ajax function makeAjaxRequest: ", makeAjaxRequest);

        try {
            //do some stuff
            log.debug("Blabla");
            //do some stuff

        }catch (e){
            log.error(e);
        }

        makeAjaxRequest({
            data:{
                a:1,
                b:2,
                c:3
            }
        });

        log.info("Finished");
    }

    return {start: start};

});