"use strict";
define([
    'Logger'
], function(Log){
  function run () {
    test('Log should exists', function(){
      ok(typeof Log, 'object', 'Lib should exists');
    });

    var module = {id: 'testModule'};
    var log = Log.register(module);
    test('Log should created with module', function(){
      equal(log.id, module.id, 'id should take from module.id');
    });
  }
  return {run: run};
});