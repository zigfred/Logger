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

    var Log = require("common/logging/Log"),
        fakeLogger = {
            _processLogItem: function(){},
            setLevel: function(){}
        };


    describe("Log", function() {
        var emptyFn = function(){};

        it("has exists", function() {
            expect(Log).toBeDefined();
        });

        it("should create log instance", function() {
            var log = new Log("id", fakeLogger);
            expect(typeof log).toEqual("object");
        });

        describe("log instance creation", function(){
            var log = new Log("tag1 tag2", fakeLogger);

            it("has debug method",function() {
                expect(typeof log.debug).toEqual("function");
            });
            it("has info method",function() {
                expect(typeof log.info).toEqual("function");
            });
            it("has warn method",function() {
                expect(typeof log.warn).toEqual("function");
            });
            it("has error method",function() {
                expect(typeof log.error).toEqual("function");
            });


            it("should call _processLogItem logger method", function(){
                var spy = sinon.spy(fakeLogger, "_processLogItem");
                var log = new Log("id", fakeLogger);
                log.error("test error");

                expect(spy).toHaveBeenCalled();
                spy.restore();

            });
            it("should return logItem object", function(){
                var log = new Log("id", fakeLogger);
                var logError = log.error("test error");

                expect(typeof logError).toEqual("object");

            });
            it("should pass logItem object as parameter to callback", function(){
                var spy = sinon.spy(fakeLogger, "_processLogItem");
                var log = new Log("id", fakeLogger);
                var logError = log.error("test error");

                expect(spy).toHaveBeenCalledWith(logError);
                spy.restore();

            });

        });

        describe("log instance working", function(){

            // id
            it("should create logItem with id passed from logger", function() {
                var log = new Log("testId", fakeLogger);

                var logItem = log.error("msg");
                expect(logItem.id).toEqual("testId");
            });

            // id
            it("should create logItem with arguments", function() {
                var log = new Log("testId", fakeLogger);
                var arr = [1,2,3];

                var logItem = log.error("msg", arr);
                expect(logItem.args[0]).toEqual("msg");
                expect(logItem.args[1]).toBe(arr);
            });

            // time
            it("should create logItem with arguments", function() {
                var log = new Log("testId", fakeLogger);

                var logItem = log.error("msg");
                expect(logItem.time instanceof Date).toBeTruthy();
            });

            // level
            it("should create logItem with level DEBUG", function() {
                var log = new Log("testId", fakeLogger);

                var logItem = log.debug("msg");
                expect(logItem.level.toString()).toEqual("DEBUG");
            });
            it("should create logItem with level INFO", function() {
                var log = new Log("testId", fakeLogger);

                var logItem = log.info("msg");
                expect(logItem.level.toString()).toEqual("INFO");
            });
            it("should create logItem with level WARN", function() {
                var log = new Log("testId", fakeLogger);

                var logItem = log.warn("msg");
                expect(logItem.level.toString()).toEqual("WARN");
            });
            it("should create logItem with level ERROR", function() {
                var log = new Log("testId", fakeLogger);

                var logItem = log.error("msg");
                expect(logItem.level.toString()).toEqual("ERROR");
            });

        });

    });

});