

function Sprite(options, entity) {
    options = options || {};
    if (entity) this.entity = entity;
    if (yespix.isString(options) || yespix.isArray(options)) {
        options = {src: options};
    }
    var varDefault = {
        isReady: false,
        width: 32,
        height: 32,
        left: 0,
        top: 0,
        maxCols: 0,
        maxLines: 0,
    };

    this.set(options, varDefault);
    this.frames = [];
    this.selected = null;
    this.selectedIndex = 0;
    this.selectedNext = 0;
}


Sprite.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Sprite',
            properties: options
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
    if (!this.frames[index]) {
        this.selectedNext = index;
        return false;
    }
    this.selected = this.frame(index);
    this.selectedIndex = index;
};


Sprite.prototype.buildFrames = function() {
    if (!this.entity.image.isReady) {
        return false;
    }
console.log('buildFrames: entity = ', this.entity);
    var frames = [],
        maxCols = (this.entity.aspect.width - this.left) / this.width,
        maxLines = (this.entity.aspect.height - this.top) / this.height,
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
console.log('maxLines = '+maxLines+', maxCols = '+maxCols);
    for (line=0; line<maxLines; line++) {
        for (col=0; col<maxCols; col++) {
            frames.push({
                x: this.left + col * this.width,
                y: this.top + line * this.height,
                width: this.width,
                height: this.height,
                offsetX: 0,
                offsetY: 0
            });
        }
    }
    this.frames = this.frames.concat(frames);
};


Sprite.prototype.load = function() {
    if (!this.entity.image.isReady) return false;
    if (this.frames.length == 0) {
        this.buildFrames();
        this.select(this.selectedNext);
    }
    this.isReady = true;

    this.entity.event(
            {
                type: 'ready',
                entity: this.entity,
                from: this,
                fromClass: 'Sprite'
            }
        );
};


Sprite.prototype.prepare = function() {
    if (this.entity.aspect.width != this.selected.width 
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
};

