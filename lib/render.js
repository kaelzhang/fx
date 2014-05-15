var util = require('util');
var parser = require('./parser');
var $ = require('jquery');



var ATOM_ALREADY_COMPUTED = {}; // atom flag

module.exports = Render;

/** 
 * Css Render, as default
 */
function Render(element, properties, options) {
    this.element = element = $(element);
    this.properties = {};
    this.unit = (options && options.unit) || false;

    var froms = this.froms = {}, tos = this.tos = {};

    for (var p in properties) {
        var args = properties[p];

        if (util.isString(args) || util.isNumber(args))
            args = {
                to: args
            };

        if (util.isArray(args)) {
            args = (args[1] == null) ? {
                to: args[0]
            } : {
                from: args[0],
                to: args[1]
            };
        }
        if (!args.hasOwnProperty('from')) {
            // read current property
            var style = this.element.css(p);
            args.from = style === 'auto' ? 0 : style;
        }

        this.properties[p] = args;
    }

    for (var p in this.properties) {
        froms[p] = parser(this.properties[p].from);
        tos[p] = parser(this.properties[p].to);
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



Render.prototype.progress = function(progress) {
    var styles = {};
    for (var p in this.froms) {
        var value = this.compute(progress, this.froms[p], this.tos[p]);
        styles[p] = this.serve(value, this.properties[p].unit || this.unit);
    }

    this.element.css(styles);
};


// serves the value as settable
Render.prototype.serve = function(sprite, unit) {
    if (sprite._ !== ATOM_ALREADY_COMPUTED) {
        sprite = parser(sprite);
    }

    return sprite.parser.serve(sprite.value, unit);
};