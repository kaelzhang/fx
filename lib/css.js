var util = require('util');
var $ = require('jquery');



var ATOM_ALREADY_COMPUTED = {}; // atom flag

/** 
 * Css Render, as default
 */
function Render(element, properties, options) {
    this.element = $(element);

    this.unit = (options && options.unit) || false;

    var from = {}, to = {};

    for (var p in properties) {
        var args = properties[p]
        if (!util.isArray(args))
            args = [args];

        if (args[1] == null) {
            args[1] = args[0]
        }
    }

    for (var p in properties) {
        from[p] = parsed.from;
        to[p] = parsed.to;
    }
}

// prepares the base from/to object
Render.prototype._prepare = function(property, args) {
    if (!util.isArray(args))
        args = [args];

    if (args[1] == null) {
        args[1] = args[0];
        var style = this.element.css(property);
        args[0] = style === 'auto' ? 0 : style;
    }

    return {
        from: parser(args[0]),
        to: parser(args[1])
    };
};



// computes by a from and to prepared objects, using their parsers.
Render.prototype._compute = function(progress) {
    return {
        _: ATOM_ALREADY_COMPUTED,
        value: from.parser.compute(from.value, to.value, progress),
        parser: from.parser
    };
};


Render.prototype.render = function(values) {
    for (var p in values) {
        this.element.css(p, this.)
    }
};


Render.prototype.progress = function(progress) {

};


// serves the value as settable
Render.prototype._serve = function(sprite, unit) {
    if (sprite._ !== ATOM_ALREADY_COMPUTED) {
        sprite = this._parse(sprite);
    }

    return sprite.parser.serve(sprite.value, unit);
};


// renders the change to an element
Render.prototype._render = function(property, value, unit) {
    this.element.css(property, this._serve(value, unit));
};