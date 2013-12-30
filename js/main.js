requirejs.config({
  baseUrl: 'js',
  paths: {
    'QUnit': 'libs/qunit-1.12.0',
    'Logger': 'jslog/logger'
  },
  shim: {
    'QUnit': {
      exports: 'QUnit',
      init: function() {
        QUnit.config.autoload = false;
        QUnit.config.autostart = false;
      }
    }
  },
  config: {
    Logger: {
      enable: true,
      level: 'debug',
      appenders: ['console']
    }
  }
});

require(
    [
      'QUnit',
      'tests/test1',
      'Logger',
      'modules/moduleFoo',
      'modules/moduleBar'
    ], function(
        QUnit,
        Test1,
        moduleFoo,
        moduleBar
        ) {
        // run the tests.
      //Test1.run();

        // start QUnit.
      //QUnit.load();
      //QUnit.start();

      moduleFoo.start();
      //moduleBar.start();
    }
);