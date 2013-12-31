"use strict";
define([
    'Logger'
], function(Logger){
  function run () {
    test('Logger should exists', function(){
      ok(typeof Logger, 'object', 'Logger module should exists');
    });

    test('Logger should parse requirejs config', function(){
      ok(typeof Logger, 'object', 'Logger module should exists');
    });

    var module1 = 'testModuleName1';
    var log1 = Logger.register(module1);
    test('logger should be created with string name', function(){
      equal(log1.id, module1, 'argument should be assigned to log1.id ');
    });

    var module2 = {id: 'testModuleName2'};
    var log2 = Logger.register(module2);
    test('logger should be created with module', function(){
      equal(log2.id, module2.id, 'id should be assigned from module2.id');
    });

    var log3 = Logger.register(module2);
    test('logger should return existed logger', function(){
      equal(log3, log2, 'objects should be the same');
    });




  }
  return {run: run};
});