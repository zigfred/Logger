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

define(function (require) {
    "use strict";

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

    return Level;
});