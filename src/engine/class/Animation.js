

function Animation(options, entity) {
    
    options = options || {};
    if (entity) this.entity = entity;
    
    var varDefault = {
        defaultAnimation: '',
        defaultSprite: '',
        defaultDuration: '',
        defaultPriority: 0,

        selectedFrame: '',
        selectedAnimation: '',
        selectedSprite: ''
    };

    if (options.sprites) {
        for (var n in options.sprites) {
            options.sprites[n] = new yespix.class.sprite(options.sprites[n]);
            options.sprites[n].manager = this;
        }
    };
    this.set(options, varDefault);
    this.isReady =  false;
    this.nextTime = 0;
}


Animation.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Animation',
            properties: options
        }
    );
};


Animation.prototype.unload = function() {
    this.isReady = false;
    if (this.entity) {
        this.entity.isReady = false;
        this.entity.boundary = {};
    }
};


Animation.prototype.load = function() {
    if (this.isReady) {
        return true;
    }
    for (var n in this.sprites) {
        this.sprites[n].load();
    }
    return this.getSpritesReady();
};


Animation.prototype.event = function(event) {
console.log('Animation.event: event = ', event);  
    if (event.type == 'ready') {
        this.getSpritesReady();
        return true;
    }
    return true;
};


Animation.prototype.getSpritesReady = function() {
    if (this.isReady) {
        return true;
    }
    for (var n in this.sprites) {
        if (!this.sprites[n].isReady) return false;
    }
    this.ready();
    return true;
};


Animation.prototype.ready = function() {
    this.isLoading = false;
    this.isReady = true;

    this.buildAnimations();

    this.entity.isReady = true;

    this.entity.event(
        {
            type: 'ready',
            from: this,
            fromClass: 'Animation',
            entity: this.entity
        }
    );
};


Animation.prototype.buildAnimations = function() {
console.log('Animation:buildAnimations: start');
    for (var n in this.list) {
        if (yespix.isString(this.list[n].extends) && this.list[this.list[n].extends]) {
            this.list[n] = this.extendAnimation(this.list[this.list[n].extends], this.list[n]);
            continue;
        }

        if (yespix.isUndefined(this.list[n].sprite)) {
            this.list[n].sprite = this.defaultSprite;
        }
        if (yespix.isUndefined(this.list[n].duration)) {
                this.list[n].duration = this.defaultDuration;
        }
        if (yespix.isUndefined(this.list[n].priority)) {
            this.list[n].priority = this.defaultPriority;
        }
        if (yespix.isUndefined(this.list[n].flipX)) {
            this.list[n].flipX = false;
        }
        if (yespix.isUndefined(this.list[n].flipY)) {
            this.list[n].flipY = false;
        }
        if (!this.list[n].frames) {
            this.list[n].frames = [];
            continue;
        }

        var len = this.list[n].frames.length;
        for (var i = 0; i<len; i++) {
            if (yespix.isInt(this.list[n].frames[i])) {
                this.list[n].frames[i] = {
                    frame: this.list[n].frames[i],
                    sprite: this.list[n].sprite,
                    duration: this.list[n].duration,
                    priority: this.list[n].priority,
                    flipX: this.list[n].flipX,
                    flipY: this.list[n].flipY
                };
            } else {
                if (yespix.isUndefined(this.list[n].frames[i].sprite)) {
                    this.list[n].frames[i].sprite = this.list[n].sprite;
                }
                if (yespix.isUndefined(this.list[n].frames[i].duration)) {
                    this.list[n].frames[i].duration = this.list[n].duration;
                }
                if (yespix.isUndefined(this.list[n].frames[i].frame)) {
                    this.list[n].frames[i].frame = 0;
                }
                if (yespix.isUndefined(this.list[n].frames[i].priority)) {
                    this.list[n].frames[i].priority = 0;
                }
                if (yespix.isUndefined(this.list[n].frames[i].flipX)) {
                    this.list[n].frames[i].flipX = this.list[n].flipX;
                }
                if (yespix.isUndefined(this.list[n].frames[i].flipY)) {
                    this.list[n].frames[i].flipY = this.list[n].flipY;
                }
            }
        }
    }
    this.play(this.defaultAnimation, 0, true);
};


Animation.prototype.extendAnimation = function(source, dest) {
    var len = source.frames.length;
    dest.frames = new Array(len);
    for (var i = 0; i<len; i++) {
        dest.frames[i] = {};
        yespix.copy(dest, dest.frames[i], source.frames[i]);
    }
    return dest;
};


Animation.prototype.play = function(name, frame, force) {
//console.log('Animation:play: start');
    frame = frame || 0;
    force = force || false;

    if (!this.list[name]) {
//console.log('Animation:play: error');
        return false;
    }

    if (this.selectedAnimation != name || force) {
//console.log('Animation:play: set animation');
        this.selectedAnimation = name;
        this.changeFrame(frame, force);
        return true;
    }
    return false;
};


Animation.prototype.changeFrame = function(frame, force) {
//console.log('Animation.changeFrame: start');
    frame = frame || 0;
    force = force || false;

    if (!this.list[this.selectedAnimation] || !this.list[this.selectedAnimation].frames[frame]) {
//console.log('Animation.changeFrame: error');
        return false;
    }

    if (this.selectedFrame != frame || force) {
        this.selectedFrame = frame;
        this.selectedSprite = this.list[this.selectedAnimation].frames[frame].sprite;
        this.nextTime = yespix.getTime() + this.list[this.selectedAnimation].frames[frame].duration;

        // select 
        this.entity.boundary = {};
        this.sprites[this.selectedSprite].sprite.select(this.list[this.selectedAnimation].frames[frame].frame);
        this.entity.image = this.sprites[this.selectedSprite].image;
        this.sprites[this.selectedSprite].set({
            aspect: 
            {
                flipX: this.list[this.selectedAnimation].frames[frame].flipX,
                flipY: this.list[this.selectedAnimation].frames[frame].flipY
            }
        });
        return true;
    }
    return false;
};


Animation.prototype.checkFrame = function() {
    if (this.nextTime <= yespix.getTime()) {
        this.nextFrame();
        return true;
    }
    return false;
};


Animation.prototype.nextFrame = function() {
//console.log('Animation:nextFrame: start');
    if (!this.list[this.selectedAnimation]) {
//console.log('Animation:nextFrame: error');
        return false;
    }
    var nextFrame = this.selectedFrame + 1;
    if (!this.list[this.selectedAnimation].frames[nextFrame]) {
        nextFrame = 0;
    }
//console.log('Animation:nextFrame: nextFrame = '+nextFrame);
    if (nextFrame != this.selectedFrame) {
//console.log('Animation:nextFrame: set selectedFrame');
        this.changeFrame(nextFrame);
    }
    return true;
};


