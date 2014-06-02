/*
 * Copyright (C) 2005 - 2014 Jaspersoft Corporation. All rights reserved.
 * http://www.jaspersoft.com.
 *
 * Unless you have purchased  a commercial license agreement from Jaspersoft,
 * the following license terms  apply:
 *
 * This program is free software: you can redistribute it and/or  modify
 * it under the terms of the GNU Affero General Public License  as
 * published by the Free Software Foundation, either version 3 of  the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU Affero  General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public  License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */


/**
 * @author: Pavel Savushchyk
 * @version: $Id$
 */


(function (factory, global, _) {
    if (typeof define === "function" && define.amd) {
        define([ "common/logging/Log", "common/logging/Level", "common/logging/appender/ConsoleAppender"], factory);
    } else {
        global.logging || (global.logging = {});
        global.logging.LoggerManager = factory(global.logging.Log, global.logging.Level, global.logging.appender.ConsoleAppender);
    }
}(function (Log, Level, ConsoleAppender) {

    var appenderConstructors = {
        console: ConsoleAppender
    };

    var LoggerManager = function(options) {
        this._initialize(options || {});
    };

    LoggerManager.prototype._defaults = function() {
        return {
            root: {
                level: "off",
                appenders: ["console"]
            },
            modules: {}
        }
    };
    LoggerManager.prototype._initialize = function(options) {
        this._loggers = {};
        this.config = defaults(options, this._defaults());

        // initialize appenders
        var appenders = {};
        for (var i in appenderConstructors) {
            if (appenderConstructors.hasOwnProperty(i)) {
                appenders[i] = new appenderConstructors[i]();
            }
        }
        this._appenderInstances = appenders;
    };

    LoggerManager.prototype.register = function(module) {
        var id = "root";

        if (typeof module === "string" && module !== "") {
            id = module;
        } else if (module && module.hasOwnProperty("id")) {
            id = module.id;
        }
        if (!this._loggers.hasOwnProperty(id)) {
            this._loggers[id] = new Log(id, {
                processLogItem: LoggerManager.prototype.processLogItem.bind(this),
                setLevel:  LoggerManager.prototype.setLevel.bind(this)
            });
        }

        return this._loggers[id];
    };
    LoggerManager.prototype.disable = function(path) {
        path || (path = "root");
        this.setLevel("off", path);
    };
    LoggerManager.prototype.enable = function(path, level) {
        level || (level = "all");
        this.setLevel(level, path);
    };
    LoggerManager.prototype.setLevel = function(level, path) {
        level || (level = "off");
        if (!path || path === "root") {
            this.config.root.level = level;
        } else {
            this.config.modules[path] = level;
        }
    };
    LoggerManager.prototype.processLogItem = function(logItem) {
        var masks = _collectPathConfigs(logItem.id, this.config.modules);

        if ((logItem.id === "root" || !masks.length) && logItem.level.isGreaterOrEqual(this.config.root.level)) {
            return this._appendLogItem(logItem);
        } else if (logItem.level.isGreaterOrEqual(this.config.modules[masks.shift()])) {
            return this._appendLogItem(logItem);
        } else {
            return false;
        }
    };
    LoggerManager.prototype._appendLogItem = function(logItem) {
        for (var i in this._appenderInstances) {
            if (this._appenderInstances.hasOwnProperty(i)) {
                this._appenderInstances[i].write(logItem);
            }
        }
    };

    return LoggerManager;

    function _collectPathConfigs(path, patterns) {
        if (path === "root") {
            return ["root"];
        }
        var masks = [];

        for (var mask in patterns) {
            if (patterns.hasOwnProperty(mask)) {
                if (path.match(new RegExp("^" + mask))) {
                    masks.push(mask);
                }
            }
        }

        masks.sort().reverse();

        return masks;
    }

    function defaults(object) {
        if (!object) {
            return object;
        }
        for (var argsIndex = 1, argsLength = arguments.length; argsIndex < argsLength; argsIndex++) {
            var iterable = arguments[argsIndex];
            if (iterable) {
                for (var key in iterable) {
                    if (object[key] == null) {
                        object[key] = iterable[key];
                    }
                }
            }
        }
        return object;
    }

}, this, this._));