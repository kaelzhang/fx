var util = require('util');
var EventEmitter = require('events');
var Fx = require('./fx');
// var Render = require('./css');
var parser = require('./parser');


var linker = {
    cancel: function(fn) {
        return function() {
            this.cancel();
            fn.apply(this, arguments);
        };
    },

    chain: function(fn) {
        var self = this,
            queue = self.__queue = self.__queue || [],
            running;

        function next() {
            var args = queue.shift();

            running = false;
            if (args) {
                running = true;
                run(args);
            }
        };

        function run(args) {
            fn.apply(args);
        };

        function add(args) {
            running ? queue.push(args) : run(args);
        };

        self.on('complete', next);

        return function() {
            add(arguments);
            return self;
        };
    },

    ignore: function(fn) {
        return function() {
            !this.isRunning() && fn.apply(this, arguments);
        }
    }
};


/**
 * Giving frame control and progress to Fx
 * Giving property change and rendering to Css
 */
function Animate(element, options) {
    EventEmitter.call(this);
    options = options || {};

    this.renderOpts = {
        unit: options.unit
    };

    this.fxOpts = {
        duration: options.duration,
        fps: options.fps,
        frameSkip: options.frameSkip,
        frames: options.frames,
        transition: transition
    };


    this.duration = options.duration; // number only

    this.element = element;
    this.link = options.link || 'ignore';

    this.start = linker(this, this.start);

    // dont expose following attribute
}

util.inheris(Animate, EventEmitter);


Animate.prototype.start = function(properties, from, to) {
    // normalize arguments, when use single property
    if (arguments.length > 1) {
        var prop = properties;
        properties = {};
        if (arguments.length == 2)
            properties[prop] = from;
        else
            properties[prop] = [from, to];
    }


    // TODO: render
    // var render = new Render(this.element, properties, this.renderOpts);

    // real run
    var fx = this._fx = new Fx(this.fxOpts);

    // TODO: hook render progress
    fx.on('step', function() {});


    var forwards = ['complete', 'start', 'stop', 'cancel'];
    for (var i = 0, len = forwards.length; i < len; ++i) {
        var event = forwards[i];
        fx.on(event, function() {
            self.emit(event);
        });
    }

    fx.start();
};


Animate.prototype.stop = function() {
    if (this.__fx) this.__fx.stop();
};

Animate.prototype.cancel = function() {
    if (this.__fx) this.__fx.cancel();
};

/**
 * @return {boolean}
 */
Animate.prototype.isRunning = function() {
    return this.__fx && this.__fx.isRunning();
};

Animate.prototype.resume = function() {
    if (this.__fx) this.__fx.resume();
};

Animate.prototype.pause = function() {
    if (this.__fx) this.__fx.pause();
};