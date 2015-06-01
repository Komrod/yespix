

function Sound(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
        isLoading: false,
        isReady: false,
        isSupported: false,

        src: '',

        loop: false,
        autoplay: false,

        element: null, // img element
    };

    this.set(options, this, varDefault);

    this.load(this.src);
}

Sound.prototype.initElement = function() {
    this.element = document.createElement("audio");
    
};

Sound.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'sound',
            properties: options
        }
    );
};


Sound.prototype.ready = function(entity) {
    this.isLoading = false;
    this.isReady = true;
    if (this.entity.image == this) {
        this.entity.isReady = true;
    }
    this.element.isLoading = false;
    this.element.isReady = true;

    this.entity.event(
        {
            type: 'ready',
            from: this,
            fromClass: 'image',
            entity: this.entity
        }
    );
};


Sound.prototype.load = function() {
    if (!this.isSupported) return this;
    this.element.load();
    return this;
};

Sound.prototype.play = function() {
    if (!this.isSupported) return this;
    this.element.play();
    return this;
};

Sound.prototype.isPlaying = function() {
    if (!this.isSupported) return null;
    return !this.element.paused;
};

Sound.prototype.pause = function() {
    if (!this.isSupported) return this;
    this.element.pause();
    return this;
};

Sound.prototype.isPaused = function() {
    if (!this.isSupported) return null;
    return !!this.element.paused;
};

Sound.prototype.mute = function(b) {
    if (!this.isSupported) return this;
    this.element.muted = b;
    return this;
};

Sound.prototype.isMuted = function() {
    if (!this.isSupported) return null;
    return this.element.muted;
};

Sound.prototype.restart = function() {
    if (!this.isSupported) return this;
    this.stop().play();
    return this;
};

Sound.prototype.stop = function() {
    if (!this.isSupported) return this;
    this.element.pause();
    this.setTime(0);
    return this;
};

Sound.prototype.setVolume = function(n) {
    if (!this.isSupported) return this;
    this.volume = n;
    if (this.volume < 0) this.volume = 0;
    else if (this.volume > 1) this.volume = 1;
    this.element.volume = this.volume;
    return this;
};

Sound.prototype.volumeUp = function() {
    if (!this.isSupported) return this;
    this.volume -= 0.1;
    if (this.volume < 0) this.volume = 0;
    else if (this.volume > 1) this.volume = 1;
    this.element.volume = this.volume;
    return this;
};

Sound.prototype.volumeDown = function() {
    if (!this.isSupported) return this;
    this.volume += 0.1;
    if (this.volume < 0) this.volume = 0;
    else if (this.volume > 1) this.volume = 1;
    this.element.volume = this.volume;
    return this;
};

Sound.prototype.setTime = function(time) {
    if (!this.isSupported) return this;
    this.element.currentTime = time;
    return this;
};

Sound.prototype.isEnded = function() {
    if (!this.isSupported) return null;
    return this.element.ended;
};
