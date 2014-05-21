define([
    "jasmine",
    "jasmine-html",
    "jasmine-sinon"
], function(jasmine, jasmine_html, sinon){

    var specs = [];
    specs.push('tests/appender/ConsoleAppenderTests');
    specs.push('tests/LevelTests');
    specs.push('tests/LogItemTests');
    specs.push('tests/LogTests');
    specs.push('tests/LoggerManagerTests');
    specs.push('tests/loggerTests');

    var jasmineEnv = jasmine.getEnv();
    jasmineEnv.updateInterval = 1000;

    var htmlReporter = new jasmine.HtmlReporter();

    jasmineEnv.addReporter(htmlReporter);

    jasmineEnv.specFilter = function (spec) {
        return htmlReporter.specFilter(spec);
    };

    return {
        start: function() {
            require(specs, function (spec) {
                jasmineEnv.execute();
            });
        }
    }

});