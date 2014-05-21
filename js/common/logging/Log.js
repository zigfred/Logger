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

(function (factory, global) {
    if (typeof define === "function" && define.amd) {
        define(["underscore", "common/logging/Level", "common/logging/LogItem"], factory);
    } else {
        global.logging || (global.logging = {});
        global.logging.Log = factory(_, global.logging.Level, global.logging.LogItem);
    }
}(function(_, Level, LogItem) {

    function createLogMethod(type) {
        return function() {
            return this._prepareLogItem({
                level: Level.getLevel(type),
                args: arguments
            });
        }
    }

    function Log(id, logger) {
        this._id = id;
        this._tags = id.split(" ");
        this._logger = logger;
    }

    _.extend(Log.prototype, {
        _prepareLogItem: function(logItem) {
            logItem.id = this._id;
            logItem.tags = this._tags || [];
            logItem.args = Array.prototype.slice.call(logItem.args, 0);
            logItem.time = new Date();

            // TODO cross browser support
            var stack = new Error().stack;
            if (stack) {
                var lineAccessingLogger = stack.split("\n")[3];
                var res = lineAccessingLogger.match(/\/(\w+\.\w+):(\d+)/i);
                if (res) {
                    logItem.file = res[1];
                    logItem.line = res[2];
                }
            }
            if (!logItem.file) {
                logItem.file = "unknown";
                logItem.line = "0";
            }

            logItem = new LogItem(logItem);

            this._logger._processLogItem(logItem);
            return logItem;
        },
        setLevel: function(level, tags) {
            tags = tags || this._tags;
            this._logger.setLevel(level, tags);
        },

        debug: createLogMethod("debug"),
        info: createLogMethod("info"),
        warn: createLogMethod("warn"),
        error: createLogMethod("error")
    });



    return Log;
}, this));