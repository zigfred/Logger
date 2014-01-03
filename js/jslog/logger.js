/*
 * Copyright (C) 2005 - 2013 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 * Licensed under commercial Jaspersoft Subscription License Agreement
 */

/**
 * @author: psavushchik
 * @version: 0
 */
define(function(require, exports, module){
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
    }
    Logger.prototype.getLevel = function() {
        return this._level;
    };
    Logger.prototype.setLevel = function(level) {
        // TODO parse level
        this._level = level;
    };
    Logger.prototype.prepareLogItem = function(logItem) {
        /*
        if (!LoggerManager.enabled) return;
        if (!logItem.level.isGreaterOrEqual(this._level)
            && LoggerManager.levelImportant === "local") return;
        if (!logItem.level.isGreaterOrEqual(LoggerManager.levelImportant)
            && LoggerManager.levelImportant !== "local") return;
        */

        logItem.id = this._id;
        logItem.args = Array.prototype.slice.call(logItem.args, 0);
        logItem.time = new Date();

        var stack = new Error().stack;
        var lineAccessingLogger = stack.split("\n")[3];
        var res = lineAccessingLogger.match(/\/(\w+\.\w+):(\d+)/i);
        logItem.file = res[1];
        logItem.line = res[2];

        logItem = new LogItem(logItem);

        LoggerManager.pushItem(logItem);



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
    LogItem.prototype.toString = function(){
        var logParams = [];
        logParams.push(this.time.toLocaleTimeString());
        logParams.push(this.id);
        logParams.push("[" + this.level.toString() + "] -");
        logParams = logParams.concat(this.args);

        return logParams.join(" ");
    };

    var LoggerManager = {
        enabled: (typeof config.enabled === "boolean") ? config.enabled : true,
        levelImportant: (typeof config.levelImportant === "string") ? config.levelImportant : "local",
        loggers: {},
        logList: [],
        register: function(options) {
            var settings = {
                id: "root",
                level: (this.levelImportant === "local") ? Level.getLevel("ALL") : this.levelImportant
            };

            if (typeof options === "string" && options !== "") {
                settings.id = options;
            } else if (options.hasOwnProperty("id")) {
                settings.id = options.id;

                if (options.hasOwnProperty("level")) {
                    settings.level = Level.getLevel(options.level);
                }
                if (options.hasOwnProperty("appenders")) {
                    settings._appenders = options.appenders.slice();
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
        pushItem: function(logItem) {
            this.logList.push(logItem);
        }
    };
    window.LoggerManager = LoggerManager;
    return LoggerManager;
});