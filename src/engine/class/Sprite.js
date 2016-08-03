

function Sprite(properties, entity) {

    properties = properties || {};
    if (entity) {
        this.entity = entity;
        if (!properties.image && entity.image) {
            properties.image = entity.image;
        }
    }

    var varDefault = {
        width: 32,
        height: 32,
        x: 0,
        y: 0,
        maxCols: 0,
        maxLines: 0,
        selectedIndex: 0,
    };

    this.set(properties, varDefault);

    this.isLoading = false;
    this.isReady =  false;
    this.hasError = false;
    this.selected = null;

    if (!this.frames) {
        this.frames = [];
    }
}


Sprite.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.entity.trigger(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Sprite',
            properties: properties
        }
    );
};


Sprite.prototype.frame = function(index) {
    if (this.frames[index]) {
        return this.frames[index];
    }
    return null;
};


Sprite.prototype.select = function(index) {
    this.selectedIndex = index;
    this.selected = this.frame(index);
    this.isChanged = true;
    this.prepare();
    return this;
};


Sprite.prototype.buildFrames = function() {
    if (!this.entity.image.isReady) {
        return false;
    }
    var frames = [],
        maxCols = (this.entity.aspect.width - this.x) / (this.width * this.entity.image.scale),
        maxLines = (this.entity.aspect.height - this.y) / (this.height * this.entity.image.scale),
        line = 0,
        col = 0;

    if (this.maxLines > 0 || this.maxCols > 0) {
        if (this.maxLines > 0 && maxLines > this.maxLines) {
            maxLines = this.maxLines;
        }
        if (this.maxCols > 0 && maxCols > this.maxCols) {
            maxCols = this.maxCols;
        }
    }
    for (line=0; line<maxLines; line++) {
        for (col=0; col<maxCols; col++) {
            frames.push({
                x: this.x * this.entity.image.scale + col * this.width * this.entity.image.scale,
                y: this.y * this.entity.image.scale + line * this.height * this.entity.image.scale,
                width: this.width * this.entity.image.scale,
                height: this.height * this.entity.image.scale,
                offsetX: 0,
                offsetY: 0
            });
        }
    }
    this.frames = frames;
};


Sprite.prototype.completeFrames = function() {
    if (!this.entity.image.isReady) {
        return false;
    }
    var max = this.frames.length;
    for (index=0; index<max; index++) {
        if (yespix.isUndefined(this.frames[index].x)) {
            this.frames[index].x = this.x;
        }
        if (yespix.isUndefined(this.frames[index].y)) {
            this.frames[index].y = this.y;
        }
        if (yespix.isUndefined(this.frames[index].offsetX)) {
            this.frames[index].offsetX = 0;
        }
        if (yespix.isUndefined(this.frames[index].offsetY)) {
            this.frames[index].offsetY = 0;
        }
        if (yespix.isUndefined(this.frames[index].width)) {
            this.frames[index].width = this.width;
        }
        if (yespix.isUndefined(this.frames[index].height)) {
            this.frames[index].height = this.height;
        }
        if (this.entity.image.scale != 1) {
            this.frames[index].x = this.frames[index].x * this.entity.image.scale;
            this.frames[index].y = this.frames[index].y * this.entity.image.scale;
            this.frames[index].width = this.frames[index].width * this.entity.image.scale;
            this.frames[index].height = this.frames[index].height * this.entity.image.scale;
        }
    }
};


Sprite.prototype.load = function() {
    if (!this.entity.image) {
        return false;
    }

    if (!this.entity.image.isReady) {
        this.entity.image.load();
        return false;
    }

    if (!this.frames || this.frames.length == 0) {
        this.buildFrames();
        this.select(this.selectedIndex);
    } else if (this.frames && this.frames.length > 0) {
        this.completeFrames();
        this.select(this.selectedIndex);
    }
    this.isReady = true;

    this.entity.trigger(
        {
            type: 'ready',
            entity: this.entity,
            from: this,
            fromClass: 'Sprite'
        }
    );
    return true;
};


Sprite.prototype.prepare = function() {
    if (!this.selected) {
        return false;
    }

    if (
        this.entity.aspect.width != this.selected.width
        || this.entity.aspect.height != this.selected.height
        || this.entity.aspect.clipX != this.selected.x
        || this.entity.aspect.clipy != this.selected.y
        || this.entity.aspect.clipWidth != this.selected.width
        || this.entity.aspect.clipHeight != this.selected.height
        ) {
        var aspect = {
            width: this.selected.width,
            height: this.selected.height,
            clipX: this.selected.x,
            clipY: this.selected.y,
            clipWidth: this.selected.width,
            clipHeight: this.selected.height
        };
        this.entity.aspect.set(aspect);
    }
    if (this.entity.image.offsetX != this.selected.offsetX
        || this.entity.image.offsetY != this.selected.offsetY
        ) {
        var image = {
            offsetX: this.selected.offsetX,
            offsetY: this.selected.offsetY
        };
        this.entity.image.set(image);
    }
};

/*
Sprite.prototype.trigger = function(event) {
    if (this.entity) return this.entity.trigger(event);
    return true;
};
*/

yespix.defineClass('sprite', Sprite);

