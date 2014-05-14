var hexrgb = require('hexrgb');


function compute(from, to, progress) {
    return (to - from) * progress + from;
};

module.exports = {
    Color: {
        parse: function(value) {
            if (value.match(/^#[0-9a-f]{3,6}$/i)) return hexrgb.hex2rgb(value, true);
            return ((value = value.match(/(\d+),\s*(\d+),\s*(\d+)/))) ? [value[1], value[2], value[3]] : false;
        },
        compute: function(from, to, progress) {
            var rs = [];
            for (var i = 0, len = from.length; i < len; ++i) {
                rs.push(Math.round(compute(from[i], to[i], progress)));
            }
            return rs;
        },
        serve: function(value) {
            var rs = [];
            while (var v = value.shift()) {
                rs.push(Number(v));
            }
            return rs;
        }
    },
    Number: {
        parse: parseFloat,
        compute: compute,
        serve: function(value, unit) {
            return (unit) ? value + unit : value;
        }
    },
    String: {
        parse: function() {
            return false;
        },
        compute: function(from, to) {
            return to;
        },
        serve: function(value) {
            return value;
        }
    }

},