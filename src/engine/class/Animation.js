

/**
 * Animation class
 * Controls the animation of sprites
 * @events  create ready notReady load unload change destroy
 * @parent  entity
 */


function Animation(properties, entity) {
    properties = properties || {};
    if (entity) this.entity = entity;
    
    var varDefault = {
        defaultAnimation: '',
        defaultSprite: '',
        defaultDuration: 100,
        defaultPriority: 0,

        selectedFrame: '',
        selectedAnimation: '',
        selectedSprite: '',

        autoLoad: true
    };

    if (properties.sprites) {
        for (var n in properties.sprites) {
            properties.sprites[n] = new yespix.class.sprite(properties.sprites[n], entity);
            properties.sprites[n].manager = this;
            properties.sprites[n].position = this.entity.position;
            properties.sprites[n].aspect = this.entity.aspect;
        }
    };

    this.set(properties, varDefault);
    this.isReady =  false;
    this.nextTime = 0;
    this.time = 0;

    this.entityTrigger('create');

    if (this.autoLoad) {
        this.load();
    }
};


Animation.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entityTrigger('change', properties);
};


Animation.prototype.unload = function() {
    if (this.entity) {
        this.entity.boundary = {};
    }

    // @TODO

    this.entityTrigger('unload', properties);
    this.ready(false);
};


Animation.prototype.load = function() {
    if (this.isReady) {
        return true;
    }
    for (var n in this.sprites) {
        this.sprites[n].load();
    }
    this.entityTrigger('load');

    return this.getSpritesReady();
};


Animation.prototype.trigger = function(event) {
    if (event.from == this) return false;

    if (event.type == 'ready' && event.fromClass == 'Image') {
        this.getSpritesReady();
        return true;
    }
    return true;
};


Animation.prototype.entityTrigger = function(type, properties) {
    if (this.entity) {
        properties = properties || {};
        this.entity.trigger(
            {
                type: type,
                entity: this.entity,
                from: this,
                fromClass: 'Animation',
                properties: properties
            }
        );
    }
};    


Animation.prototype.getSpritesReady = function() {
    if (this.isReady) {
        return true;
    }
    for (var n in this.sprites) {
        this.sprites[n].load();
        if (!this.sprites[n].isReady) return false;
    }
    this.ready(true);
    return true;
};


Animation.prototype.ready = function(bool) {
    if (bool) {
        this.isLoading = false;
        this.isReady = true;

        this.buildAnimations();

        this.entityTrigger('ready');
    } else {
        this.isReady = false;
        this.entityTrigger('notReady');
    }
};


Animation.prototype.buildAnimations = function() {
    for (var n in this.list) {
        if (this.defaultAnimation == '') {
            this.defaultAnimation = n;
        }

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
        }

        var len = this.list[n].frames.length;

        if (len == 0 && this.list[n].length > 0) {
            if (!yespix.isUndefined(this.list[n].from)) {
                this.list[n].frames.push(this.list[n].from);
            } else {
                this.list[n].frames.push(0);
            }
            if (this.list[n].length > 1) {
                for (var i = 1; i<this.list[n].length; i++) {
                    this.list[n].frames.push(this.list[n].frames[0]+i);
                }
            }
            len = this.list[n].frames.length;
        }

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
    frame = frame || 0;
    force = force || false;

    if (!this.list[name]) {
        return false;
    }

    if (this.selectedAnimation != name || force) {
        this.selectedAnimation = name;
        this.changeFrame(frame, force);
        return true;
    }
    return false;
};


Animation.prototype.changeFrame = function(frame, force) {
    frame = frame || 0;
    force = force || false;

    if (!this.list[this.selectedAnimation] || !this.list[this.selectedAnimation].frames[frame]) {
        return false;
    }

    if (this.selectedFrame != frame || force) {
        this.selectedFrame = frame;
        this.selectedSprite = this.list[this.selectedAnimation].frames[frame].sprite;
        this.nextTime = this.time + this.list[this.selectedAnimation].frames[frame].duration;

        // select 
        this.entity.boundary = {};
        this.sprites[this.selectedSprite].select(this.list[this.selectedAnimation].frames[frame].frame);
        this.entity.image = this.sprites[this.selectedSprite].image;
        this.entity.aspect.flipX = this.list[this.selectedAnimation].frames[frame].flipX;
        this.entity.aspect.flipY = this.list[this.selectedAnimation].frames[frame].flipY;
        return true;
    }
    return false;
};


Animation.prototype.step = function(time) {
    this.time += time;
};


Animation.prototype.checkFrame = function() {
    if (this.nextTime <= this.time) {
        this.nextFrame();
        return true;
    }
    return false;
};


Animation.prototype.nextFrame = function() {
    // animation is not ready
    if (!this.isReady || !this.list) {
        return false;
    }

    // animation does not exist
    if (!this.list[this.selectedAnimation]) {
        return false;
    }

    var nextFrame = this.selectedFrame + 1;
    if (!this.list[this.selectedAnimation].frames[nextFrame]) {
        nextFrame = 0;
    }
    if (nextFrame != this.selectedFrame) {
        this.changeFrame(nextFrame);
    }
    return true;
};


Animation.prototype.destroy = function() {
    this.entity = null;
    for (var t = 0; t < this.list.length; t++) {
        this.list[t] = null;
    }
    for (var t = 0; t < this.sprites.length; t++) {
        this.sprites[t] = null;
    }


    this.entityTrigger('destroy');
    return true;
};


yespix.defineClass('animation', Animation);

