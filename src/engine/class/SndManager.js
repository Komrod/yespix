

/**
 * Gfx manager class
 * Handle the list of Gfx entities
 * @parent  no
 */


function SndManager(list) {
	
	this.reset(list);
	return;

}


SndManager.prototype.ready = function(bool) {
    if (bool) {
        this.isReady = true;
        this.trigger(
            {
                type: 'ready',
                from: this,
                fromClass: 'SndManager'
            }
        );
    } else {
        this.isReady = false;
        this.trigger(
            {
                type: 'notReady',
                from: this,
                fromClass: 'SndManager'
            }
        );
    }
};


SndManager.prototype.stepEntity = function(time) {
    var length = this.list.length,
    	t=0;
    for (; t<length; t++) {
    	if (this.list[t]) this.list[t].step(time);
    }
    return true;
};


SndManager.prototype.step = function(time) {
	this.stepEntity(time);
};


SndManager.prototype.add = function() {
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


SndManager.prototype.remove = function() {
	for (var t = 0; t < arguments.length; t++) {
		for (var u = this.list.length-1; u >=0; u--) {
			if (this.list[u] == arguments[t]) {
				this.list.splice(u, 1);
		    }
		}
	}	
	return true;
};


SndManager.prototype.trigger = function(event) {
	if (event.from == this) return false;

	if (event.type == 'ready') {
		this.getReady();
	}

	return true;
};


SndManager.prototype.getReady = function() {

	var len = this.list.length;
	for (var t=0; t<len; t++) {
		if (!this.list[t].isReady) {
			this.ready(false);
			return false;
		}
	}
	
	this.ready(true);

	return true;
};


SndManager.prototype.getAssets = function() {
	var len = this.list.length;
	var assets = [];
	for (var t=0; t<len; t++) {
		assets = assets.concat(this.list[t].getAssets());
	}
	assets = yespix.unique(assets);
	return assets;
};


SndManager.prototype.loadAssets = function(properties) {
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


SndManager.prototype.load = function() {
	manager.each(function() { 
		if (this.load) this.load(); 
	});
};


SndManager.prototype.each = function(fn) {
	var len = this.list.length;
	for (var t=0; t<len; t++) {
		fn.call(this.list[t]);
	}
};


GfxManager.prototype.reset = function(list) {
	// set the list
    this.list = list || [];
    this.event = new yespix.class.eventHandler();

    this.ready(true);

	return true;
};


yespix.defineClass('sndManager', SndManager);

