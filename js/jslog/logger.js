/*
 * Copyright (C) 2005 - 2013 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: psavushchik
 * @version: 0
 */
define(function(require, exports, module) {
    var config = module.config();

    function inherit(child, parent) {
        var F = function() {
        };
        F.prototype = parent.prototype;
        child.prototype = new F();
        child.prototype.constructor = child;
        return child;
    }

    function Level(level, name) {
        this.level = level;
        this.name = name;
    }

    Level.prototype.isGreaterOrEqual = function(logItemLevel) {
        return this.level >= logItemLevel.level;
    };
    Level.prototype.toString = function() {
        return this.name;
    };
    Level.getLevel = function(level) {
        return Level[level.toUpperCase()];
    };
    Level["ALL"] = new Level(Number.MIN_VALUE, "ALL");
    Level["DEBUG"] = new Level(100, "DEBUG");
    Level["INFO"] = new Level(200, "INFO");
    Level["WARN"] = new Level(300, "WARN");
    Level["ERROR"] = new Level(400, "ERROR");
    Level["OFF"] = new Level(Number.MAX_VALUE, "OFF");

    function Logger(settings) {
        this._id = settings.id;
        this._level = settings.level;
        this._appenders = settings.appenders;
    }

    Logger.prototype.getLevel = function() {
        return this._level;
    };
    Logger.prototype.setLevel = function(level) {
        // TODO parse level
        this._level = level;
    };
    Logger.prototype.prepareLogItem = function(logItem) {
        logItem.id = this._id;
        logItem.appenders = this._appenders;
        logItem.loggerLevel = this._level;
        logItem.args = Array.prototype.slice.call(logItem.args, 0);
        logItem.time = new Date();

        var stack = new Error().stack;
        var lineAccessingLogger = stack.split("\n")[3];
        var res = lineAccessingLogger.match(/\/(\w+\.\w+):(\d+)/i);
        logItem.file = res[1];
        logItem.line = res[2];

        LoggerManager.addLogItem(logItem);
    };
    Logger.prototype.log = function() {
        this.prepareLogItem({
            level: Level.getLevel("info"),
            args: arguments
        });
    };
    Logger.prototype.info = function() {
        this.prepareLogItem({
            level: Level.getLevel("info"),
            args: arguments
        });
    };
    Logger.prototype.debug = function() {
        this.prepareLogItem({
            level: Level.getLevel("debug"),
            args: arguments
        });
    };
    Logger.prototype.warn = function() {
        this.prepareLogItem({
            level: Level.getLevel("warn"),
            args: arguments
        });
    };
    Logger.prototype.error = function() {
        this.prepareLogItem({
            level: Level.getLevel("error"),
            args: arguments
        });
    };

    /**
     * new LogItem()
     *
     * @param options
     * @constructor
     */
    function LogItem(options) {
        for (var i in options) {
            if (options.hasOwnProperty(i)) {
                this[i] = options[i];
            }
        }
    }

    LogItem.prototype.toString = function() {
        var logParams = [];
        logParams.push(this.time.toLocaleTimeString());
        logParams.push(this.id);
        logParams.push("[" + this.level.toString() + "] -");
        logParams = logParams.concat(this.args);

        return logParams.join(" ");
    };

    function Appender(type) {
    }

    Appender.bp = {};
    Appender.prototype.write = function() {
    };
    Appender.createAppender = function(type) {
        if (!type || type === "") {
            type = "console";
        }
        var args = Array.prototype.slice.call(arguments, 1);
        return new Appender.bp[type](args);
    };

    function ConsoleAppender() {
    }

    inherit(ConsoleAppender, Appender);
    Appender.bp.console = ConsoleAppender;

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
        var f = this.console.log;
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

        f.call(this.console, logItem.toString());
    };

    var LoggerManager = {
        enabled: (typeof config.enabled === "boolean") ? config.enabled : true,
        levelImportant: (typeof config.levelImportant === "string") ? config.levelImportant : "local",
        loggers: {},
        logList: [],
        appenders: {
            console: Appender.createAppender("console")
        },
        register: function(options) {
            var settings = {
                id: "root",
                level: (this.levelImportant === "local") ? Level.getLevel("ALL") : this.levelImportant,
                appenders: ["console"]
            };

            if (typeof options === "string" && options !== "") {
                settings.id = options;
            } else if (options && options.hasOwnProperty("id")) {
                settings.id = options.id;

                if (options.hasOwnProperty("level")) {
                    settings.level = Level.getLevel(options.level);
                }
                if (options.hasOwnProperty("appenders")) {
                    settings.appenders = options.appenders.slice();
                }
            }
            if (this.loggers.hasOwnProperty(settings.id)) {
                return this.loggers[settings.id];
            } else {
                return this.loggers[settings.id] = new Logger(settings);
            }
        },
        disable: function() {
            this.enabled = false;
        },
        enable: function() {
            this.enabled = true;
        },
        addLogItem: function(logItem) {
            logItem = new LogItem(logItem);
            this.logList.push(logItem);

            this.appendLogItem(logItem);
        },
        appendLogItem: function(logItem) {
            var isLocal = this.levelImportant === "local",
                isImportantAllow = false,
                isLocalAllow = false;

            for (var i = 0, l = logItem.appenders.length; i < l; i++) {
                isLocalAllow = logItem.level.isGreaterOrEqual(logItem.loggerLevel);
                isImportantAllow = logItem.level.isGreaterOrEqual(this.levelImportant);

                if (this.enabled && ((isLocal && isLocalAllow) || (!isLocal && isImportantAllow))) {
                    this.appenders[logItem.appenders[i]].write(logItem);
                }
            }
        }
    };
    window.LoggerManager = LoggerManager;
    return LoggerManager;
});