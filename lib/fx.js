var util = require('util'),
    EventEmitter = require('events'),
    clock = require('./clock');


function Fx(options, startNow) {
    EventEmitter.call(this);
    var fps = this.fps = options.fps || 60;
    this.duration = options.duration || 500;
    this.frameSkip = options.hasOwnProperty('frameSkip') ? ( !! options.frameSkip) : true;
    this.frameInterval = 1000 / fps;
    this.frames = this.frames || Math.round(this.duration / this.frameInterval);
    this.transition = options.transition || function(p) {
        return -(Math.cos(Math.PI * p) - 1) / 2;
    };
}

util.inherits(Fx, EventEmitter);


Fx.prototype.step = function(now) {
    var self = this;

    if (self.frameSkip) {
        var diff = (self.time != null) ? (now - self.time) : 0;
        var skipFrames = diff / this.frameInterval;

        self.time = now;
        self.frame += skipFrames;
    } else {
        self.frame++;
    }

    if (self.frame < self.frames) {
        var progress = self.transition(self.frame / self.frames);
        self.emit('progress', progress);

    } else {
        self.frame = self.frames;
        self.emit('progress', 1);
        self.stop();
    }
};



Fx.prototype.start = function() {
    var self = this;

    self.time = null;
    /* @property {number} frame current frame */
    self.frame = self.frameSkip ? 0 : -1;

    self.emit('start');

    clock.addFx(self);

    return self;
};


Fx.prototype.stop = function() {
    var self = this;

    if (self.isRunning()) {
        self.time = null;

        clock.removeFx(self);

        if (self.frame === self.frames) {
            self.emit('complete');
        } else {
            self.emit('stop');
        }
    }

    return self;
};

Fx.prototype.cancel = function() {
    var self = this;
    if (self.isRunning()) {
        self.time = null;
        clock.removeFx(self);
        self.frame = self.frames; // set to end frames
        self.emit('cancel');
    }

    return self;
};

Fx.prototype.pause = function() {
    var self = this;
    if (self.isRunning()) {
        self.time = null;
        clock.removeFx(self);
    }

    return self;
};

Fx.prototype.resume = function() {
    var self = this;
    self.frame < self.frames && !self.isRunning() && clock.addFx(self);
    return self;
};


Fx.prototype.isRunning = function() {
    return clock.isScheduled(this);
};



module.exports = Fx;