

function Sprite(options, entity) {

    options = options || {};
    if (entity) {
        this.entity = entity;
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

    this.set(options, varDefault);

    this.isLoading = false;
    this.isReady =  false;
    this.hasError = false;
    this.selected = null;

    if (!this.frames) {
        this.frames = [];
    }
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
    this.selectedIndex = index;
    this.selected = this.frame(index);
    this.isChanged = true;
    this.prepare();
    return null;
};


Sprite.prototype.buildFrames = function() {
//console.log('buildFrames: start');
    if (!this.entity.image.isReady) {
        return false;
    }
//console.log('buildFrames: entity = ', this.entity);
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
//console.log('maxLines = '+maxLines+', maxCols = '+maxCols);
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


Sprite.prototype.load = function() {
//console.log('Sprite:load: start');
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
    return true;
};


Sprite.prototype.prepare = function() {
    if (!this.selected) return false;
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
};


Sprite.prototype.event = function(event) {
    if (this.entity) return this.entity.event(event);
    return true;
};

