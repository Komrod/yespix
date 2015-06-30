

yespix.define('animation', {


    inheritClass: 'image',


    init: function(options) {
        options = options || {};
        this.super(options);
        this.animation = new Animation(options.animation, this);
    },

    load: function() {
        this.animation.load();
    },
    

    drawRender: function(context) {
        if (this.animation && this.animation.isReady) {
            this.image.draw(context);
        }
    },

    event: function(event) {
        return this.super(event);
    },

});

