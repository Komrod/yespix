

yespix.define('video', {


    inheritClass: 'gfx',


    init: function(options) {
        var options = options || {};
        if (yespix.isString(options)) {
            options = {video: {src: options}};
        }
        this.super(options);
        this.video = new Video(options.video || {}, this);
    },


    load: function(src) {
        this.video.load(src);
    },
    
    unload: function() {
        this.video.unload();
    },
    

    drawRender: function(context) {
        if (this.video) {
            this.video.draw(context);
        }
    },

    play: function() {
        return this.video.play();
    },

    isPlaying: function() {
        return this.video.isPlaying();
    },

    pause: function() {
        return this.video.pause();
    },

    isPaused: function() {
        return this.video.isPaused();
    },

    mute: function(b) {
        return this.video.mute(b);
    },

    isMuted: function() {
        return this.video.isMuted();
    },

    stop: function() {
        return this.video.stop();
    },

    setVolume: function(n) {
        return this.video.setVolume(n);
    },

    setTime: function(time) {
        return this.video.setTime(time);
    },

    hasEnded: function() {
        return this.video.hasEnded();
    },

    getAssets: function() {
        var list = this.super();
        if (this.video && this.video.src) {
            list = list.concat([this.video.src]);
        }
        return list;
    },

});

