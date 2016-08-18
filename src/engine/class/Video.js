

function Video(properties, entity) {

    properties = properties || {};
    if (entity) this.entity = entity;
    if (yespix.isString(properties)) {
        properties = {src: properties};
    }

    var varDefault = {
        autoLoad: true,
        autoPlay: false,
        autoSize: true,
        loop: false,
        src: '',
    };

    this.set(properties, varDefault);

    this.isLoading =  false;
    this.isReady = false;
    this.hasError = false;
    this.element = null;

    if (this.autoPlay || this.autoLoad) {
        this.load();
    }
}


Video.prototype.trigger = function(event) {
    if (event.from == this) return false;
};


Video.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entity.trigger(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Video',
            properties: properties
        }
    );
};


Video.prototype.unload = function() {
    this.src = '';
    if (this.element) {
        this.element.entity = null;
    }
    this.element = null;
    this.isLoading = false;
    this.isReady = false;
    this.hasError = false;
    if (this.entity) {
        this.entity.isReady = false;
        this.entity.boundary = {};
    }
};


Video.prototype.load = function(src) {
    if (!src &&  (this.isLoading || this.isReady)) {
        return false;
    }
    src = src || this.src;
    if (!src) return false;
    this.src = src;

    this.isLoading = true;
    this.isReady = false;
    this.hasError = false;

    var element = document.createElement("video");
    element.source = src;
    element.loop = this.loop;
    element.autoplay = this.autoPlay;

    element.oncanplay = function() {
        this.entity.video.ready();
    };
    element.onerror = function() { 
        this.entity.video.error();
    };

    element.src = src;
    element.load();

    element.isReady = false;
    element.isLoading = true;
    element.hasError = false;
    element.entity = this.entity;
    this.element = element;

};


Video.prototype.ready = function() {

    this.isLoading = false;
    this.isReady = true;
    this.hasError = false;
    if (this.entity) {
        this.entity.isReady = true;
    }
    this.element.isLoading = false;
    this.element.isReady = false;
    this.element.hasError = true;

    if (this.entity.aspect) {
        if (this.autoSize || this.entity.aspect.width == 0) {
            this.entity.aspect.width = this.element.videoWidth;
        }
        if (this.autoSize || this.entity.aspect.height == 0) {
            this.entity.aspect.height = this.element.videoHeight;
        }
    }
    this.entity.trigger(
        {
            type: 'ready',
            from: this,
            fromClass: 'Video',
            entity: this.entity
        }
    );
    if (this.autoPlay) {
        this.autoPlay = false;
        this.play();
    }
};

Video.prototype.error = function() {
    this.isLoading = false;
    this.isReady = false;
    this.hasError = true;

    if (this.entity.video == this) {
        this.entity.isReady = false;
    }

    this.element.isLoading = false;
    this.element.isReady = false;
    this.element.hasError = true;

    this.entity.trigger(
        {
            type: 'error',
            from: this,
            fromClass: 'Video',
            entity: this.entity
        }
    );
};



Video.prototype.play = function() {
    if (!this.element) return false;
    this.element.play();
    return true;
};

Video.prototype.isPlaying = function() {
    if (!this.element) return false;
    return !this.element.paused;
};

Video.prototype.pause = function() {
    if (!this.element) return false;
    var time = this.elements[this.selected].currentTime;
//    this.elements[this.selected].pause();
    this.element.pause();
    this.element.currentTime = 0;
    this.element.pause();
    this.element.currentTime = time;
    return true;
};

Video.prototype.isPaused = function() {
    if (!this.element) return false;
    return !!this.element.paused;
};

Video.prototype.mute = function(b) {
    if (!this.element) return false;
    this.element.muted = b;
    return this;
};

Video.prototype.isMuted = function() {
    if (!this.element) return false;
    return this.element.muted;
};

Video.prototype.stop = function() {
    if (!this.element) return false;
    this.element.pause();
    this.element.currentTime = 0;
    return this;
};

Video.prototype.setVolume = function(n) {
    if (!this.element) return false;
    this.element.volume = this.volume;
    return true;
};

Video.prototype.setTime = function(time) {
    if (!this.element) return false;
    this.elements[this.selected].currentTime = time;
    return true;
};

Video.prototype.hasEnded = function() {
    if (!this.element) return false;
    return this.element.ended;
};



Video.prototype.draw = function(context) {
    if (!this.isReady) {
        return false;
    }

    var contextSaved = false;
    if (this.entity.aspect.flipX || this.entity.aspect.flipY) {
        contextSaved = true;
        context.save();
        context.scale( (this.entity.aspect.flipX ? -1 : 1), (this.entity.aspect.flipY ? -1 : 1) );
    }

    if (!this.entity.boundary.image || this.isChanged || this.entity.aspect.isChanged) {
        this.entity.boundary.image = this.getBoundaryImage();
    }
    if (!this.entity.boundary.clip || this.isChanged || this.entity.aspect.isChanged) {
        this.entity.boundary.clip = this.getBoundaryClip();
    }

    context.globalAlpha = this.entity.aspect.alpha;
    context.drawImage(this.element, //image element
        this.entity.boundary.clip.x, // x position on image
        this.entity.boundary.clip.y, // y position on image
        this.entity.boundary.clip.width, // width on image
        this.entity.boundary.clip.height, // height on image
        this.entity.boundary.image.x, // x position on canvas
        this.entity.boundary.image.y, // y position on canvas
        this.entity.boundary.image.width, // width on canvas
        this.entity.boundary.image.height // height on canvas
    );
    if (contextSaved) {
        context.restore();
    }
};


Video.prototype.getBoundaryImage = function() {
    var pos = {
        x: this.entity.position.x * (this.entity.aspect.flipX ? -1 : 1) + (this.entity.aspect.flipX ? -this.entity.aspect.width : 0),
        y: this.entity.position.y * (this.entity.aspect.flipY ? -1 : 1) + (this.entity.aspect.flipY ? -this.entity.aspect.height : 0),
        width: this.entity.aspect.width,
        height: this.entity.aspect.height
    };
    if (this.entity.position.snapToPixel) {
        pos.x = ~~ (0.5 + pos.x);
        pos.y = ~~ (0.5 + pos.y);
    }
    return pos;
};


Video.prototype.getBoundaryClip = function() {
    var clip = {
        x: this.entity.aspect.clipX,
        y: this.entity.aspect.clipY,
        width: this.entity.aspect.clipWidth,
        height: this.entity.aspect.clipHeight
    };
    if (!clip.width) clip.width = this.element.videoWidth;
    if (!clip.height) clip.height = this.element.videoHeight;
    return clip;
};


yespix.defineClass('video', Video);

