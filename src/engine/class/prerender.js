

function Prerender(properties, entity) {
	
    properties = properties || {};
    if (entity) this.entity = entity;


    var varDefault = {
        updateOnReady: true,
        updateOnSize: true,
        updateOnRotation: false,
        enabled: true
    };

    this.set(properties, varDefault);

    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext('2d');
    this.updateCanvasSize();
this.canvas.style.cssText = 'border: 5px solid #995511;';    
document.body.appendChild(this.canvas);
    this.isReady = false;
}


Prerender.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entity.trigger(
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
    if (!this.entity.boundary.image) {
        this.entity.boundary.image = this.entity.getBoundaryDraw();
    }
    if (this.entity.boundary.draw) {
		if (this.entity.boundary.draw.width) {
			this.canvas.width = this.entity.boundary.draw.width;
		}
		if (this.entity.aspect.height) {
			this.canvas.height = this.entity.boundary.draw.height;
		}
	}

};


Prerender.prototype.use = function(context) {
//return false;
    if (!this.enabled) {
        return false;
    }
    if (!this.isReady) {
        this.update();
    }
    this.draw(context);
    return true;
};



Prerender.prototype.trigger = function(event) {

	if (event.fromClass != 'prerender' && (event.type == 'change' || event.type == 'ready' || event.type == 'notReady'))
	{
		this.isReady = false;
	}

};


Prerender.prototype.update = function() {
    this.updateCanvasSize();
    this.boundary = this.getPrerender();

    this.entity.boundary.image.x = 0;
    this.entity.boundary.image.y = 0;
    this.entity.boundary.image.width = this.boundary.imageWidth;
    this.entity.boundary.image.height = this.boundary.imageHeight;
    
    this.entity.boundary.clip.x = 0;
    this.entity.boundary.clip.y = 0;
    this.entity.boundary.clip.width = this.boundary.clipWidth;
    this.entity.boundary.clip.height = this.boundary.clipHeight;
    
    this.entity.aspect.width = this.boundary.width;
    this.entity.aspect.height = this.boundary.height;
    this.entity.aspect.alpha = 1.0;

    this.entity.position.x = this.entity.boundary.draw.x - this.entity.position.x;
    this.entity.position.y = this.entity.boundary.draw.y - this.entity.position.y;
    this.entity.position.rotation = 0;

	this.entity.drawRender(this.context);
//console.log(this.entity); aze;


    this.entity.boundary.image.x = this.boundary.imageX;
    this.entity.boundary.image.y = this.boundary.imageY;
    this.entity.boundary.image.width = this.boundary.imageWidth;
    this.entity.boundary.image.height = this.boundary.imageHeight;
    
    this.entity.boundary.clip.x = this.boundary.clipX;
    this.entity.boundary.clip.y = this.boundary.clipY;
    this.entity.boundary.clip.width = this.boundary.clipWidth;
    this.entity.boundary.clip.height = this.boundary.clipHeight;
    
    this.entity.aspect.width = this.boundary.width;
    this.entity.aspect.height = this.boundary.height;
    this.entity.aspect.alpha = this.boundary.alpha;

    this.entity.position.x = this.boundary.x;
    this.entity.position.y = this.boundary.y;
    this.entity.position.rotation = this.boundary.rotation;

    this.isReady = true;
};


Prerender.prototype.draw = function(context) {

    var contextSaved = false;
    if (this.entity.position.rotation != 0) {
        var pivot = this.entity.getPivot();
        contextSaved = true;
        context.save();
        context.translate(pivot.x, pivot.y);
        context.rotate(this.entity.position.rotation * Math.PI / 180);
        context.translate(-pivot.x, -pivot.y);
    }
    if (this.entity.aspect.flipX || this.entity.aspect.flipY) {
        if (!contextSaved) {
            context.save();
        }
        contextSaved = true;
        context.scale( (this.entity.aspect.flipX ? -1 : 1), (this.entity.aspect.flipY ? -1 : 1) );
    }

    context.globalAlpha = this.entity.aspect.alpha;
    context.drawImage(this.canvas, //image element
        this.entity.boundary.clip.x, // x position on image
        this.entity.boundary.clip.y, // y position on image
        this.entity.boundary.clip.width, // width on image
        this.entity.boundary.clip.height, // height on image
        this.entity.boundary.image.x, // x position on canvas
        this.entity.boundary.image.y, // y position on canvas
        this.entity.boundary.image.width, // width on canvas
        this.entity.boundary.image.height // height on canvas
    );

    if (contextSaved) {
        context.restore();
    }
};

/*
Prerender.prototype.getBoundaryImage = function(context) {
    return {
        x: this.entity.position.x,
        y: this.entity.position.y,
        width: this.canvas.width,
        height: this.canvas.height
    }
};


Prerender.prototype.getBoundaryClip = function(context) {
    return {
        x: 0,
        y: 0,
        width: this.canvas.width,
        height: this.canvas.height
    }
};
*/

Prerender.prototype.getPrerender = function(context) {
    if (!this.entity.boundary.clip) {
        this.entity.boundary.clip = this.entity.getBoundaryClip();
    }
    if (!this.entity.boundary.image) {
        this.entity.boundary.image = this.entity.getBoundaryImage();
    }

    return {
        imageX: this.entity.boundary.image.x,
        imageY: this.entity.boundary.image.y,
        imageWidth: this.entity.boundary.image.width,
        imageHeight: this.entity.boundary.image.height,
        clipX: this.entity.boundary.clip.x,
        clipY: this.entity.boundary.clip.y,
        clipWidth: this.entity.boundary.clip.width,
        clipHeight: this.entity.boundary.clip.height,
        x: this.entity.position.x,
        y: this.entity.position.y,
        width: this.entity.aspect.width,
        height: this.entity.aspect.height,
        alpha: this.entity.aspect.alpha,
        rotation: this.entity.position.rotation
    };
};


yespix.defineClass('prerender', Prerender);

