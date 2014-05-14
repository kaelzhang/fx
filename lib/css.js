var util = require('util');
var $ = require('jquery');
var parser = require('./parser');



var ATOM_ALREADY_COMPUTED = {}; // atom flag

/** 
 * Css Render, as default
 */
function Render(element, properties, options) {
    this.element = $(element);
    this.properties = properties;
    this.unit = (options && options.unit) || false;

    var froms = this.froms = {}, tos = this.tos = {};

    for (var p in properties) {
        var args = properties[p]
        if (util.isArray(args)) {
            if (args[1] == null) {
                args[1] = args[0]
                var style = this.element.css(p);
                args[0] = style === 'auto' ? 0 : style;
            }
            properties[p] = {
                from: args[0],
                to: args[1]
            };
        }
    }

    for (var p in properties) {
        froms[p] = parser(properties[p].from);
        tos[p] = parser(properties[p].to);
    }
}


// computes by a from and to prepared objects, using their parsers.
Render.prototype.compute = function(progress, from, to) {
    return {
        _: ATOM_ALREADY_COMPUTED,
        value: from.parser.compute(from.value, to.value, progress),
        parser: from.parser
    };
};


Render.prototype.render = function(property, val, unit) {
    for (var p in values) {
        this.element.css(p, this.serve(val, unit))
    }
};

Render.prototype.progress = function(progress) {
    for (var p in froms) {
        var value = this.compute(progress, froms[p], tos[p]);
        
        // TODO: using jquery change css in one call
        this.render(p, value, properties[p].unit || this.unit);
    }
};


// serves the value as settable
Render.prototype.serve = function(sprite, unit) {
    if (sprite._ !== ATOM_ALREADY_COMPUTED) {
        sprite = parser(sprite);
    }

    return sprite.parser.serve(sprite.value, unit);
};