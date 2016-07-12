

yespix.defineEntity('animation', {


    inheritClass: 'image',


    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.animation = new yespix.class.animation(this.animation, this);

    },

    load: function() {
        this.animation.load();
    },
    
/*
    drawRender: function(context) {
        if (this.animation && this.animation.isReady) {
            this.image.draw(context);
        }
    },
*/

    event: function(event) {
        if (this.animation.event) {
            this.animation.event(event);    
        }
        return this.super(event);
    },

    drawRender: function(context) {
        if (this.animation) {
            this.animation.checkFrame();
        }
        if (this.image) {
            this.image.draw(context);
        }
    },

});

