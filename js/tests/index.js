define([
    "jasmine",
    "jasmine-html"
], function(jasmine, jasmine_html){

    var specs = [];
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