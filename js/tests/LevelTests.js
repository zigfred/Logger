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

    var Level = require("common/logging/Level");


    describe("Level", function() {

        it("has exists", function() {
            expect(Level).toBeDefined();
        });

        it("should return name of level", function(){
            var levelName = Level.getLevel("info").toString();
            expect(levelName).toEqual("INFO");
        });

        it("should return all level instance", function() {
            var level = Level.getLevel("all");
            expect(level.level).toEqual(0);
            expect(level.name).toEqual("ALL");
        });

        it("should return debug level instance", function() {
            var level = Level.getLevel("debug");
            expect(level.level).toEqual(100);
            expect(level.name).toEqual("DEBUG");
        });

        it("should return info level instance", function() {
            var level = Level.getLevel("info");
            expect(level.level).toEqual(200);
            expect(level.name).toEqual("INFO");
        });

        it("should return warn level instance", function() {
            var level = Level.getLevel("warn");
            expect(level.level).toEqual(300);
            expect(level.name).toEqual("WARN");
        });

        it("should return error level instance", function() {
            var level = Level.getLevel("error");
            expect(level.level).toEqual(400);
            expect(level.name).toEqual("ERROR");
        });

        it("should return off level instance", function() {
            var level = Level.getLevel("off");
            expect(level.level).toEqual(1000);
            expect(level.name).toEqual("OFF");
        });

        describe("comparison levels", function(){

            var levels = {
                all: Level.getLevel("all"),
                debug: Level.getLevel("debug"),
                info: Level.getLevel("info"),
                warn: Level.getLevel("warn"),
                error: Level.getLevel("error"),
                off: Level.getLevel("off")
            };

            it("should off level be greater than all levels", function() {
                expect(levels.off.isGreaterOrEqual(levels.all)).toBeTruthy();
                expect(levels.off.isGreaterOrEqual(levels.debug)).toBeTruthy();
                expect(levels.off.isGreaterOrEqual(levels.info)).toBeTruthy();
                expect(levels.off.isGreaterOrEqual(levels.warn)).toBeTruthy();
                expect(levels.off.isGreaterOrEqual(levels.error)).toBeTruthy();
                expect(levels.off.isGreaterOrEqual(levels.off)).toBeTruthy();
            });
            it("should error level be greater than off", function() {
                expect(levels.error.isGreaterOrEqual(levels.all)).toBeTruthy();
                expect(levels.error.isGreaterOrEqual(levels.debug)).toBeTruthy();
                expect(levels.error.isGreaterOrEqual(levels.info)).toBeTruthy();
                expect(levels.error.isGreaterOrEqual(levels.warn)).toBeTruthy();
                expect(levels.error.isGreaterOrEqual(levels.error)).toBeTruthy();
                expect(levels.error.isGreaterOrEqual(levels.off)).toBeFalsy();
            });
            it("should warn level be greater than all except error", function() {
                expect(levels.warn.isGreaterOrEqual(levels.all)).toBeTruthy();
                expect(levels.warn.isGreaterOrEqual(levels.debug)).toBeTruthy();
                expect(levels.warn.isGreaterOrEqual(levels.info)).toBeTruthy();
                expect(levels.warn.isGreaterOrEqual(levels.warn)).toBeTruthy();
                expect(levels.warn.isGreaterOrEqual(levels.error)).toBeFalsy();
                expect(levels.warn.isGreaterOrEqual(levels.off)).toBeFalsy();
            });
            it("should info level be greater than debug, info and all, but lesser than warn and error", function() {
                expect(levels.info.isGreaterOrEqual(levels.all)).toBeTruthy();
                expect(levels.info.isGreaterOrEqual(levels.debug)).toBeTruthy();
                expect(levels.info.isGreaterOrEqual(levels.info)).toBeTruthy();
                expect(levels.info.isGreaterOrEqual(levels.warn)).toBeFalsy();
                expect(levels.info.isGreaterOrEqual(levels.error)).toBeFalsy();
                expect(levels.info.isGreaterOrEqual(levels.off)).toBeFalsy();
            });
            it("should error level be lesser than except debug and all", function() {
                expect(levels.debug.isGreaterOrEqual(levels.all)).toBeTruthy();
                expect(levels.debug.isGreaterOrEqual(levels.debug)).toBeTruthy();
                expect(levels.debug.isGreaterOrEqual(levels.info)).toBeFalsy();
                expect(levels.debug.isGreaterOrEqual(levels.warn)).toBeFalsy();
                expect(levels.debug.isGreaterOrEqual(levels.error)).toBeFalsy();
                expect(levels.debug.isGreaterOrEqual(levels.off)).toBeFalsy();
            });
            it("should all level be greater than all", function() {
                expect(levels.all.isGreaterOrEqual(levels.all)).toBeTruthy();
                expect(levels.all.isGreaterOrEqual(levels.debug)).toBeFalsy();
                expect(levels.all.isGreaterOrEqual(levels.info)).toBeFalsy();
                expect(levels.all.isGreaterOrEqual(levels.warn)).toBeFalsy();
                expect(levels.all.isGreaterOrEqual(levels.error)).toBeFalsy();
                expect(levels.all.isGreaterOrEqual(levels.off)).toBeFalsy();
            });

        });

    });

});