var util = require('util');

function capitalize(str) {
    return str.substr(0, 1).toUpperCase() + str.substr(1);
}


function Transition(transition, params) {
    if (params == null)
        params = [];
    else if (!util.isArray(params))
        params = [params]; // caller should handle arguments

    var easeIn = function(pos) {
        return transition(pos, params);
    };

    easeIn.easeIn = easeIn;
    easeIn.easeOut = function(pos) {
        return 1 - transition(1 - pos, params);
    };
    easeIn.easeInOut = function(pos) {
        return (pos <= 0.5 ? transition(2 * pos, params) : (2 - transition(2 * (1 - pos), params))) / 2;
    };

    return easeIn;
};

var Transitions = {
    linear: function(zero) {
        return zero;
    }
};

/**
 * get transition from a string
 * @param {string} trans
 */
function getTransition(trans) {
    if (util.isString(trans)) {
        var data = trans.split(':');
        trans = Transitions;
        trans = trans[data[0]] || capitalize(trans[data[0]]);
        if (data[1]) trans = trans[capitalize('ease' + data[1]) + (data[2] ? capitalize(data[2]) : '')];
    }

    return trans;
}


Transitions.extend = function(transitions) {
    for (var transition in transitions) Transitions[transition] = new Transition(transitions[transition]);
};

Transitions.extend({

    Pow: function(p, x) {
        return Math.pow(p, x && x[0] || 6);
    },

    Expo: function(p) {
        return Math.pow(2, 8 * (p - 1));
    },

    Circ: function(p) {
        return 1 - Math.sin(Math.acos(p));
    },

    Sine: function(p) {
        return 1 - Math.cos(p * Math.PI / 2);
    },
    
    Back: function(p, x) {
        x = x && x[0] || 1.618;
        return Math.pow(p, 2) * ((x + 1) * p - x);
    },

    Bounce: function(p) {
        var value;
        for (var a = 0, b = 1; 1; a += b, b /= 2) {
            if (p >= (7 - 4 * a) / 11) {
                value = b * b - Math.pow((11 - 6 * a - 11 * p) / 4, 2);
                break;
            }
        }
        return value;
    },

    Elastic: function(p, x) {
        return Math.pow(2, 10 * --p) * Math.cos(20 * p * Math.PI * (x && x[0] || 1) / 3);
    }

});

['Quad', 'Cubic', 'Quart', 'Quint'].forEach(function(transition, i) {
    Transitions[transition] = new Transition(function(p) {
        return Math.pow(p, i + 2);
    });
});

module.exports = Transitions;