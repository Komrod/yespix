

yespix.defineEntity('video', {


    inheritClass: 'gfx',


    init: function(properties) {
        var properties = properties || {};
        if (yespix.isString(properties)) {
            properties = {video: {src: properties}};
        }
        this.super(properties);
        this.video = new yespix.class.video(this.video || {}, this);

        this.checkReady();
    },


    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
        if (this.video && !this.video.isReady) return false;
        return this.super();
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

