

function Image(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
        flipX: false,
        flipY: false,

        isLoading: false,
        isReady: false,
        src: '',

        scale: 1.0, // original loading scale of the image
        element: null, // img element
        changeSize: true // change the size of the entity each time an image is used / changed
    };

    this.set(options, this, varDefault);

    this.load(this.src);
}


Image.prototype.set = function(options, varDefault) {

    yespix.copy(options, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'path',
            properties: options
        }
    );
};


Image.prototype.resize = function(img, scale) {
    // Takes an image and a scaling factor and returns the scaled image
    // The original image is drawn into an offscreen canvas of the same size
    // and copied, pixel by pixel into another offscreen canvas with the 
    // new size.

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


Image.prototype.load = function(src) {
console.log('Image::load : start');
    if (!src) {
console.log('Image::load : no src');
        return true;
    }

console.log('Image::load : src = '+this.src);
console.log('Image::load : this = ', this);
    this.element = yespix.getCache('img:'+src+':1');
    if (this.element) return true;

    this.element = document.createElement('img');
    yespix.setCache('img:'+this.src+':1', this.element);

    var image = this;

    // set the onload event for image element
    this.element.onload = function(e) {
        image.entity.isLoading = image.isLoading = false;
        image.entity.isReady = image.isReady = true;
        if (image.entity.aspect) {
            image.entity.aspect.width = this.width;
            image.entity.aspect.height = this.height;
        }
        image.entity.event(
            {
                type: 'ready',
                from: this,
                fromClass: 'image',
                entity: image.entity
            }
        );
    };

    this.entity.isLoading = image.isLoading = true;
    this.entity.isReady = image.isReady = false;

    this.element.src = this.src;
};



Image.prototype.draw = function(context) {
    if (!this.isReady) {
console.log('Not ready: src "' + this.src + '"');
        return false;
    }

console.log('Image:draw : this = ', this);
    if (this.flipX || this.flipY) {
        context.save();
        context.scale( (this.flipX ? -1 : 1), (this.flipY ? -1 : 1) );
    }

    context.globalAlpha = this.alpha;
    context.drawImage(this.element, //image element
        0, // x position on image
        0, // y position on image
        this.entity.aspect.width, // width on image
        this.entity.aspect.height, // height on image
        this.entity.position.x, // x position on canvas
        this.entity.position.y, // y position on canvas
        this.entity.aspect.width, // width on canvas
        this.entity.aspect.height // height on canvas
    );

    if (this.flipX || this.flipY) {
        context.restore();
    }
};

