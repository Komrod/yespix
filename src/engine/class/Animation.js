

function Animation(options, entity) {
    
    options = options || {};
    if (entity) this.entity = entity;
    
    var varDefault = {
        defaultAnimation: '',
        defaultSprite: '',
        defaultDuration: '',

        selectedFrame: '',
        selectedAnimation: ''
    };

    if (options.sprites) {
        for (var n in options.sprites) {
            options.sprites[n] = new yespix.class.sprite(options.sprites[n]);
            options.sprites[n].manager = this;
        }
    };
    this.set(options, varDefault);

    this.isReady =  false;
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

    if (!this.buildAnimations()) {
        return false;
    }

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


Animation.prototype.warning = function(message) {
    this.entity.event(
        {
            type: 'warning',
            from: this,
            fromClass: 'Animation',
            entity: this.entity,
            message: message
        }
    );
};


Animation.prototype.buildAnimations = function() {
console.log('Animation:buildAnimations: start');    
    for (var n in this.list) {
        if (yespix.isUndefined(this.list[n].sprite)) {
            this.list[n].sprite = this.defaultSprite;
        }
        if (yespix.isUndefined(this.list[n].duration)) {
            this.list[n].duration = this.defaultDuration;
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
                    priority: 0
                }
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
            }
        }
    }
    this.play(this.defaultAnimation);
};



Animation.prototype.play = function(name, frame) {
    frame = frame | 0;
    if (!this.list[name] || !this.list[name].frame[frame]) {
        return false;
    }

    this.selectedAnimation = name;
    this.selectedFrame = frame;
    this.selectedSprite = this.list[name].frame[frame].sprite;
    this.nextTime = yespix.getTime() + this.list[name].frame[frame].duration;

    // select 
    this.entity.boundary = {};
    this.entity.image = this.sprites[this.selectedSprite].image;
};
