var util = require('util');
var Render = require('../lib/render');
var assert = require('assert');


describe('render', function() {
    var element;

    beforeEach(function() {
        if (typeof window == 'undefined') {
            element = {
                styles: {
                    width: '30px'
                }
            };
        } else {
            var $ = require('jquery');
            element = $('<div style="position:absolute;left:10px;background-color:#f2fef0;width:400px">innert test div</div>');
            $('body').append(element);
        }
    });

    it('constructor', function() {
        var render = new Render(element, {
            'height': [100, 20],
            'width': 50,
            'left': {
                to: 100,
                unit: 'px'
            },
            'background-color': '#00f'
        }, {
            unit: 'px'
        });

        assert.equal(render.froms.height.value, 100);
        assert.equal(render.froms.width.value, 400);
        assert.equal(render.froms.left.value, 10);
        assert.deepEqual(render.froms['background-color'].value, [242, 254, 240]);

        assert.equal(render.tos.height.value, 20);
        assert.equal(render.tos.width.value, 50);
        assert.equal(render.tos.left.value, 100);
        assert.deepEqual(render.tos['background-color'].value, [0, 0, 255]);

        for (var p in render.properties) {
            var v = render.properties[p];
            assert.ok(v.hasOwnProperty('from') && v.hasOwnProperty('to'));
        }
    });
});