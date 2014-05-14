var assert = require('assert');
var Fx = require('../index');

if (typeof document == 'undefined') {
    document = {
        getElementsByTagName: function() {
            return [{}];
        }
    };
}

describe.skip('fx', function() {
    var fx;
    beforeEach(function() {
        fx = new Fx(document.getElementsByTagName('body')[0]);
    });

    it('pause && resume', function(done) {
        this.timeout(5000);
        fx.start();
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
        fx.start();
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