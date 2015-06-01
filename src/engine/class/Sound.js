

function Sound(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
        selected: 0,
        
        autoplay: false,
        loop: false,
    };

    if (!yespix.isArray(options)) {
        this.set(options, this, varDefault);
    } else {
        this.set({}, this, varDefault);
    }

    this.elements = [];

    if (yespix.isArray(options)) {
        var len = options.length;
        for (var t=0; t<len; t++) {
            this.addElement(options[t]);
        }
        this.selected = 0;
    } else if (yespix.isArray(this.src)) {
        var len = this.src.length;
        for (var t=0; t<len; t++) {
            this.addElement(this.src[t]);
        }
        this.selected = 0;
    } else {
        this.addElement({ src: this.src, name: this.name });
    }
}

// new yespix.class.sound({ sound: {src: 'a.wav', name: 'boom', loop: true, autoplay: true});
// new yespix.class.sound({ sound: {src: ['a.wav', 'b.wav'], loop: true, autoplay: true});
// new yespix.class.sound({ sound: [{src: 'a.wav', name: 'boom', loop: true}, {src: 'b.wav', autoplay: true}]);
// entity.getSound('boom').play();


Sound.prototype.addElement = function(src, selectNew) {

    var element = document.createElement("audio");

    if (yespix.isObject(src)) {
        yespix.copy(src, element);
        src = src.src;
    } else {
        if (yespix.isUndefined(element.loop)) element.loop = this.loop;
        if (yespix.isUndefined(element.autoplay)) element.autoplay = this.autoplay;
    }

    element.addEventListener("load", function() { 
       element.entity.sound.eventElement('load', element);
    }, true);
    element.addEventListener("play", function() { 
       element.entity.sound.eventElement('play', element);
    }, true);
    element.addEventListener("canplay", function() { 
        element.entity.sound.eventElement('canplay', element);
    }, true);
    element.addEventListener("pause", function() { 
        element.entity.sound.eventElement('pause', element);
    }, true);
    element.addEventListener("error", function() { 
        element.entity.sound.eventElement('error', element);
    }, true);

    if (src) {
        element.src = src;
        element.load();
    }
    element.isReady = false;
    element.entity = this.entity;

    this.elements.push(element);
    if (selectNew) this.selected = this.elements.length - 1;
};


Sound.prototype.removeElement = function(index) {
    if (this.elements[index]) {
        this.elements.splice(index, 1);
    }
};


Sound.prototype.eventElement = function(type, element) {
console.log('eventElement: type='+type+', element = ', element);
    if (type == 'canplay') {
        element.isReady = true;
        if (element.autoplay) {
            element.autoplay = false;
            element.play();
        }
    } else if (type == 'pause') {
        if (element.loop && element.ended) {
                element.pause();
                element.currentTime = 0;
                element.play();
        }
    }
};


Sound.prototype.select = function(index) {
    if (yespix.isInt(index)) {
        if (this.elements[index]) {
            this.selected = index;
            return this;
        }
        return null;
    }

    if (!index) return null;

    var len = this.elements.length;
    for (var t=0; t<len; t++) {
        if (this.elements[t].name == index) {
            this.selected = t;
            return this;
        }
    }
    return null;
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


Sound.prototype.load = function() {
    if (!this.elements[this.selected]) return false;
    this.elements[this.selected].load();
    return true;
};

Sound.prototype.play = function() {
    if (!this.elements[this.selected]) return false;
    this.elements[this.selected].play();
    return true;
};

Sound.prototype.isPlaying = function() {
    if (!this.elements[this.selected]) return false;
    return !this.elements[this.selected].paused;
};

Sound.prototype.pause = function() {
    if (!this.elements[this.selected]) return false;
    var time = this.elements[this.selected].currentTime;
//    this.elements[this.selected].pause();
    this.elements[this.selected].pause();
    this.elements[this.selected].currentTime = 0;
    this.elements[this.selected].pause();
    this.elements[this.selected].currentTime = time;
console.log('isPaused = '+this.isPaused());
console.log('isPlaying = '+this.isPlaying());
    return true;
};

Sound.prototype.isPaused = function() {
    if (!this.elements[this.selected]) return false;
    return !!this.elements[this.selected].paused;
};

Sound.prototype.mute = function(b) {
    if (!this.elements[this.selected]) return false;
    this.elements[this.selected].muted = b;
    return this;
};

Sound.prototype.isMuted = function() {
    if (!this.elements[this.selected]) return false;
    return this.elements[this.selected].muted;
};

Sound.prototype.stop = function() {
    if (!this.elements[this.selected]) return false;
    this.elements[this.selected].pause();
    this.elements[this.selected].currentTime = 0;
    return this;
};

Sound.prototype.setVolume = function(n) {
    if (!this.elements[this.selected]) return false;
    this.elements[this.selected].volume = this.volume;
    return true;
};

Sound.prototype.setTime = function(time) {
    if (!this.elements[this.selected]) return false;
    this.elements[this.selected].currentTime = time;
    return true;
};

Sound.prototype.hasEnded = function() {
    if (!this.elements[this.selected]) return false;
    return this.elements[this.selected].ended;
};
