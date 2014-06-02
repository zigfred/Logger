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

define(function(require) {
    "use strict"

    var LoggerManager = require("common/logging/LoggerManager"),
        Level = require("common/logging/Level"),
        loggingLevels = require("common/enum/loggingLevels"),
        ConsoleAppender = require("common/logging/appender/ConsoleAppender");

    describe("LoggerManager", function() {

        it("has exists", function() {
            expect(LoggerManager).toBeDefined();
        });

        it("should create logger instance", function(){
            var logger = new LoggerManager({});

            expect(logger instanceof LoggerManager).toBeTruthy();
        });

        describe("default settings", function() {

            var logger = new LoggerManager({});

            it("root level should be off", function(){
                expect(logger.config.root.level).toBe("off");
            });
            it("should create console appender", function(){
                expect(logger._appenderInstances.hasOwnProperty("console")).toBeTruthy();
            });
            it("should create empty object for loggers", function(){
                expect(logger._loggers).toEqual({});
            });

        });

        describe("process options", function() {

            // levels
            for (var i in loggingLevels) {
                if (loggingLevels.hasOwnProperty(i)) {

                    (function(levelName){
                        it("should set root level from config to " + levelName, function(){
                            var options = {
                                root: {
                                    level: levelName.toLowerCase()
                                }
                            };
                            var logger = new LoggerManager(options);

                            expect(logger.config.root.level).toBe(levelName.toLowerCase());
                        });
                    })(i);

                }
            }

            // setLevel
            it("should set log level for root", function(){
                var logger = new LoggerManager();
                logger.setLevel("warn");
                expect(logger.config.root.level).toBe("warn");
            });
            it("should set log level for modules or path", function(){
                var logger = new LoggerManager();
                logger.setLevel("warn", "foo/bar");
                expect(logger.config.modules["foo/bar"]).toBe("warn");
            });

            // appenders
            it("should add console appender instance", function(){
                var options = {
                    appenders: ["console"]
                };
                var logger = new LoggerManager(options);

                expect(logger._appenderInstances.console instanceof ConsoleAppender).toBeTruthy();
            });

        });

    });

});