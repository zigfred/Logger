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

    var Log = require("Logger/log"),
        Level = require("Logger/level"),
        LogItem = require("Logger/logItem"),
        ConsoleAppender = require("Logger/appenders/console");

    var config = module.config();

    var Logger = {
        enabled: (typeof config.enabled === "boolean") ? config.enabled : false,
        level: (typeof config.level === "string") ?
                Level.getLevel(config.level) : Level.getLevel("error"),
        loggers: {},
        logList: [],
        appenders: {
            console: new ConsoleAppender()
        },
        register: function(options) {
            var settings = {
                id: "root"
            };

            if (typeof options === "string" && options !== "") {
                settings.id = options;
            } else if (options && options.hasOwnProperty("id")) {
                settings.id = options.id;
            }

            if (this.loggers.hasOwnProperty(settings.id)) {
                return this.loggers[settings.id];
            } else {
                // TODO replace bind for support IE8-
                return this.loggers[settings.id] = new Log(settings, this.addLogItem.bind(this));
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

            for (var i in this.appenders) {
                if (this.appenders.hasOwnProperty(i)) {
                    if (this.enabled && logItem.level.isGreaterOrEqual(this.level)) {
                        this.appenders[i].write(logItem);
                    }
                }
            }

        }
    };
    window.Logger = Logger;
    return Logger;

});