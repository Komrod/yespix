yespix.define('image', 'gfx', {
    isVisible: true,

    // images
    images: [],

    imageSelected: 0,

    imageDefaults: {
        isInitiated: false, // true if imageInit() was called
        isReady: false,
        src: '',
        element: null,
        document: yespix.document,
    },

    init: function() {
        var entity = this,
            count = 1;

        if (!this.pixelSize) this.pixelSize = 1;

        if (yespix.isString(this.images)) this.images = [{
            src: this.images
        }];

        for (var t = 0; t < this.images.length; t++) {
            // if the array element is a string, it's the src of the image
            if (yespix.isString(this.images[t])) this.images[t] = {
                src: this.images[t],
            };

            // init the default properties
            for (var n in this.imageDefaults) {
                this.images[t][n] = this.images[t][n] || this.imageDefaults[n];
            }
            if (this.images[t].name === '') this.images[t].name = 'image' + count++;
        }

        this.imageInit();
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

        if (properties == undefined)
            if (this.images[0]) return this.imageInit(this.images[0]);
            else return null;
        if (typeof properties == 'string') properties = {
            name: properties
        };
        else if (yespix.isInt(properties))
            if (this.images[properties]) return this.imageInit(this.images[properties]);
            else return null;

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

        image.isReady = false;
        image.isInitiated = true;
        image.entity = entity;
        image.element = document.createElement('img');

        if (image.element) image.element.onload = image.element.onLoad = function() {
            image.realWidth = this.width;
            image.realHeight = this.height;
            image.isReady = true;

            if (!yespix.isUndefined(entity.pixelSize) && entity.pixelSize != 1) {
                image.element = entity.resize(image.element, entity.pixelSize);
                image.realWidth = this.width * entity.pixelSize;
                image.realHeight = this.height * entity.pixelSize;
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

    draw: function(context) {
        if (!this.isVisible) return;

        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }

        var img = this.image(this.imageSelected);
        var box = this.getDrawBox();
        var scaleX = this.flipX ? -1 : 1;
        var scaleY = this.flipY ? -1 : 1;

        if (context && img && img.element && img.isReady) {
            context.globalAlpha = this.alpha;
            context.drawImage(img.element, //image element
                0, // x position on image
                0, // y position on image
                img.realWidth, // width on image
                img.realHeight, // height on image
                box.x, // x position on canvas
                box.y, // y position on canvas
                box.width, // width on canvas
                box.height // height on canvas
            );
            if (this.debug) {
                this.drawDebug(context, box);
            }
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
