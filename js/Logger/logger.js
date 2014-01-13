/*
 * Copyright (C) 2005 - 2013 Jaspersoft Corporation. All rights reserved.
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
 * @author: psavushchik
 * @version: 0
 */

define(function (require, exports, module) {
    "use strict";

    var Logger = require("logger"),
        Levels = require("levels"),
        LogItem = require("logItem"),
        Appender = require("appender");

    var config = module.config();

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