var util = require('util');

var hexrgb;
try {
    hexrgb = require('hexrgb');
} catch (e) {};



function compute(from, to, progress) {
    return (to - from) * progress + from;
};

var parsers = {
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
            var rs = [],
                v;
            while (v = value.shift()) {
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
};


module.exports = function(value) {
    var found;
    
    value = String(util.isFunction(value) ? value() : value);

    for (var key in parsers) {
        var parser = parsers[key];
        var parsed = parser.parse(value);
        if (parsed || parsed === 0) {
            found = {
                value: parsed,
                parser: parser
            };

            break;
        }
    }

    found = found || {
        value: value,
        parser: PARSERS.String
    };

    return found;
};