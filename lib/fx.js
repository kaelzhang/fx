var util = require('util');
var EventEmitter = require('events');
var Frames = require('./frames');
var Render = require('./render');
var parser = require('./parser');


var linker = {
    cancel: function(fn) {
        return function() {
            this.cancel();
            fn.apply(this, arguments);
        };
    },
    // TODO:  queue may have memory leak problem
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
            } else {
                self.emit('chainComplete');
            }
        };

        function run(args) {
            fn.apply(args);
        };

        function add(args) {
            running ? queue.push(args) : (running = true, run(args));
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
 * Giving frame control and progress to Frames
 * Giving property change and rendering to Render
 */
function Fx(element, options) {
    var self = this;
    EventEmitter.call(this);
    options = options || {};

    this.renderOpts = {
        unit: options.unit
    };

    this.framesOpts = {
        duration: options.duration,
        fps: options.fps,
        frameSkip: options.frameSkip,
        frames: options.frames,
        transition: options.transition
    };


    this.element = element;
    this.link = options.link || 'ignore'; // TODO: link should work with multiple frames together

    var start = this.start;
    this.start = linker[this.link].call(this, function() {
        start.apply(self, arguments);
    });

    // dont expose following attribute
}

util.inherits(Fx, EventEmitter);


/** 
 * @param {Object|string} properties| property
 * @param {*=} from
 * @param {*=} to
 */
// TODO: add complete callback for start function
Fx.prototype.start = function(properties, from, to) {
    var self = this;
    // normalize arguments, when use single property
    if (arguments.length > 1) {
        var prop = properties;
        properties = {};
        if (arguments.length == 2)
            properties[prop] = [from];
        else
            properties[prop] = [from, to];
    }


    var render = new Render(this.element, properties, this.renderOpts);

    // TODO: config different fps in properties, which runs multiple fx instances
    // real run
    var frames = this.__frames = new Frames(this.framesOpts);

    frames.on('progress', function(p) {
        render.progress(p);
    });



    var forwards = ['complete', 'start', 'stop', 'cancel'];
    for (var i = 0, len = forwards.length; i < len; ++i) {
        (function(event) {
            frames.on(event, function() {
                self.emit(event);
            });
        })(forwards[i]);
    }

    frames.start();
};


Fx.prototype.stop = function() {
    if (this.__frames) {
        this.__frames.stop();
        this.__frames.removeAllListeners();
        this.__frames = null;
    }
};

Fx.prototype.cancel = function() {
    if (this.__frames) {
        this.__frames.cancel();
        this.__frames.removeAllListeners();
        this.__frames = null;
    }
};

/**
 * @return {boolean}
 */
Fx.prototype.isRunning = function() {
    return this.__frames && this.__frames.isRunning();
};

Fx.prototype.resume = function() {
    if (this.__frames) this.__frames.resume();
};

Fx.prototype.pause = function() {
    if (this.__frames) this.__frames.pause();
};


module.exports = Fx;