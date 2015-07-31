

function Sound(properties, entity) {

    properties = properties || {};
    if (entity) this.entity = entity;
    if (yespix.isString(properties)) {
        properties = {src: properties};
    }

    var varDefault = {
        autoLoad: true,
        autoPlay: false,
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


// new yespix.class.sound('');
// new yespix.class.sound({ sound: '');
// new yespix.class.sound({ sound: { src: '', autoPlay: true});
// entity.sound.play();

Sound.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Sound',
            properties: properties
        }
    );
};


Sound.prototype.unload = function() {
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


Sound.prototype.load = function(src) {
    if (!src && (this.isLoading || this.isReady)) {
        return false;
    }
    src = src || this.src;
    if (!src) return false;
    this.src = src;

    this.isLoading = true;
    this.isReady = false;
    this.hasError = false;

    var element = document.createElement("audio");
    element.source = src;
    element.loop = this.loop;
    element.autoplay = this.autoPlay;

    element.oncanplay = function() {
        this.entity.sound.ready();
    };
    element.onerror = function() { 
        this.entity.sound.error();
    };

    element.src = src;
    element.load();

    element.isReady = false;
    element.isLoading = true;
    element.hasError = false;
    element.entity = this.entity;
    this.element = element;

};


Sound.prototype.ready = function() {
    this.isLoading = false;
    this.isReady = true;
    this.hasError = false;

    if (this.entity.sound == this) {
        this.entity.isReady = true;
    }
    this.element.isLoading = false;
    this.element.isReady = false;
    this.element.hasError = true;

    this.entity.event(
        {
            type: 'ready',
            from: this,
            fromClass: 'Sound',
            entity: this.entity
        }
    );
    if (this.autoPlay) {
        this.autoPlay = false;
        this.play();
    }
};

Sound.prototype.error = function() {
    this.isLoading = false;
    this.isReady = false;
    this.hasError = true;

    if (this.entity.sound == this) {
        this.entity.isReady = false;
    }

    this.element.isLoading = false;
    this.element.isReady = false;
    this.element.hasError = true;

    this.entity.event(
        {
            type: 'error',
            from: this,
            fromClass: 'Sound',
            entity: this.entity
        }
    );
};


Sound.prototype.play = function() {
    if (!this.element) return false;
    this.element.play();
    return true;
};

Sound.prototype.isPlaying = function() {
    if (!this.element) return false;
    return !this.element.paused;
};

Sound.prototype.pause = function() {
    if (!this.element) return false;
    var time = this.elements[this.selected].currentTime;
//    this.elements[this.selected].pause();
    this.element.pause();
    this.element.currentTime = 0;
    this.element.pause();
    this.element.currentTime = time;
    return true;
};

Sound.prototype.isPaused = function() {
    if (!this.element) return false;
    return !!this.element.paused;
};

Sound.prototype.mute = function(b) {
    if (!this.element) return false;
    this.element.muted = b;
    return this;
};

Sound.prototype.isMuted = function() {
    if (!this.element) return false;
    return this.element.muted;
};

Sound.prototype.stop = function() {
    if (!this.element) return false;
    this.element.pause();
    this.element.currentTime = 0;
    return this;
};

Sound.prototype.setVolume = function(n) {
    if (!this.element) return false;
    this.element.volume = this.volume;
    return true;
};

Sound.prototype.setTime = function(time) {
    if (!this.element) return false;
    this.elements[this.selected].currentTime = time;
    return true;
};

Sound.prototype.hasEnded = function() {
    if (!this.element) return false;
    return this.element.ended;
};
