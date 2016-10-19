/**
 * Copyright 2016 Performix LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global QUnit */
/* global ExtendedSelector */

QUnit.test( "Test ExtendedSelector", function( assert ) {
    var checkElements = function (elements, selector) {
        for (var i = 0; i < elements.length; i++) {
            assert.ok(selector.matches(elements[i]));
        }
    };

    var elements;
    var selector;

    selector = new ExtendedSelector('div a[-ext-contains="adg-test"]');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selector = new ExtendedSelector('div.test-class[-ext-has="time.g-time"]');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    assert.ok(selector.matches(elements[0]));

    selector = new ExtendedSelector('div#test-div[-ext-has="test"]');
    elements = selector.querySelectorAll();
    assert.equal(0, elements.length);

    elements = new ExtendedSelector('[-ext-has="div.advert"]').querySelectorAll();
    assert.equal(0, elements.length);

    selector = new ExtendedSelector('[-ext-has="div.test-class-two"]');
    elements = selector.querySelectorAll();
    assert.equal(5, elements.length);
    checkElements(elements, selector);

    selector = new ExtendedSelector('div[-ext-contains="adg-test"][-ext-has="div.test-class-two"]');
    elements = selector.querySelectorAll();
    assert.equal(3, elements.length);
    checkElements(elements, selector);

    selector = new ExtendedSelector('div[-ext-contains="adg-test"][-ext-has="div.test-class-two"][i18n]');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    checkElements(elements, selector);

    selector = new ExtendedSelector('div[-ext-has="div.test-class-two"]');
    elements = selector.querySelectorAll();
    assert.equal(3, elements.length);
    checkElements(elements, selector);

    selector = new ExtendedSelector('div[-ext-has="div.test-class-two"] > .test-class[-ext-contains="adg-test"]');
    elements = selector.querySelectorAll();
    assert.equal(1, elements.length);
    checkElements(elements, selector);
});

QUnit.test( "Test -ext-matches-css", function(assert) {
    // Compatible syntax
    var selector = new ExtendedSelector('#test-matches-css div[-ext-matches-css="background-image: url(about:*)"]');
    var elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById("test-div-background"));

    // Standard syntax
    selector = new ExtendedSelector('#test-matches-css div:matches-css(background-image: url(about:*))');
    elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById("test-div-background"));    
});

QUnit.test( "Test -ext-matches-css-before", function(assert) {
    // Compatible syntax
    var selector = new ExtendedSelector('#test-matches-css div[-ext-matches-css-before="content: *find me*"]');
    var elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById("test-div-before"));

    // Standard syntax
    selector = new ExtendedSelector('#test-matches-css div:matches-css-before(content: *find me*)');
    elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById("test-div-before"));    
});

QUnit.test( "Test -ext-matches-css-after", function(assert) {
    // Compatible syntax
    var selector = new ExtendedSelector('#test-matches-css div[-ext-matches-css-after="content: *find me*"]');
    var elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById("test-div-after"));

    // Standard syntax
    selector = new ExtendedSelector('#test-matches-css div:matches-css-after(content: *find me*)');
    elements = selector.querySelectorAll();

    assert.equal(1, elements.length);
    assert.equal(elements[0], document.getElementById("test-div-after"));    
});

QUnit.test( "Test tokenize selector", function(assert) {
    var selectorText = "#test";
    var compiled = new ExtendedSelector(selectorText).compiledSelector;
    assert.equal(compiled.simple, selectorText);
    assert.notOk(compiled.relation);
    assert.notOk(compiled.complex);

    selectorText = "div span.className > a[href^='http'] > #banner";
    compiled = new ExtendedSelector(selectorText).compiledSelector;
    assert.equal(compiled.simple, selectorText);
    assert.notOk(compiled.relation);
    assert.notOk(compiled.complex);

    selectorText = "div span.className + a[href^='http'] ~ #banner";
    compiled = new ExtendedSelector(selectorText).compiledSelector;
    assert.equal(compiled.simple, "div");
    assert.equal(compiled.relation, " ");
    assert.equal(compiled.complex, "span.className + a[href^='http'] ~ #banner");

    selectorText = "#banner div:first-child > div:has(.banner)";
    compiled = new ExtendedSelector(selectorText).compiledSelector;
    assert.equal(compiled.simple, "#banner div:first-child");
    assert.equal(compiled.relation, ">");
    assert.equal(compiled.complex, "div:has(.banner)");

    selectorText = "#banner div:first-child > div > :has(.banner) > div";
    compiled = new ExtendedSelector(selectorText).compiledSelector;
    assert.equal(compiled.simple, "#banner div:first-child > div");
    assert.equal(compiled.relation, ">");
    assert.equal(compiled.complex, ":has(.banner) > div");

    selectorText = "#banner :not(div) div:matches-css(background: blank)";
    compiled = new ExtendedSelector(selectorText).compiledSelector;
    assert.equal(compiled.simple, "#banner :not(div)");
    assert.equal(compiled.relation, " ");
    assert.equal(compiled.complex, "div:matches-css(background: blank)");

    selectorText = ":not(div .banner:has(test))";
    compiled = new ExtendedSelector(selectorText).compiledSelector;
    assert.notOk(compiled.simple);
    assert.notOk(compiled.relation);
    assert.equal(compiled.complex, ":not(div .banner:has(test))");    
});