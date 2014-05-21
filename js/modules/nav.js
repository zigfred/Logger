define(function(require) {
    "use strict";

    var _ = require("underscore"),
        module = require("module"),
        log = require("logger").register(module),
        request = require("request");

    return {
        config: function(container, type) {
            log.info("init nav: ", container, type);
            var self = this;
            this._container = container;
            this._type = type;
            this._events = [];

            request.doRequest({
                nav: this._type
            }, function(responce) {
                self.render(responce);
            });

            log.debug("initialized: ", this);
        },
        render: function(responce) {
            var self = this;
            log.info("render: ", responce);
            this.on("click", function(target){
                log.debug("clicked: ", target);
                self.trigger("action", {
                    target: target,
                    do: "page"
                });
            });
        },
        on: function(event, callback) {
            log.debug("listener added: ", event);
            this._events[event] || (this._events[event] = []);
            this._events[event].push(callback)
        },
        trigger: function(event, arg) {
            log.debug("event fired: ", event);
            _.each(this._events[event], function(handler) {
                handler(arg);
            });
        }
    };

});