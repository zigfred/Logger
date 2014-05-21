define(function(require) {
    "use strict";

    var module = require("module"),
        log = require("logger").register(module);



    function request(params, callback) {
        log.debug("request params: ", params);

        setTimeout(function(){
            callback(new Date());
        }, 500)
    }

    function init(options) {
        log.debug("init request: ", options);
    }

    return {
        init: init,
        doRequest: request
    };

});