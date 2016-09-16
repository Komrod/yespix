

/**
 * Image class
 * Load and control one or multiple images
 * @events  create ready notReady change load unload destroy
 * @parent  entity
 */


function Image(properties, entity) {
    
    properties = properties || {};
    if (entity) this.entity = entity;
    if (yespix.isString(properties)) {
        properties = {src: properties};
    }
    
    var varDefault = {
        src: '',  // source and params of the images
        scale: 1.0, // default original loading scale of the images
        autoSize: true, // default change the size of the entity.aspect when element ready
        autoLoad: true,
        offsetX: 0,
        offsetY: 0
    };

    this.set(properties, varDefault);

    this.isLoading = false;
    this.isReady =  false;
    this.hasError = false;
    this.element = null;

    this.entityTrigger('create');

    if (this.autoLoad) {
        this.load();
    }
}


Image.prototype.entityTrigger = function(type, properties) {
    if (this.entity) {
        properties = properties || {};
        this.entity.trigger(
            {
                type: type,
                entity: this.entity,
                from: this,
                fromClass: 'Image',
                properties: properties
            }
        );
    }
};


Image.prototype.ready = function(bool) {
    if (bool) {
        this.isLoading = false;
        this.hasError = false;

        this.element.isLoading = false;
        this.element.isReady = true;
        this.element.hasError = false;

        if (this.entity.aspect) {
            if (this.autoSize || this.entity.aspect.width == 0) {
                this.entity.aspect.width = this.element.width;
            }
            if (this.autoSize || this.entity.aspect.height == 0) {
                this.entity.aspect.height = this.element.height;
            }
        }

        this.isReady = true;
        this.entityTrigger('ready');
    } else {
        this.isReady = false;
        this.entityTrigger('notReady');
    }
};


Image.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    if (!yespix.isUndefined(properties.scale) && properties.scale != 1) {
        if (this.isReady) {
            this.load(this.element.source);
        }
    }
    this.entityTrigger('change', properties);
};


/**
 * Takes an image and a scaling factor and returns the scaled image
 * The original image is drawn into an offscreen canvas of the same size
 * and copied, pixel by pixel into another offscreen canvas with the 
 * new size. In some browsers it crashes due to a security restriction 
 * (in chrome), in that case we try to copy the scaled image with drawImage.
 */
Image.prototype.resize = function(img, scale) {
    
    if (!scale || parseFloat(scale) == 1) {
        return img;
    }
    
    var widthScaled = img.width * scale;
    var heightScaled = img.height * scale;

    var orig = document.createElement('canvas');
    orig.width = img.width;
    orig.height = img.height;
    var origCtx = orig.getContext('2d');
    origCtx.drawImage(img, 0, 0);

    try {
        // error with Canvas tainted by cross-origin data here
        var origPixels = origCtx.getImageData(0, 0, img.width, img.height); 

        var scaled = document.createElement('canvas');
        scaled.width = widthScaled;
        scaled.height = heightScaled;
        var scaledCtx = scaled.getContext('2d');

        // error with Canvas tainted by cross-origin data also here
        var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);

        for (var y = 0; y < heightScaled; y++) {
            for (var x = 0; x < widthScaled; x++) {
                var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
                var indexScaled = (y * widthScaled + x) * 4;
                scaledPixels.data[indexScaled] = origPixels.data[index];
                scaledPixels.data[indexScaled + 1] = origPixels.data[index + 1];
                scaledPixels.data[indexScaled + 2] = origPixels.data[index + 2];
                scaledPixels.data[indexScaled + 3] = origPixels.data[index + 3];
            }
        }
        scaledCtx.putImageData(scaledPixels, 0, 0);
    } catch(err) {
        var scaled = document.createElement('canvas');
        scaled.width = widthScaled;
        scaled.height = heightScaled;
        var scaledCtx = scaled.getContext('2d');

        // try to get rid of blured pixels
        scaledCtx.webkitImageSmoothingEnabled = false;
        scaledCtx.mozImageSmoothingEnabled = false;
        scaledCtx.imageSmoothingEnabled = false;

        scaledCtx.drawImage(img, 0, 0, widthScaled, heightScaled);
    }

    return scaled;
};


Image.prototype.initScale = function() {
    if (!this.element) return false;
    var src = this.element.source;
    
    if (this.scale == 1) {
        this.linkElement('remove');
        this.element = yespix.getCache('img:'+src+':1');
        this.linkElement('add');
        return true;
    }
    this.linkElement('remove');
    this.element = yespix.getCache('img:'+src+':'+this.scale);

    if (this.element) {
        this.linkElement('add');
        if (this.element.isReady) {
            this.ready(true);
        }
        return true;
    }
    var img = yespix.getCache('img:'+src+':1');
    this.element = this.resize(img, this.scale);
    this.linkElement('add');
    this.element.isReady = true;
    this.ready(true);
};


Image.prototype.linkElement = function(type) {
    if (!this.entity || !type || !this.element) return false;
    if (type == 'add') {
        if (this.linkElement('detect', this.entity)) return true;

        if (!this.element.entities) {
            this.element.entities = new Array();
        }
        this.element.entities.push(this.entity);
        return true;

    } else if (type == 'remove') {
        if (!this.element.entities || this.element.entities.length == 0) return true;
        var len = this.element.entities.length;
        for (var t=len-1; t>=0; t--) {
            if (this.entity == this.element.entities[t]) {
                this.element.entities.splice(t, 1);
            }
        }
        return true;

    } else if (type == 'detect') {
        if (!this.element.entities || this.element.entities.length == 0) return false;
        var len = this.element.entities.length;
        for (var t=len-1; t>=0; t--) {
            if (this.entity == this.element.entities[t]) {
                return true;
            }
        }
        return false;
    }
    return false;
};


Image.prototype.unload = function() {
    this.src = '';
    this.linkElement('remove');
    this.element = null;
    this.isLoading = false;
    this.hasError = false;
    if (this.entity) {
        this.entity.isReady = false;
        this.entity.boundary = {};
    }

    this.entityTrigger('unload');
    this.ready(false);
};


Image.prototype.load = function(src) {
    if (!src && (this.isLoading || this.isReady)) {
        return false;
    }
    
    src = src || this.src;
    if (!src) return false;
    this.src = src;
    
    // get cache at current scale
    this.linkElement('remove');
    this.element = yespix.getCache('img:'+src+':'+this.scale);
    if (this.element) {
        this.linkElement('add');
        if (this.element.isReady) {
            this.ready(true);
        }
        return true;
    }

    if (this.scale != 1) {
        // get cache at scale 1
        this.linkElement('remove');
        this.element = yespix.getCache('img:'+src+':1');
        if (this.element) {
            this.linkElement('add');
            if (this.element.isReady) {
                this.initScale();
            }
            return true;
        }
    }

    // load image at scale 1
    this.element = document.createElement('img');
    this.element.entities = new Array();
    if (this.entity) {
        this.element.entities.push(this.entity);
    }
    this.element.source = src;
    yespix.setCache('img:'+src+':1', this.element);
    
    // set the onload event for image element
    this.element.onload = function(e) {

        var len = this.entities.length;
        for (var t=len-1; t>=0; t--) {
            this.entities[t].image.initScale();
        }

        var len = this.entities.length;
        for (var t=0; t<len; t++) {
            this.entities[t].image.ready(true);
        }
    };

    this.element.onerror = function(e) {
        var len = this.entities.length;
        for (var t=0; t<len; t++) {
            this.entities[t].image.error();
        }
    };

    // set src after onload event
    this.element.src = src;

    this.element.isLoading = true;
    this.element.isReady = false;
    this.element.hasError = false;
    
    this.isLoading = true;
    this.hasError = false;

    this.entityTrigger('load');
    this.ready(false);
};

/*
Image.prototype.ready = function() {
    this.isLoading = false;
    this.isReady = true;
    this.hasError = false;

    if (this.entity.image == this) {
        this.entity.isReady = true;
    }
    this.element.isLoading = false;
    this.element.isReady = true;
    this.element.hasError = false;

    if (this.entity.aspect) {
        if (this.autoSize || this.entity.aspect.width == 0) {
            this.entity.aspect.width = this.element.width;
        }
        if (this.autoSize || this.entity.aspect.height == 0) {
            this.entity.aspect.height = this.element.height;
        }
    }

    this.entity.trigger(
        {
            type: 'ready',
            from: this,
            fromClass: 'Image',
            entity: this.entity
        }
    );
};
*/

Image.prototype.error = function() {
    this.isLoading = false;
    this.isReady = false;
    this.hasError = true;

    if (this.entity.image == this) {
        this.entity.isReady = false;
    }
    this.element.isLoading = false;
    this.element.isReady = false;
    this.element.hasError = true;

    this.entityTrigger('error');
    /*
    this.entity.trigger(
        {
            type: 'error',
            from: this,
            fromClass: 'Image',
            entity: this.entity
        }
    );
    */
};


Image.prototype.draw = function(context) {
    if (!this.isReady) {
        return false;
    }

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

    if (!this.entity.boundary.image || this.isChanged || this.entity.aspect.isChanged) {
        this.entity.boundary.image = this.entity.getBoundaryImage();        
    }
    if (!this.entity.boundary.clip || this.isChanged || this.entity.aspect.isChanged) {
        this.entity.boundary.clip = this.entity.getBoundaryClip();
    }
//console.log('Image.render: clip.x = '+this.entity.boundary.clip.x+', clip.y = '+this.entity.boundary.clip.y);
    context.globalAlpha = this.entity.aspect.alpha;
    context.drawImage(this.element, //image element
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


Image.prototype.getBoundaryImage = function() {
    var pos = {
        x: (this.entity.position.x + this.offsetX ) * (this.entity.aspect.flipX ? -1 : 1) + (this.entity.aspect.flipX ? -this.entity.aspect.width : 0),
        y: (this.entity.position.y + this.offsetY ) * (this.entity.aspect.flipY ? -1 : 1) + (this.entity.aspect.flipY ? -this.entity.aspect.height : 0),
        width: this.entity.aspect.width,
        height: this.entity.aspect.height
    };
    if (this.entity.position.snapToPixel) {
        pos.x = ~~ (0.5 + pos.x);
        pos.y = ~~ (0.5 + pos.y);
    }
    return pos;
};


Image.prototype.getBoundaryClip = function() {
    var clip = {
        x: this.entity.aspect.clipX,
        y: this.entity.aspect.clipY,
        width: this.entity.aspect.clipWidth,
        height: this.entity.aspect.clipHeight
    };
    
    if (!clip.width) clip.width = this.element.width;
    if (!clip.height) clip.height = this.element.height;

    return clip;
};


Image.prototype.destroy = function() {

    this.entityTrigger('destroy');
    return true;
};


yespix.defineClass('image', Image);

/*
    Create an image:
    new yespix.class.image('a.png');
    new yespix.class.image({ image: 'a.png'}); // TODO
    new yespix.class.image({ image: {src: 'a.png', name: 'sky', scale: 1.0 });
    new yespix.class.image().load('a.png');

    Create multiple image:
    new yespix.class.image({ image: {src: ['a.png', 'b.png'], scale: 1.0});
    new yespix.class.image({ image: {src: {sean: 'sean.png', zardoz: 'zardoz.png' }, scale: 1.0 } });

    Set additional properties:
    var object = new yespix.class.image();
    object.set({ image: { scale: 2.0, autoSize: false } });

    Draw image on a context:
    var canvas = myDocument.createElement('canvas');
    var context = canvas.getContext('2d');
    object = new yespix.class.image('a.png');
    object.draw(context);
    
    Draw image on a context with a GfxManager:
    var manager = GfxManager(true);
    manager.add(new yespix.class.image('a.png'));
    manager.draw();
    
    Draw multiple image:
    new yespix.class.image({ image: {src: ['a.png', 'b.png'], scale: 1.0});
    object.select(0).draw(context);
    object.select(1).draw(context);

    new yespix.class.image({ image: [{src: 'a.png', name: 'sky'}, {src: 'b.png', name: 'cloud'}]);
    object.select('sky').draw(context);
    object.select('cloud').draw(context);
*/