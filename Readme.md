
# Logger


## Config
Inserts in requirejs config.

```javascript
{
    enable: true, // default: false
    cid: "cid", // default - root or getting id from app??
    level: "debug", // default: error
    baseUrl: "url.com/logs", // url to default REST server
    console: true, // default: false
    filter: ["moduleFoo"] // filter by module names for console only?
                          // extend to rich filtering for console
}
```

## logItem

```javascript
{
    cid: "testedClient1",
        // or another identifier or several fields - user login, session id etc.
        // For identify logs from necessary web page by these
        // params in logger web-client.
    module: "moduleFoo", // root, module id, string
    args: ["message 1", [object Error], "message 2", [object Object]],
    level: [object Level],
    time: [object Date],
    file: "filename.js",
    line: 23,
}
```


## Logger.

Initialize:

```javascript
var log = Logger.register("name");
var log2 = Logger.register(module); // module = {id: "moduleId"}
```

### Methods
#### info, log, debug, warn, error
Set level.

```javascript
log.info("message");
log.warn("shit coming");
``` 
#### _createItem
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

### POST to REST server.
`cid` - client id. Proxy for send multiply messages.

```javascript
POST /:cid/log
{
    cid: "testedClient1",
    module: "moduleFoo",
}
```

### callback
just call function with `logItem`

## Levels.
LogItem level
Manager level


## REST server
Each client has id which identifies client's logs

```javascript
POST /:cid/log - save logItem
GET /:cid/log - return logItem
// Filters
GET /:cid/logs
```

##  Web client for REST API - with websockets, filters



# Usage
## Case 1. Debugging

`config.js`

```javascript
config: {
    Logger: {
        enabled: true,
        cid: "testSome1",
        level: "debug",
        baseUrl: "/logs",
        console: true
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
All logs will sent to server and saved.
To view logs need open logger web client.

*Here will be shoot of web client*
Use filters for find necessary logs.


## Case 2. Troubleshooting
Dev1 wants to see what user1 is doing when app crashes. Dev1 sets
flag on the server `forceLog: user1`.
User1 loads page. Script checks Logger server and receives the response
that it should enable logging.
Until user1 does his work with app, app sends logs to server.
Dev1 views all user actions and other technical information that he
needs on Logger web client.