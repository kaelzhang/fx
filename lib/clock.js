// fps -> Array.<Fx instance> 
var _instances = {};
// fps -> timer
var _timers = {};

/**
 * Add system clock frequency
 *
 * @param {Fx} instance
 */
module.exports.addFx = function addClockTicking(instance) {
    var fps = instance.fps;
    var list = _instances[fps] || (_instances[fps] = []),
        timer = _timers[fps];

    list.push(instance);

    if (!timer) {
        _timers[fps] = setInterval(function() {
            var now = +new Date,
                len = list.length,
                instance;
            while (len--) {
                if (instance = list[len])
                    instance.step(now);
            }
        }, Math.round(1000 / fps));
    }
}


/**
 * Remove system clock frequency
 *
 * @param {Fx} instance
 */
module.exports.removeFx = function removeClockTicking(instance) {
    var fps = instance.fps,
        list = _instances[fps] || (_instances[fps] = []),
        timer = _timers[fps];

    for (var i = 0, len = list.length; i < len; i++) {
        if (list[i] === instance) {
            list.splice(i, 1); // delete the instance from list
        }
    }

    if (!list.length && timer) {
        // clear timer is no more instance in the list
        _timers[fps] = clearInterval(timer);
    }
}

/**
 * Tell whether the Fx instance is scheduled already
 *
 * @param {Fx} instance
 * @return {boolean}
 */
module.exports.isScheduled = function(instance) {
    var list = _instances[instance.fps];
    if (list) {
        if (list.indexOf) return list.indexOf(instance) != -1;

        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i] === instance) return true;
        }
    }

    return false;
};