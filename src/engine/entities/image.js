yespix.define('image', 'gfx', {

    /**
     * Flip the gfx horizontally if True
     * @type {Boolean}
     */
    flipX: false,

    /**
     * Flip the gfx vertically if True
     * @type {Boolean}
     */
    flipY: false,

    /**
     * If true, the entity can be drawn
     * @type {Boolean}
     */
    isVisible: true,

    /**
     * List of images
     * @type {Array}
     */
    images: [],

    /**
     * Index of selected image to draw, default 0
     * @type {Number}
     */
    imageSelected: 0,

    /**
     * Default parameters for images
     * @type {Object}
     */
    imageDefaults: {
        isInitiated: false,
        isReady: false,
        src: '',
        element: null,
        document: yespix.document,
    },

    /**
     * Scale of image from 1 to 100 // @todo replace pixelSize
     * @type {Number}
     */
    imageScale: 1.0,


    init: function() {

        yespix.listen(this, ['flipX', 'flipY'], function(obj, e) {
            // @todo use an event
            obj._changed = true;
        });

        var entity = this,
            count = 1;

        if (yespix.isString(this.images)) this.images = [{
            src: this.images
        }];

        for (var t = 0; t < this.images.length; t++) {
            // if the array element is a string, it's the src of the image
            if (yespix.isString(this.images[t])) this.images[t] = {
                src: this.images[t]
            };

            // init the default properties
            for (var n in this.imageDefaults) {
                this.images[t][n] = this.images[t][n] || this.imageDefaults[n];
            }
            if (this.images[t].name === '') this.images[t].name = 'image' + count++;
        }
        this.imageInit();

        this.readyFunctions.push(this.checkReadyStateImage);
        this.on('imageReady', this.checkReadyState);
    },

    checkReadyStateImage: function() {
        for (var t = 0; t < this.images.length; t++) {
            if (!this.images[t].isReady) {
                return false;
            }
        }
        return true;
    },

    resize: function(img, scale) {
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
    },

    image: function(properties) {

        if (yespix.isInt(properties))
        {
            if (this.images[properties]) return this.imageInit(this.images[properties]);
            else return null;
        } else if (properties == undefined)
        {
            if (this.images[0]) return this.imageInit(this.images[0]);
            else return null;
        } else if (typeof properties == 'string') 
        {
            properties = {
                name: properties
            };
        } 

        var max = Object.keys(properties).length;
        var count = 0;
        for (var t = 0; t < this.images.length; t++) {
            for (var n in properties) {
                if (this.images[t][n] !== undefined && properties[n] == this.images[t][n]) count++;
                if (count >= max) return this.imageInit(this.images[t]);
            }
        }
        return null;
    },

    imageInit: function(image) {
        var entity = this;

        // no image, init all the images
        if (image == undefined) {
            for (var t = 0; t < this.images.length; t++) {
                this.imageInit(this.images[t]);
            }
            return true;
        }

        // image already initiated
        if (image.isInitiated) return image;

        // start initialisation
        image.isReady = false;
        image.isInitiated = true;
        image.entity = entity;
        image.element = document.createElement('img');

        if (image.element) image.element.onload = image.element.onLoad = function() {
            image.realWidth = this.width;
            image.realHeight = this.height;
            image.entity.width = this.width;
            image.entity.height = this.height;
            image.isReady = true;

            
            if (entity.imageScale != 1) {
                image.element = entity.resize(image.element, entity.imageScale);
                image.realWidth = this.width * entity.imageScale;
                image.realHeight = this.height * entity.imageScale;
            }
            
            entity.trigger('imageReady', {
                target: image,
            });

            delete this.onload;
        };

        // add source to the image element
        image.changeSource = function(source) {
            this.element.src = source;
            entity.trigger('change');
            return true;
        };

        if (image.src !== undefined && image.src !== '') {
            image.changeSource(image.src);
        }


        return image; //source != '';
    },

    /**
     * Returns true if the entity can be drawn, get this information from basic properties of the entity
     * @return {bool} True if can be drawn
     */
    canDraw: function(context) {
        var img = this.image(this.imageSelected);
        if (!this.isActive 
            || !this.isVisible 
            || this.alpha <= 0
            || !context
            || !img
            || !img.element
            || !img.isReady) 
            return false;

        return true;
    },


    drawRender: function(context) {
        // check if image outside canvas
        if (this._box.x > context.canvas.clientWidth 
            || this._box.y > context.canvas.clientHeight 
            || this._box.x + this._box.width < 0
            || this._box.y + this._box.height < 0)
            return;

        var img = this.image(this.imageSelected);

        this.getContextBox(context, img);

        if (this._box.img.width == 0
            || this._box.img.height == 0)
            return;

        var scaleX = this.flipX ? -1 : 1;
        var scaleY = this.flipY ? -1 : 1;

        if (this.flipX || this.flipY) {
            context.save();
            context.scale(scaleX, scaleY);
        }

        context.globalAlpha = this.alpha;
        
        context.drawImage(img.element, //image element
            this._box.img.x, // x position on image
            this._box.img.y, // y position on image
            this._box.img.width, // width on image
            this._box.img.height, // height on image
            this._box.context.x, // x position on canvas
            this._box.context.y, // y position on canvas
            this._box.context.width, // width on canvas
            this._box.context.height // height on canvas
        );

        if (this.flipX || this.flipY) {
            context.restore();
        }
    },



    drawDebugImage: function(context, drawBox) {
        var box = drawBox || this.getDrawBox();
        context.globalAlpha = 1;
        context.fillStyle = '#999999';
        context.font = "10px sans-serif";
        context.fillText("Image: " + this.imageSelected, box.x, box.y - 5);
    }

});
