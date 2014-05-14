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
        transition: options.transition
    };


    this.duration = options.duration; // number only

    this.element = element;
    this.link = options.link || 'ignore';

    this.start = linker[this.link].call(this, this.start);

    // dont expose following attribute
}

util.inherits(Animate, EventEmitter);


/** 
 * @param {Object|string} properties| property
 * @param {*=} from 
 * @param {*=} to
 * @param {function=} callback
 */
// TODO: add complete callback for start function
Animate.prototype.start = function(properties, from, to, callback) {
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


    // TODO: render
    // var render = new Render(this.element, properties, this.renderOpts);


    // TODO: config different fps in properties, which runs multiple fx instances
    // real run
    var fx = this.__fx = new Fx(this.fxOpts);

    fx.on('progress', function(progress) {
        // TODO: hook render progress
        // console.log(progress);

    });


    var forwards = ['complete', 'start', 'stop', 'cancel'];
    for (var i = 0, len = forwards.length; i < len; ++i) {
        (function(event) {
            fx.on(event, function() {
                self.emit(event);
            });
        })(forwards[i]);
    }

    fx.start();
};


Animate.prototype.stop = function() {
    if (this.__fx) {
        this.__fx.stop();
        this.__fx.removeAllListeners();
        this.__fx = null;
    }
};

Animate.prototype.cancel = function() {
    if (this.__fx) {
        this.__fx.cancel();
        this.__fx.removeAllListeners();
        this.__fx = null;
    }
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


module.exports = Animate;