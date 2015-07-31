

yespix.defineEntity('sound', {


    inheritClass: 'base',


    init: function(properties) {
        var properties = properties || {};
        if (yespix.isString(properties)) {
            properties = {sound: {src: properties}};
        }
        this.super(properties);
        this.sound = new yespix.class.sound(this.sound || {}, this);

    },


    load: function(src) {
        this.sound.load(src);
    },
    

    play: function() {
        return this.sound.play();
    },

    isPlaying: function() {
        return this.sound.isPlaying();
    },

    pause: function() {
        return this.sound.pause();
    },

    isPaused: function() {
        return this.sound.isPaused();
    },

    mute: function(b) {
        return this.sound.mute(b);
    },

    isMuted: function() {
        return this.sound.isMuted();
    },

    stop: function() {
        return this.sound.stop();
    },

    setVolume: function(n) {
        return this.sound.setVolume(n);
    },

    setTime: function(time) {
        return this.sound.setTime(time);
    },

    hasEnded: function() {
        return this.sound.hasEnded();
    },

    getAssets: function() {
        var list = this.super();
        if (this.sound && this.sound.src) {
            list = list.concat([this.sound.src]);
        }
        return list;
    },

});

