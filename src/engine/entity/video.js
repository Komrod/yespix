

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


    load: function() {
        this.video.load();
    },
    


    getAssets: function() {
        var list = this.super();
        if (this.video && this.video.src) {
            list = list.concat([this.video.src]);
        }
        return list;
    },

});

