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
        var max = Math.floor(image.realWidth / this.level.levelData.tilewidth);
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

    draw: function(context) {
        if (!this.isVisible) return;

        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }
        if (context && this.canvas) {
            context.globalAlpha = this.alpha * this.level.alpha;
            var box = this.getDrawBox();
            if (this.layerData.properties.type == 'parallax') {
                if (this.layerData.properties.speedX) box.x = box.x * this.layerData.properties.speedX;
                if (this.layerData.properties.speedY) box.y = box.y * this.layerData.properties.speedY;
            }

            if (this.level.snapToPixel) {
                box.x = parseInt(box.x);
                box.y = parseInt(box.y);
            }


            // check if image outside canvas
            if (box.x > context.canvas.clientWidth 
                || box.y > context.canvas.clientHeight 
                || box.x + box.width < 0
                || box.y + box.height < 0)
                return;
                
            var contextDrawBox = this.getContextDrawBox(context, 
                {realWidth: this.canvas.width, realHeight: this.canvas.height}, 
                box);

            context.drawImage(this.canvas, //image element
                contextDrawBox.img_x, // x position on image
                contextDrawBox.img_y, // y position on image
                contextDrawBox.img_width, // width on image
                contextDrawBox.img_height, // height on image
                contextDrawBox.context_x, // x position on canvas
                contextDrawBox.context_y, // y position on canvas
                contextDrawBox.context_width, // width on canvas
                contextDrawBox.context_height // height on canvas
            );
        }
    },
});
