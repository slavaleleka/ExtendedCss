var LOOP_COUNT = 10000;

var testPerformance = function(selector, assert) {
    var startTime = new Date().getTime();
    var iCount = LOOP_COUNT;
    var resultOk = true;
    while (iCount--) {
        var nodes = selector.querySelectorAll();
        if (!nodes || !nodes.length) {
            resultOk = false;
        }
    }
    var elapsed = new Date().getTime() - startTime;
    var msg = 'Elapsed: ' + elapsed + ' ms\n';
    msg += 'Count: ' + LOOP_COUNT + '\n';
    msg += 'Average: ' + elapsed / LOOP_COUNT + ' ms';

    assert.ok(resultOk, msg);
};

QUnit.test("Test simple selector", function(assert) {
    var selector = {
        querySelectorAll: function() {
            return document.querySelectorAll(".container #case1 div div");
        }
    }
    testPerformance(selector, assert);
});

QUnit.test("Test :has performance", function(assert) {
    var selectorText = ".container #case1 div div:has(.banner)";
    var selector = new ExtendedSelector(selectorText);
    testPerformance(selector, assert);
});

QUnit.test("Test :contains performance", function(assert) {
    var selectorText = ".container #case2 div div:contains(Block this)";
    var selector = new ExtendedSelector(selectorText);
    testPerformance(selector, assert);
});

QUnit.test("Test :matches-css performance", function(assert) {
    var selectorText = ".container #case3 div div:matches-css(background: about:blank)";
    var selector = new ExtendedSelector(selectorText);
    testPerformance(selector, assert);
});

QUnit.test("Test :has and :contains composite performance", function(assert) {
    var selectorText = ".container #case4 div div:has(.banner:contains(Block this))";
    var selector = new ExtendedSelector(selectorText);
    testPerformance(selector, assert);
});