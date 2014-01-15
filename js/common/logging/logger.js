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
 * @author: Pavel Savushchyk
 * @version: $Id$
 */

define(function (require, exports, module) {
    "use strict";

    var _ = require("underscore"),
        Log = require("common/logging/log"),
        Level = require("common/logging/level"),
        ConsoleAppender = require("common/logging/appenders/console"),
        config = module.config();

    return {
        _enabled: (typeof config.enabled === "boolean") ? config.enabled : false,
        _level: (typeof config.level === "string") ?
                Level.getLevel(config.level) : Level.getLevel("error"),
        _loggers: {},
        _appenders: {
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

            if (this._loggers.hasOwnProperty(settings.id)) {
                return this._loggers[settings.id];
            } else {
                return this._loggers[settings.id] = new Log(settings, _.bind(this._processLogItem, this))
            }
        },
        disable: function() {
            this._enabled = false;
        },
        enable: function(level) {
            if (level) this._level = Level.getLevel(level);
            this._enabled = true;
        },
        setLevel: function(level) {
            this._level = (typeof level === "string") ?
                Level.getLevel(level) : Level.getLevel("error");
        },
        _processLogItem: function(logItem) {
            if (this._enabled && logItem.level.isGreaterOrEqual(this._level)) {
                this._appendLogItem(logItem);
            }
        },
        _appendLogItem: function(logItem) {
            for (var i in this._appenders) {
                if (this._appenders.hasOwnProperty(i)) {
                    this._appenders[i].write(logItem);
                }
            }
        }
    };

});