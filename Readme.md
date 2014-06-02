
# Logger


## Config
Inserts in requirejs config.

```javascript
requirejs.config({
    config: {
        logger: {
            root: {
                level: "off",
                appenders: ["console"]
            }
            modules: {
                "foo/*": "error",
                "foo/bar": "debug"
            }
        }
    }
});
```

## LogItem

```javascript
{
    id: "moduleFoo",
    args: ["message 1", [object Error], "message 2", [object Object], [DOM element], [function]],
    level: [object Level],
    time: [object Date],
    file: "filename.js",
    line: 23,
}
```


## Log

Initialize:

```javascript
var log = Logger.register("somename");
var log2 = Logger.register(module); // module = {id: "moduleId"}
```

### Methods
#### info, log, debug, warn, error
Set level of log item.

```javascript
log.info("message");
log.warn("shit coming");
``` 
#### _prepareLogItem
Create logItem object, add data such as time, cid, file, etc. Then forward it to manager.


## logger
Mediator, fabric.
Global object for manage logs from console.

#### methods
* register
* enable
* disable
* setLevel



## Output targets:
### console
Browser console.
[Browser support](https://developer.mozilla.org/en-US/docs/Web/API/console.log)

|                     | Chrome | Firefox   |    IE      | Opera | Safari |
| ------------------- |:------:|: ----  -: |:----------:|:-----:|:------:|
| Basic support       | Yes    | 4.0 (2.0) | 8          | Yes   | Yes    |
| Substitution strings| Yes    | 9.0 (9.0) | 10 partial | Yes   | Yes    |

## Levels.

all
debug
info
warn
error
off


# Usage
examples: [https://github.com/zigfred/Logger/tree/master/js/modules](https://github.com/zigfred/Logger/tree/master/js/modules)
## Case 1. Debugging

`config.js`

```javascript
config: {
    logger: {
        root: {
            level: "debug",
            appenders: ["console"]
        },
        modules: {
            "folder/moduleFoo": "debug"
        }
    }
}
```

`moduleFoo.js`

```javascript
define(['module', 'logger'], function(module, logger) {
    "use strict";

    function start() {
        var log = logger.register(module);
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

});
```

