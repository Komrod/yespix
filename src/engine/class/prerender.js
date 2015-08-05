

function Prerender(parameters, entity) {
	
    properties = properties || {};
    if (entity) this.entity = entity;


    var varDefault = {
    	enabled: true,
        updateOnReady: true,
        updateOnSize: true,
        updateOnRotation: false,
    };

    if (properties === false || parameters === false) {
    	parameters = {enabled: parameters};
    }

    this.set(properties, varDefault);

    this.canvas = myDocument.createElement('canvas');
    this.updateCanvasSize();
}


Prerender.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'prerender',
            properties: properties
        }
    );
};


Prerender.prototype.updateCanvasSize = function() {
	if (this.entity.aspect) {
		if (this.entity.aspect.width) {
			this.canvas.width = this.entity.aspect.width;
		}
		if (this.entity.aspect.height) {
			this.canvas.height = this.entity.aspect.height;
		}
	}
};


Prerender.prototype.use = function() {
	
};



Prerender.prototype.trigger = function(name) {
	if (name == 'ready' && this.updateOnReady || name == 'size' && this.updateOnSize || name == 'rotation' && this.updateOnRotation)
	{
		this.update();
	}
};


Prerender.prototype.update = function(type) {
    this.updateCanvasSize();
	this.entity.draw(this.canvas);
};


Prerender.prototype.draw = function(context) {
	// @todo draw prerender canvas to context
};


yespix.defineClass('prerender', Prerender);

