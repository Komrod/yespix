yespix.define('layer', 'gfx', {

    isVisible: true,

    isReady: false,

    canvas: null,
    drawContext: null,

    layerData: null,

    level: null,

    create: function() {

    },

    setLevel: function(level) {
        this.level = level;
    },

    load: function(layerData) {
        this.layerData = layerData;
        this.update();
    },

    update: function() {
        if (!this.layerData) return false;

        this.canvas = document.createElement('canvas');
        this.drawContext = this.canvas.getContext('2d');

        this.width = this.layerData.width * this.layerData.tilewidth;
        this.height = this.layerData.height * this.layerData.tilewidth;
        if (this.layerData.properties.z) this.z = this.layerData.properties.z;
        if (this.layerData.opacity) this.alpha = this.layerData.opacity;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    },

    drawTile: function(spriteIndex, cellX, cellY) {
        var image, imageIndex;

        for (var t = 0; t < this.level.tilesets.images.length; t++) {
            if (!this.level.tilesets.images[t].isReady) {
                console.error('layer::drawTile :: image [' + t + '] of the tileset is not ready');
                return false;
            }
        }

        image = this.level.tilesets.getSpriteImage(spriteIndex);

        if (!image) {
            console.error('layer::drawTile :: no image found for spriteIndex ' + spriteIndex);
            return false;
        }

        if (!image.isReady) {
            console.error('layer::drawTile :: image of the tileset is not ready');
            return false;
        }

        spriteIndex = this.level.tilesets.getSpriteImageIndex(spriteIndex);
        var max = Math.floor(image.originalWidth / this.level.levelData.tilewidth);
        var line = Math.floor(spriteIndex / max);
        var col = spriteIndex - (line * max);
        this.drawContext.drawImage(image.element, //image element
            col * this.layerData.tilewidth, // x position on image
            line * this.layerData.tilewidth, // y position on image
            this.layerData.tilewidth, // width on image
            this.layerData.tilewidth, // height on image
            cellX * this.layerData.tilewidth, // x position on canvas
            cellY * this.layerData.tilewidth, // y position on canvas
            this.layerData.tilewidth, // width on canvas
            this.layerData.tilewidth // height on canvas
        );
    },

    clear: function() {
        if (this.canvas) this.canvas.width = this.canvas.width;
    },


    make: function() {
        this.clear();
        if (!this.layerData || !this.level) return;

        var index = 0;

        for (var y = 0; y < this.layerData.height; y++) {
            for (var x = 0; x < this.layerData.width; x++) {
                if (this.layerData && this.layerData.data) {
                    var spriteIndex = this.layerData.data[index] - 1;
                    if (spriteIndex >= 0) {
                        this.drawTile(spriteIndex, x, y);
                    }
                }
                index++;
            }
        }
        this.ready();
    },

    /**
     * Returns true if the entity can be drawn, get this information from basic properties of the entity
     * @return {bool} True if can be drawn
     */
    canDraw: function(context) {
        if (!this.isActive 
            || !this.isVisible 
            || this.alpha <= 0
            || !this.canvas
            || !context
            || !this.drawContext
            || !this.isReady) 
            return false;

        return true;
    },

    /**
     * Get the position absolute or relative to the parent entity
     * @param  {bool} absolute If true, just get entity x and y. If false, get the position relative to the parent
     * @return {object} Result {x, y}
     */
    getPosition: function(absolute) {
        var x = this.x, y = this.y;

        if (this.snapToPixel) {
            x = parseInt(x);
            y = parseInt(y);
        }

        if (this.layerData.properties.type == 'parallax') {
            if (this.layerData.properties.speedX) x = x * this.layerData.properties.speedX;
            if (this.layerData.properties.speedY) y = y * this.layerData.properties.speedY;
        }

        if (absolute || !this._parent) {
            return {
                x: x,
                y: y
            };
        } else {
            var position = this._parent.getPosition();
            if (position) return {
                x: x + position.x,
                y: y + position.y
            };
        }
        return {
            x: x,
            y: y
        };
    },


    drawRender: function(context) {

        // check if image outside canvas
        if (this._box.x > context.canvas.clientWidth 
            || this._box.y > context.canvas.clientHeight 
            || this._box.x + this._box.width < 0
            || this._box.y + this._box.height < 0)
            return;

        context.globalAlpha = this.alpha * this.level.alpha;

        this.getContextBox(context, this.drawContext);

        context.drawImage(this.canvas, //image element
            this._box.img.x, // x position on image
            this._box.img.y, // y position on image
            this._box.img.width, // width on image
            this._box.img.height, // height on image
            this._box.context.x, // x position on canvas
            this._box.context.y, // y position on canvas
            this._box.context.width * this.pixelSize, // width on canvas
            this._box.context.height * this.pixelSize // height on canvas
        );
    },
});
