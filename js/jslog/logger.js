/*
 * Copyright (C) 2005 - 2013 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: psavushchik
 * @version: 0
 */
(function(root, factory) {
    if (typeof define === "function" && define.amd) {
        // AMD. Register as an anonymous module.
        define(["module"], factory);
    } else {
        // Browser globals.
        root.Logger = factory(root.b);
    }
}(this, function(module) {
    "use strict"

    // Loggers holder.
    var loggers = {};

    // Default config.
    var config = {
        enable: false,
        level: "error",
        appenders: ["console"]
    };

    // Replace config by project config if exists.
    if (module && module.config) {
        var projectConf = module.config();
        for (var c in projectConf) {
            if (projectConf.hasOwnProperty(c)) {
                config[c] = projectConf[c];
            }
        }
    }

    function Logger(options) {
        this._id = "root";
        this._level = config.level;
        this._enable = config.enable;
        this._appenders = config.appenders;


        if (typeof options !== "undefined") {
            if (typeof options === "string" && options !== "") {
                this._id = options;
            } else if (options.hasOwnProperty("id")) {
                this._id = options.id;

                if (options.hasOwnProperty("level")) {
                    this._level = options.level;
                }
                if (options.hasOwnProperty("enable")) {
                    this._enable = options.enable;
                }
                if (options.hasOwnProperty("appenders")) {
                    this._appenders = options.appenders;
                }
            }
        }
    }

    Logger.prototype.addAppender = function(appender) {
        this._appenders.push(appender);
    };
    Logger.prototype.removeAppender = function(appender) {
        this._appenders.splice([this._appenders.indexOf(appender)], 1);
    };

    Logger.prototype.doLog = function(logItem) {
        if (this._enable && isEnabled() && checkLevels(this._level, logItem.level)) {
            logItem.id = this._id;
            logItem.appenders = this._appenders;

            filtering(logItem);
        }
    };
    Logger.prototype.log = function() {
        this.doLog({
            level: "info",
            args: arguments
        });
    };
    Logger.prototype.info = function() {
        this.doLog({
            level: "info",
            args: arguments
        });
    };
    Logger.prototype.warn = function() {
        this.doLog({
            level: "warn",
            args: arguments
        });
    };
    Logger.prototype.debug = function() {
        this.doLog({
            level: "debug",
            args: arguments
        });
    };
    Logger.prototype.error = function() {
        this.doLog({
            level: "error",
            args: arguments
        });
    };


    function Level(level, name) {
        this.level = level;
        this.name = name;
    }
    Level.prototype = {
        toString: function() {
            return this.name;
        },
        equals: function(level) {
            return this.level == level.level;
        },
        isGreaterOrEqual: function(level) {
            return this.level >= level.level;
        }
    };

    Level.ALL = new Level(Number.MIN_VALUE, "ALL");
    Level.TRACE = new Level(10000, "TRACE");
    Level.DEBUG = new Level(20000, "DEBUG");
    Level.INFO = new Level(30000, "INFO");
    Level.WARN = new Level(40000, "WARN");
    Level.ERROR = new Level(50000, "ERROR");
    Level.FATAL = new Level(60000, "FATAL");
    Level.OFF = new Level(Number.MAX_VALUE, "OFF");


    function register(module) {
        if (typeof module === "object" && module.hasOwnProperty("id")) {
            module = module.id;
        }
        if (loggers.hasOwnProperty(module)) {
            return loggers[module];
        } else {
            return loggers[module] = new Logger(module);
        }
    }

    function checkLevels(loggerLevel, itemLevel) {
        return loggerLevel > itemLevel;
    }

    function isEnabled() {
        return config.enable;
    }
    function enable() {
        // TODO allow appenders to write logs
    }
    function disable() {
        // TODO disallow appenders to write logs
    }

    // TODO make global object to control logging from console

    return {
        register: register,
        enable: enable,
        disable: disable
    };
}));