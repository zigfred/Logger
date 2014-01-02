/*
js logger
 */
define(function(require, exports, module){

    function Level(level, name) {
        this.level = level;
        this.name = name;
    }
    Level.prototype.isGreaterThan = function(loggerLevel, logItemLevel) {
        return loggerLevel <= logItemLevel;
    };
    Level.prototype.toString = function() {
        return this.value;
    };
    Level.prototype.getLevel = function(level) {
        return Level[level.toUpperCase()];
    };
    Level["ALL"] = new Level(Number.MIN_VALUE, "ALL");
    Level["DEBUG"] = new Level(100, "DEBUG");
    Level["INFO"] = new Level(200, "INFO");
    Level["WARN"] = new Level(300, "WARN");
    Level["ERROR"] = new Level(400, "ERROR");
    Level["OFF"] = new Level(Number.MAX_VALUE, "OFF");


    function Logger(options) {
        this._id = options.id;
        this._level = options.level;
    }
    Logger.prototype.getLevel = function() {
        return this._level;
    };
    Logger.prototype.setLevel = function(level) {
        // TODO parse level
        this._level = level;
    };
    Logger.prototype.prepareLogItem = function(logItem) {
        logItem.args = Array.prototype.slice.call(logItem.args, 0);


    };
    var logMethods = ["info", "log", "debug", "warn", "error"];
    for (var i = 0, l = logMethods.length; i < l; i++) {
        Logger.prototype[logMethods[i]] = function() {
            this.prepareLogItem({
                level: logMethods[i],
                args: arguments
            });
        };
    }

    function LoggerManager() {

    }
    LoggerManager.prototype.register = function(options) {
        // TODO parse options

        return new Logger();
    };
    return LoggerManager;
});