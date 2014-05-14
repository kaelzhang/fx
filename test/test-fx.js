var assert = require('assert');
var Fx = require('../index');

describe('fx', function() {
    it('contructor', function() {
        var fx = new Fx(document.getElementByTag('body'));
    });
});