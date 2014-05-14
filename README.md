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
var Fx = require('fx').Fx;

var tween = new Fx(element, {
    duration: 500,
    unit: 'px'
}).start('height', 100);

ani.on('complete', function() {
    // do on complete
});

var morph = new Fx(element, {
    duration: 100, 
    unit: 'px'
}).start({
    height: 300,
    width:  {
        from: 80, 
        to: 100,
        unit: '%'
    },
    x: [100, 200]
});


```


## API Documentation

### fx: constructor
': constructor' means the `module.exports` of module 'fx' is a constructor that we should use it with the `new` keyword

	new fx(options)
	
#### options
- options.name {String}



### fx.\<method-name\>(arguments)
Means this is a static method of `module.exports`

#### arguments
// arguments description here

### .\<method-name\>(arguments)
Mean this is a method of the instance

#### arguments
// arguments description here