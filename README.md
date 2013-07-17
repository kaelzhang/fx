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
    
Finally, start cortex server
    
    ctx server
    
Then cortex will care all the rest.


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