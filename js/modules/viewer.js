define(function(require) {
    "use strict";

    var module = require("module"),
        log = require("logger").register(module),
        request = require("request");

    return {
        init: function(options) {
            log.info("init: ", options);
            this.$navContainer = "nav-" + options.navType;
            this.width = options.width;
            log.debug("initialized: ", this);
        },
        show: function(page) {
            log.debug("show: ", page);
            var self = this;
            request.doRequest({
                page: page
            }, function(responce){
                log.info("recived data: ", responce);
                self._render(responce);
            });
        },
        navAction: function(action) {
            log.info("navigate: ", action);

        },
        _render: function(data) {
            log.info("render: ", data);
        }
    };

});