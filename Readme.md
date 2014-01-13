
# Logger


## Config
Inserts in requirejs config.

```javascript
requirejs.config({
    config: {
        logger: {
            enabled: true,
            level: "debug",
            appenders: ["console"]
        }
    }
});
```

## logItem

```javascript
{
    id: "moduleFoo",
    args: ["message 1", [object Error], "message 2", [object Object]],
    level: [object Level],
    time: [object Date],
    file: "filename.js",
    line: 23,
}
```


## Log.

Initialize:

```javascript
var log = Logger.register("somename");
var log2 = Logger.register(module); // module = {id: "moduleId"}
```

### Methods
#### info, log, debug, warn, error
Set level.

```javascript
log.info("message");
log.warn("shit coming");
``` 
#### prepareLogItem
Create logItem object, add data such as time, cid, file, etc. Then forward it to manager.


## Manager.
Mediator, fabric.
Global object for manage logs from console.

#### properties
* _enabled
* _level
* _loggers
* _console
* _restTargets


#### methods
* enable
* disable
* enableConsole
* disableConsole
* getFilters
* setFilter
* unsetFilter
* getLevel
* setLevel
* register



## Output targets:
### console
Browser console.
[Browser support](https://developer.mozilla.org/en-US/docs/Web/API/console.log)

|                     | Chrome | Firefox   |    IE      | Opera | Safari |
| ------------------- |:------:|: ----  -: |:----------:|:-----:|:------:|
| Basic support       | Yes    | 4.0 (2.0) | 8          | Yes   | Yes    |
| Substitution strings| Yes    | 9.0 (9.0) | 10 partial | Yes   | Yes    |

## Levels.

debug
info
warn
error


# Usage
## Case 1. Debugging

`config.js`

```javascript
config: {
    Logger: {
        enabled: true,
        level: "debug",
        appenders: ["console"]
    }
}
```

`moduleFoo.js`

```javascript
define(['module', 'Logger'], function(module, Logger) {
    "use strict";

    function start() {
        var log = Logger.register(module);
        log.info("Initialized");
        log.warn("warning");
        try {
            //do some stuff
            log.debug("debug");
            //do some stuff
        } catch (e) {
            log.error(e);
        }
        log.info("Finish");
    }

    return {start: start};
});
```

