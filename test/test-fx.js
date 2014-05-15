var assert = require('assert');
var Fx = require('../index');
var $ = require('jquery');

describe('fx', function() {
    var fx, element;
    beforeEach(function() {
        element = $('#fx-test');
        if (!element.length) {
            element = $('<div id="fx-test" style="position:absolute;left:10px;background-color:#f2fef0;width:400px">innert test div</div>');
            $('body').append(element);
        }

        fx = new Fx(element);
    });


    it('with transition', function(done) {
        fx = new Fx(element, {
            duration: 1000,
            unit: 'px',
            transition: Fx.Transitions.Elastic
        });

        fx.start('left', 200);

        fx.on('complete', done);
    });

    it('link chain', function(done) {
        this.timeout(10000);
        fx = new Fx(element, {
            link: 'chain'
        });

        fx.start('left', 200);
        fx.start('background-color', '#ff00ed');
        
        fx.on('chainComplete', done);
    });

    it('pause && resume', function(done) {
        this.timeout(10000);

        fx.start('height', 100, 40);
        fx.on('complete', assert.fail);

        setTimeout(function() {
            fx.pause();
            fx.removeListener('complete', assert.fail);

            setTimeout(function() {
                fx.resume();
                fx.on('complete', done);
            }, 1000);
        }, 200);
    });

    it('start && complete', function(done) {
        fx.start('width', 600);
        fx.on('complete', done);
    });

    it('start && cancel', function(done) {
        fx.start({
            'background-color': '#0fe'
        });

        fx.on('cancel', done);
        fx.on('complete', function() {
            done(true);
        });

        setTimeout(function() {
            fx.cancel();
        }, 200);
    });

    it('start && stop', function(done) {
        fx.start({
            'width': [200, 400]
        });

        fx.on('complete', function() {
            done(true);
        });

        fx.on('stop', done);

        setTimeout(function() {
            fx.stop();
        }, 200);
    });
});