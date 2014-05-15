var assert = require('assert');
var Fx = require('../index');

describe('fx', function() {
    var fx;
    beforeEach(function() {
        var $ = require('jquery');
        var element = $('<div style="position:absolute;left:10px;background-color:#f2fef0;width:400px">innert test div</div>');
        $('body').append(element);

        fx = new Fx(element);
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

    it.only('start && complete', function(done) {
        fx.start('width', 600);
        fx.on('complete', done);
    });

    it('start && cancel', function(done) {
        fx.start();
        fx.on('cancel', done);
        fx.on('complete', function() {
            done(true);
        });
        setTimeout(function() {
            fx.cancel();
        }, 200);
    });

    it('start && stop', function(done) {
        fx.start();
        fx.on('complete', function() {
            done(true);
        });

        fx.on('stop', done);

        setTimeout(function() {
            fx.stop();
        }, 200);
    });
});