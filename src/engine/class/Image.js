

function Image(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
        isLoading: false,
        isReady: false,
        autoLoad: false,
        src: '',
        scale: 1.0, // original loading scale of the image
        element: null, // img element
        changeSize: true, // change the size of the entity.aspect each time an image is loaded
    };

    this.set(options, varDefault);
    this.element = null;
    
    if (this.autoLoad) {
        this.load();
    }
}


Image.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);
    this.isChanged = true;
    if (options.scale != 1) {
        if (this.isReady) {
            this.load(this.element.source);
        }
    }
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'image',
            properties: options
        }
    );
};


Image.prototype.select = function(index) {
    if (this.src && this.src[index]) {
        this.load(this.src[index]);
        return this;
    }
    return null;
};


// Takes an image and a scaling factor and returns the scaled image
// The original image is drawn into an offscreen canvas of the same size
// and copied, pixel by pixel into another offscreen canvas with the 
// new size.
Image.prototype.resize = function(img, scale) {
    if (!scale) return img;
    
    var widthScaled = img.width * scale;
    var heightScaled = img.height * scale;

    var orig = document.createElement('canvas');
    orig.width = img.width;
    orig.height = img.height;
    var origCtx = orig.getContext('2d');
    origCtx.drawImage(img, 0, 0);
    var origPixels = origCtx.getImageData(0, 0, img.width, img.height);

    var scaled = document.createElement('canvas');
    scaled.width = widthScaled;
    scaled.height = heightScaled;
    var scaledCtx = scaled.getContext('2d');
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
            this.ready();
        }
        return true;
    }
    var img = yespix.getCache('img:'+src+':1');
    this.element = this.resize(img, this.scale);
    this.linkElement('add');
    this.element.isReady = true;
    this.ready();
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


Image.prototype.load = function(src) {
    var name = '';

    if (!src) {
        if (yespix.isArray(this.src)) {
            return this.load(this.src[0]);
        } else if (yespix.isObject(this.src)) {
            for (var n in this.src) {
                return this.load(this.src[n]);
                break;
            }
        } else {
            return this.load(this.src);
        }
        return false;
    }
    
    // get cache at current scale
    this.linkElement('remove');
    this.element = yespix.getCache('img:'+src+':'+this.scale);
    if (this.element) {
        this.linkElement('add');
        if (this.element.isReady) {
            this.ready();
        }
        return true;
    }

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

    // load image at scale 1
    this.element = document.createElement('img');
    this.element.entities = new Array();
    this.element.entities.push(this.entity);
    this.element.source = src;
    this.element.src = src;
    yespix.setCache('img:'+src+':1', this.element);

    // set the onload event for image element
    this.element.onload = function(e) {
        this.isLoading = false;
        this.isReady = true;
        this.isChanged = false;

        var len = this.entities.length;
        for (var t=len-1; t>=0; t--) {
            this.entities[t].image.initScale();
        }

        var len = this.entities.length;
        for (var t=0; t<len; t++) {
            this.entities[t].image.ready();
        }
    };

    this.element.isLoading = true;
    this.element.isReady = false;
    this.isLoading = true;
    this.isReady = false;
    this.entity.isReady = false;
};


Image.prototype.ready = function(entity) {
    this.isLoading = false;
    this.isReady = true;
    if (this.entity.image == this) {
        this.entity.isReady = true;
    }
    this.element.isLoading = false;
    this.element.isReady = true;

    if (this.entity.aspect) {
        if (this.changeSize || this.entity.aspect.width == 0) {
            this.entity.aspect.width = this.element.width;
        }
        if (this.changeSize || this.entity.aspect.height == 0) {
            this.entity.aspect.height = this.element.height;
        }
    }
    this.entity.event(
        {
            type: 'ready',
            from: this,
            fromClass: 'image',
            entity: this.entity
        }
    );
};


Image.prototype.draw = function(context) {
    if (!this.isReady) {
        if (!this.isLoading) {
console.log('not ready and not loading');
            this.load();
        }
        return false;
    }

    var contextSaved = false;
    if (this.entity.aspect.flipX || this.entity.aspect.flipY) {
        contextSaved = true;
        context.save();
        context.scale( (this.entity.aspect.flipX ? -1 : 1), (this.entity.aspect.flipY ? -1 : 1) );
    }

    if (!this.entity.boundary.image || this.isChanged || this.entity.aspect.isChanged) {
        this.entity.boundary.image = this.getBoundaryImage();
    }

    context.globalAlpha = this.entity.aspect.alpha;
    context.drawImage(this.element, //image element
        0, // x position on image
        0, // y position on image
        this.element.width, // width on image
        this.element.height, // height on image
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
        x: this.entity.position.x * (this.entity.aspect.flipX ? -1 : 1) + (this.entity.aspect.flipX ? -this.entity.aspect.width : 0),
        y: this.entity.position.y * (this.entity.aspect.flipY ? -1 : 1) + (this.entity.aspect.flipY ? -this.entity.aspect.height : 0),
        width: this.entity.aspect.width,
        height: this.entity.aspect.height
    };
    if (this.entity.position.snapToPixel) {
        pos.x = ~~ (0.5 + pos.x);
        pos.y = ~~ (0.5 + pos.y);
    }
    return pos;
};


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
    object.set({ image: { scale: 2.0, changeSize: false } });

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