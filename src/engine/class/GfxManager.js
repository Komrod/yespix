

function GfxManager(canvas, list) {
	
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
}


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


GfxManager.prototype.add = function(entity) {
	entity.manager = this;
    this.list.push(entity);
    this.isZSorted = false;
    this.isReady = false;
    return this.list.length - 1;
};


GfxManager.prototype.remove = function(entity) {
};


GfxManager.prototype.sort = function() {
	yespix.quickSort(this.list, function(a, b) {
		if (a.position && b.position && a.position.z < b.position.z) {
			return true;
		}
		return false;
	});
	
    this.isZSorted = true;
};


GfxManager.prototype.event = function(event) {
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


GfxManager.prototype.loadAssets = function(options) {
	if (!options.complete) {
		options.complete = function() {
			
		}
	}
	this.loader = new Loader(options, this.getAssets());
	this.loader.execute();
};


GfxManager.prototype.when = function(eventName, fn) {
	if (!this.events[eventName]) this.events[eventName] = new Array();
	this.events[eventName].push(fn);
};


GfxManager.prototype.trigger = function(eventName, event) {
	if (!this.events[eventName]) return false;
	var len = this.events[eventName].length;
	for (var t=0; t<len; t++) {
		this.events[eventName][t](event);
	}
	return true;
};


