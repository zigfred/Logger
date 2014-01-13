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
define(function(require) {
    "use strict";

    var Level = require("Logger/level");

    function Log(settings, callback) {
        this._id = settings.id;
        this._callback = callback;
    }

    Log.prototype._prepareLogItem = function(logItem) {
        logItem.id = this._id;
        logItem.args = Array.prototype.slice.call(logItem.args, 0);
        logItem.time = new Date();

        var stack = new Error().stack;
        var lineAccessingLogger = stack.split("\n")[3];
        var res = lineAccessingLogger.match(/\/(\w+\.\w+):(\d+)/i);
        logItem.file = res[1];
        logItem.line = res[2];

        this._callback(logItem);
    };
    Log.prototype.log = function() {
        this._prepareLogItem({
            level: Level.getLevel("info"),
            args: arguments
        });
    };
    Log.prototype.info = function() {
        this._prepareLogItem({
            level: Level.getLevel("info"),
            args: arguments
        });
    };
    Log.prototype.debug = function() {
        this._prepareLogItem({
            level: Level.getLevel("debug"),
            args: arguments
        });
    };
    Log.prototype.warn = function() {
        this._prepareLogItem({
            level: Level.getLevel("warn"),
            args: arguments
        });
    };
    Log.prototype.error = function() {
        this._prepareLogItem({
            level: Level.getLevel("error"),
            args: arguments
        });
    };

    return Log;
});