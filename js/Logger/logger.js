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


});