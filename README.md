# fx

> Animation and Easing functions

## Getting Started
Before anything taking its part, you should install [node](http://nodejs.org) and "cortex".

#### Install Node

Visit [http://nodejs.org](http://nodejs.org), download and install the proper version of nodejs.

#### Install Cortex

    # maybe you should use `sudo`
    npm install -g cortex

## Using fx In Your Project

First, install 'fx' directly with `ctx install` (recommended)
	
	ctx install fx --save
	
or, you could update your package.json manually
    
    dependencies: {
        'fx': '<version-you-want>'
    }
    
and install dependencies
	
	ctx install
    
Then, use `require` method in your module
    
    var fx = require('fx');

## Usage

```javascript
var Fx = require('fx');

var tween = new Fx(element, {
    duration: 500,
    unit: 'px'
}).start('height', 100);

tween.on('complete', function() {
    // do on complete
});

var morph = new Fx(element, {
    duration: 100, 
    unit: 'px',
    transition: Fx.Transition.Sine.easeIn
}).start({
    height: 300,
    width:  {
        from: 80, 
        to: 100,
        unit: '%'
    },
    x: [100, 200]
})

morph.on('complete', function() {
    console.log('morph is completed');
});


```


## API Documentation

### Fx(element, [options])

Create a Fx instance for later execution

### element {Node|Element}

html element, HTMLElement Node or wrapping by jquery.

#### options {Object}

- options.duration {number} milisecond that the animation will last.
- options.unit {string} property unit when setting to element
- options.transition {function} transition functions to calculate the intermediate value, see [Fx.Transitions](#fx.transitions)
- options.link {string} how the fx behaves when another start called when the fx does not complete yet. Available value are:
    * _ignore_ next start call will just be ignored. Default value.
    * _cancel_ cancel current run and start next immediately.
    * _chain_ start next after all the previous `start` calls complete.

### fx.start(property, from, to)

Start fx which change property from value 'from' to value 'to'

* property {string}  name of property
* from {Object} start value
* to {Object} to value


### fx.start(property, to)

Start fx, as no from value provided, fx will use current value as from value.

* property {string}  name of property
* to {Object} to value


### fx.start(properties)

Start fx with more than one property changes.

#### properties {Object}

Properties like following format:

```javascript
{
    'width': 100,  // to
    'height': [100, 300],  // from, to
    'background-color': {
        from: "#00ff00",
        to: "#ff00ff"
    },
    'left': {
        to: 100, 
        unit: 'px'
    }
}
```

When property value is a single number or string, it will be treated as end value; when it's an array, the first element will be start value and second element will be end value; when it's a object, the 'from' and 'to' property will be run as start/end value.




### fx.stop()

Stop the current animation, will emit 'stop' event; it can not be resumed anymore.


### fx.cancel()

Cancel the current animation, will emit 'cancel' event; it can not be resumed anymore.

### fx.pause()

Pause the current animation, it can be resumed later by `fx.resume`.

### fx.resume()

Resume the animation which paused by 'fx.pause' before.

### Fx.Transitions

A collection of transitions.


#### Fx.Transitions.linear

#### Fx.Transitions.Pow

* Fx.Transitions.Pow.easeIn
* Fx.Transitions.Pow.easeOut
* Fx.Transitions.Pow.easeInOut

#### Fx.Transitions.Expo

#### Fx.Transitions.Circ

#### Fx.Transitions.Sine

#### Fx.Transitions.Back

#### Fx.Transitions.Bounce

#### Fx.Transitions.Elastic


