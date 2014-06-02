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

define(function (require, exports, module) {
    "use strict";

    var
        LoggerManager = require("common/logging/LoggerManager"),
        levels = require("common/enum/loggingLevels"),
        config = module.config();

    // check config
    config = clearConfig(config);

    var logger = new LoggerManager(config);

    return logger;

    function clearConfig(config) {
        var cleared = {
            root: {},
            modules: {}
        };
        if (typeof config !== "object") {
            return cleared;
        }

        if (config.hasOwnProperty("root")) {
            if (typeof config.root.level === "string" && typeof levels[config.root.level.toUpperCase()] === "number") {
                cleared.root.level = config.root.level;
            }
            if (typeof config.root.appenders === "object" && config.root.appenders[0]) {
                cleared.root.appenders = config.root.appenders;
            }
        }

        for (var i in config.modules) {
            if (config.modules.hasOwnProperty(i)) {
                if (i.match(/[\s]+/) || i === "" || typeof config.modules[i] !== "string") {
                    continue;
                }
                if (typeof config.modules[i] === "string" && typeof levels[config.modules[i].toUpperCase()] === "number") {
                    cleared.modules[i] = config.modules[i];
                }
            }
        }
        return cleared;
    }
});