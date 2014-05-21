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
        define(["underscore", "common/logging/Log", "common/logging/Level", "common/logging/appender/ConsoleAppender"], factory);
    } else {
        global.logging || (global.logging = {});
        global.logging.LoggerManager = factory(_, global.logging.Log, global.logging.Level, global.logging.appender.ConsoleAppender);
    }
}(function (_, Log, Level, ConsoleAppender) {

    var appenderConstructors = {
            console: ConsoleAppender
        };

    var LoggerManager = function(options) {
        this.initialize(options || {});
    };

    _.extend(LoggerManager.prototype, {

        defaults : function() {
            return {
                enabled: false,
                levels: {
                    root: "error"
                },
                appenders: {},
                _appenderInstances: {},
                loggers: {}
            }
        },

        initialize: function(options) {
            this.attributes = _.defaults(options, this.defaults());

            // initialize appenders
            var appenders = {};
            _.each(appenderConstructors, function(appender, name){
                appenders[name] = new appender();
            });
            this.set("_appenderInstances", appenders);

        },

        get: function(attr) {
            return this.attributes[attr];
        },

        set: function(attr, value) {
            this.attributes[attr] = value;
        },

        register: function(tags) {
            var loggers = this.get("loggers");

            if (_.isObject(tags)) {
                tags = [tags.id];
            }
            if (_.isUndefined(tags) || tags === "") {
                tags = ["root"];
            }
            if (typeof tags === "string" ) {
                tags = tags.split(" ");
            }
            var id = tags.join(" ");

            if (!loggers.hasOwnProperty(id)) {

                loggers[id] = new Log(id, this);

                //this.set("loggers", loggers);
            }
            return loggers[id];
        },
        disable: function() {
            this.set("enabled", false);
        },
        enable: function(level) {
            if (level) {
                this.setLevel(level);
            }
            this.set("enabled", true);
        },
        setLevel: function(level, tags) {
            if (typeof tags === "string") {
                tags = tags.split(" ");
            }
            if (_.isUndefined(tags)) {
                tags = ["root"];
            }
            var levels = this.get("levels");

            _.each(tags, function(tag) {
                levels[tag] = level;
            });
        },

        _processLogItem: function(logItem) {
            if (!this.get("enabled")) {
                return;
            }

            var levels = this.get("levels");

            // check local levels
            var tags = _.chain(levels)
                .map(function(level, name){
                    return _.contains(logItem.tags, name) && logItem.level.isGreaterOrEqual(level) && name;
                })
                .compact()
                .value();

            if (tags.length) {
                logItem.tags = tags;
                return this._appendLogItem(logItem);
            }

            // if root level ok
            if (logItem.level.isGreaterOrEqual(levels.root)) {
                logItem.tags = ["root"];
                return this._appendLogItem(logItem);
            }


        },
        _appendLogItem: function(logItem) {
            var appenders = this.get("appenders"),
                appenderInstances = this.get("_appenderInstances");
            for (var i in appenders) {
                if (appenderInstances.hasOwnProperty(appenders[i])) {
                    appenderInstances[appenders[i]].write(logItem);
                }
            }
        }
    });

    return LoggerManager;
}, this, this._));