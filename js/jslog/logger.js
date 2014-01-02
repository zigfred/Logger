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

    function inherit(child, parent) {
        var F = function() {
        };
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        return child;
    }

    function Level(level, name) {
        if (this instanceof Level) {
            this.level = level;
            this.name = name;
        } else {
            return Level[level.toUpperCase()];
        }
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

    // Loggers holder.
    var loggers = {};

    // Default config.
    var config = {
        level: Level.ERROR,
        appenders: ["console"]
    };

    // Replace config by project config if exists.
    if (module && module.config) {
        var projectConf = module.config();
        for (var c in projectConf) {
            if (projectConf.hasOwnProperty(c)) {
                if (c === "level") {
                    config[c] = Level(projectConf.level);
                } else {
                    config[c] = projectConf[c];
                }
            }
        }
    }

    function Logger(options) {
        this._id = "root";
        this._level = config.level;
        this._appenders = config.appenders.slice();

        if (typeof options !== "undefined") {
            if (typeof options === "string" && options !== "") {
                this._id = options;
            } else if (options.hasOwnProperty("id")) {
                this._id = options.id;

                if (options.hasOwnProperty("level")) {
                    this._level = Level(options.level);
                }
                if (options.hasOwnProperty("appenders")) {
                    this._appenders = options.appenders.slice();
                }
            }
        }

        for (var i = 0, l = this._appenders.length; i < l; i++) {
            this._appenders[i] = Appender.createAppender(this._appenders[i]);
        }
    }

    Logger.prototype.addAppender = function(appender) {
        this._appenders.push(Appender.createAppender(appender));
    };
    Logger.prototype.removeAppender = function(appender) {
        this._appenders.splice([this._appenders.indexOf(appender)], 1);
    };

    Logger.prototype.doLog = function(logItem) {
        if (logItem.level.isGreaterOrEqual(this._level)) {
            console.log(logItem.level, this._level)
            logItem.id = this._id;
            logItem.appenders = this._appenders;
            logItem.args = [].slice.call(logItem.args);

            var stack = new Error().stack;
            var lineAccessingLogger = stack.split("\n")[3];
            console.log(lineAccessingLogger)
//  at Object.start (http://localhost:63342/jslog/js/modules/moduleBar.js:34:9)
            logItem.file = lineAccessingLogger.match(/\/(\w+\.\w+:\d+)/i)[1]
            for (var i = 0, l = this._appenders.length; i < l; i++) {
                this._appenders[i].write(logItem);
            }
        }
    };
    Logger.prototype.log = function() {
        this.doLog({
            level: Level("info"),
            args: arguments
        });
    };
    Logger.prototype.info = function() {
        this.doLog({
            level: Level("info"),
            args: arguments
        });
    };
    Logger.prototype.warn = function() {
        this.doLog({
            level: Level("warn"),
            args: arguments
        });
    };
    Logger.prototype.debug = function() {
        this.doLog({
            level: Level("debug"),
            args: arguments
        });
    };
    Logger.prototype.error = function() {
        this.doLog({
            level: Level("error"),
            args: arguments
        });
    };
    Logger.prototype.error = function(level) {
        this._level = Level(level || "all");
    };
    Logger.prototype.error = function() {
        this._level = Level.OFF;
    };

    function Appender() {
    }

    Appender.constructors = {};
    Appender.prototype.write = function() {
    };
    Appender.createAppender = function(appender) {
        var args = [].slice.call(arguments, 1);
        return new Appender.constructors[appender](args);
    };
    function ConsoleAppender() {
    }

    inherit(ConsoleAppender, Appender);
    Appender.constructors.console = ConsoleAppender;

    ConsoleAppender.prototype.console = (function() {
        if (!window.console) {
            var f = function() {
            };
            return {
                assert: f,
                clear: f,
                count: f,
                debug: f,
                dir: f,
                dirxml: f,
                error: f,
                group: f,
                groupCollapsed: f,
                groupEnd: f,
                info: f,
                log: f,
                markTimeline: f,
                profile: f,
                profileEnd: f,
                table: f,
                time: f,
                timeEnd: f,
                timeStamp: f,
                trace: f,
                warn: f
            }
        } else {
            return console;
        }
    })();
    ConsoleAppender.prototype.write = function(logItem) {
        var f = function(){};
        switch (logItem.level.toString()) {
            case "TRACE":
                f = this.console.trace;
                break;
            case "DEBUG":
            case "INFO":
                f = this.console.info;
                break;
            case "WARN":
                f = this.console.warn;
                break;
            case "ERROR":
                f = this.console.error;
                break;
        }

        f.call(this.console, new Date() + ' | %s' + ' | %s', logItem.id, logItem.args[0]);
    };

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


    function enable(level) {
        this._level = Level(level || "all");
    };
    function disable() {
        this._level = Level.OFF;
    };

    // TODO make global object to control logging from console

    return {
        register: register,
        enable: enable,
        disable: disable
    };
}));