

function GfxManager(canvas, list) {
	
	this.reset(canvas, list);
	return;

	// init
	this.canvas = null;
	this.context = null;

	// set the canvas
	if (canvas === true) this.setCanvas(yespix.createCanvas(true));
	else if (canvas) this.setCanvas(canvas);

	// set the list
    this.list = list || [];
    this.event = new yespix.class.eventHandler();
    
    this.isZSorted = false;
    this.isReady = true;
}

GfxManager.prototype.setPhysics = function(physics) {
	this.physics = physics;
	if (this.physics.setManager) {
		physics.setManager(this);
	}
};


GfxManager.prototype.applyPhysics = function(time) {
	if (!this.physics) {
		return false;
	}

    var length = this.list.length,
    	t=0;
    for (; t<length; t++) {
    	if (this.list[t].actor) this.list[t].actor.step(time);
    	if (this.list[t].collision) this.list[t].collision.applyPhysics();
    }
    return true;
};

GfxManager.prototype.drawDebug = function() {
	this.context.lineWidth = 1;
	this.physics.drawDebug();
};

GfxManager.prototype.step = function(time) {
	this.physics.world.Step(time/1000, 500, 50);
};



GfxManager.prototype.setCanvas = function(canvas) {
	this.canvas = canvas;
	if (this.canvas) {
		this.context = this.canvas.getContext('2d');
	} else {
		this.context = null;
	}
};


GfxManager.prototype.draw = function(context) {
	if (context) {
		this.context = context;
	} else if (!this.context) {
		return false;
	}

    if (!this.isZSorted) {
    	this.sort();
    }

    var length = this.list.length,
    	t=0;
    for (; t<length; t++) {
    	this.list[t].draw(this.context);
    }
    return true;
};


GfxManager.prototype.drawFps = function(ms, max) {
	if (!this.context) {
		return false;
	}

	if (!this.fps) {
		this.fps = new yespix.entity.fps();
	}
	if (max) {
		this.fps.max = max;
	}
  	this.fps.drawRender(this.context, ms);

    return true;
};


GfxManager.prototype.add = function() {
	for (var t = 0; t < arguments.length; t++) {

		arguments[t].manager = this;

		var len = this.list.length;
		var added = false;
		for (var u=0; u<len; u++) {
			if (this.list[u].position.z > arguments[t].position.z) {
				this.list.splice(u, 0, arguments[t]);
				added = true;
				break;
			}
		}
		if (!added) {
		    this.list.push(arguments[t]);
		}

	    if (!arguments[t].isReady) {
	    	this.isReady = false;
	    }
	}	
	return this.list.length - 1;
};


GfxManager.prototype.remove = function() {
	for (var t = 0; t < arguments.length; t++) {
		for (var u = this.list.length-1; u >=0; u--) {
			if (this.list[u] == arguments[t]) {
				this.list.splice(u, 1);
		    }
		}
	}	
	return true;
};


GfxManager.prototype.sort = function() {
	yespix.quickSort(this.list, function(a, b) {
		if (a.position && b.position && a.position.z <= b.position.z) {
			return true;
		}
		return false;
	});
	
    this.isZSorted = true;
};

/**
 * Find the z sort position of an entity
 * @param  {entity} The entity
 * @return {integer} Index position
 */
GfxManager.prototype.findZSortPosition = function(entity) {

};

GfxManager.prototype.trigger = function(event) {
console.log('GfxManager:trigger ', event);
	if (event.type == 'ready') {
		if (this.getReady()) {
			this.isReady = true;
			this.trigger('ready', event);
		}
		return true;
	}
	return true;
};


GfxManager.prototype.getReady = function() { 
	var len = this.list.length;
	for (var t=0; t<len; t++) {
		if (!this.list[t].isReady) {
			return false;
		}
	}
	return true;
};


GfxManager.prototype.getAssets = function() { 
	var len = this.list.length;
	var assets = [];
	for (var t=0; t<len; t++) {
		assets = assets.concat(this.list[t].getAssets());
	}
	assets = yespix.unique(assets);
	return assets;
};


GfxManager.prototype.loadAssets = function(properties) {
	properties = properties || {};
	var manager = this;
	if (!properties.complete) {
		properties.complete = function(event) {
			manager.load();
		}
	}
	this.loader = new Loader(properties, this.getAssets());
	this.loader.execute();
};

GfxManager.prototype.load = function() {
	manager.each(function() { 
		if (this.load) this.load(); 
	});
};

GfxManager.prototype.each = function(fn) {
	var len = this.list.length;
	for (var t=0; t<len; t++) {
		fn.call(this.list[t]);
	}
};


GfxManager.prototype.when = function(eventName, fn) {
	this.event.add()
};


GfxManager.prototype.trigger = function(eventName, event) {
	if (!this.events[eventName]) return false;
	var len = this.events[eventName].length;
	for (var t=0; t<len; t++) {
		this.events[eventName][t](event);
	}
	return true;
};

GfxManager.prototype.clear = function() {
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	return true;
};

GfxManager.prototype.reset = function(canvas, list) {
	// init
	this.canvas = null;
	this.context = null;

	// set the canvas
	if (canvas === true) this.setCanvas(yespix.createCanvas(true));
	else if (canvas) this.setCanvas(canvas);

	// set the list
    this.list = list || [];
    this.events = {};

    this.isZSorted = false;
    this.isReady = true;

	return true;
};

yespix.defineClass('gfxManager', GfxManager);