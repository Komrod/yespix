

function Sound(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;
    if (yespix.isString(options) || yespix.isArray(options)) {
        options = {src: options};
    }

    var varDefault = {
        selected: 0,
        autoLoad: false,
        autoPlay: false,
        loop: false,
        src: '',
        isLoading: false,
        isReady: false
    };

    if (yespix.isObject(options)) {
        this.set(options, varDefault);
    } else {
        this.set({}, varDefault);
    }

    this.elements = {};
    this.elementIndex = 0;

    if (this.autoPlay || this.autoLoad) {
        this.load();
    }
}


// new yespix.class.sound('');
// new yespix.class.sound(['', '']);
// new yespix.class.sound({ sound: '');
// new yespix.class.sound({ sound: ['', '']});
// new yespix.class.sound({ sound: { src: '', autoPlay: true});
// new yespix.class.sound({ sound: { src: ['', ''], autoPlay: true});
// new yespix.class.sound({ sound: { src: { wilhelm: '', ludicrous: ''}, autoPlay: true});
// entity.getSound('boom').play();


Sound.prototype.load = function() {

    if (this.isLoading || this.isReady) return true;

    this.isLoading = true;
    this.isReady = false;
    this.elements = {};
    this.elementIndex = 0;

    var count = 0;
    if (yespix.isString(this.src)) {
        this.addElement(this.src, 0, true);
        count++;
    } else if (yespix.isArray(this.src)) {
        var len = this.src.length;
        for (var t=0; t<len; t++) {
            this.addElement(this.src[t], t, true);
            count++;
        }
    } else if (yespix.isObject(this.src)) {
        for (var n in this.src) {
            this.addElement(this.src[n], n, true);
            count++;
        }
    }
    if (count == 0) {
        this.ready();
    }
};


Sound.prototype.addElement = function(src, name, selectNew) {

    name = name || this.elementIndex;

    var element = document.createElement("audio");
    element.source = src;
    element.name = name;
    element.loop = this.loop;
    element.autoplay = this.autoPlay;

    element.addEventListener("load", function() { 
       this.entity.sound.eventElement('load', this);
    }, true);
    element.addEventListener("play", function() { 
       this.entity.sound.eventElement('play', this);
    }, true);
    element.addEventListener("canplay", function() { 
        this.entity.sound.eventElement('canplay', this);
    }, true);
    element.addEventListener("pause", function() { 
        this.entity.sound.eventElement('pause', this);
    }, true);
    element.addEventListener("error", function() { 
        this.entity.sound.eventElement('error', this);
    }, true);

    if (src) {
        element.src = src;
        element.load();
    }
    element.isReady = false;
    element.isLoading = true;
    element.entity = this.entity;

    this.elements[name] = element;
    this.elementIndex++;

    if (selectNew) {
        this.selected = name;
    }
};


Sound.prototype.ready = function() {

    this.isLoading = false;
    this.isReady = true;

    this.entity.event(
        {
            type: 'ready',
            from: this,
            fromClass: 'Sound',
            entity: this.entity
        }
    );
};


Sound.prototype.removeElement = function(index) {

    if (yespix.isUndefined(index)) {
        for (var n in this.elements) {
            this.removeElement(n);
        }
        return true;
    }

    if (this.elements[index]) {
        this.elements[index].entity = null;
        this.elements[index] = null;
        delete(this.elements[index]);
    }
};


Sound.prototype.eventElement = function(type, element) {
    if (type == 'canplay') {
        if (!element.ready) {
            element.isReady = true;
            element.isLoading = false;

            var len = this.elements.length;
            var allReady = true;
            var oneLoading = false;
            for (var t=0; t<len; t++) {
                if (!this.elements[t].isReady) {
                    allReady = false;
                }
                if (this.elements[t].isLoading) {
                    oneLoading = true;
                }
            }
            this.isReady = allReady;
            this.isLoading = oneLoading;
        } else {
            element.isReady = true;
            element.isLoading = false;
        }
        if (element.autoplay) {
            element.autoplay = false;
            element.play();
        }
    } else if (type == 'load') {
        element.isReady = false;
        element.isLoading = true;
    } else if (type == 'error') {
        element.isReady = false;
        element.isLoading = false;
    } else if (type == 'pause') {
        if (element.loop && element.ended) {
                element.pause();
                element.currentTime = 0;
                element.play();
        }
    }
};


Sound.prototype.select = function(index) {
    if (!this.isReady && !this.isLoading) {
        this.load();
    }

    if (this.elements[index]) {
        this.selected = index;
        return this;
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
            fromClass: 'Sound',
            properties: options
        }
    );
};

Sound.prototype.setElement = function(index, options, varDefault) {
    if (!this.elements[index]) return false;

    yespix.copy(options, this.elements[index], varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Sound',
            properties: options,
            element: this.elements[index],
            index: index
        }
    );
};


Sound.prototype.loadSelected = function() {
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
