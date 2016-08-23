

yespix.defineEntity('animation', {


    inheritClass: 'image',


    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.animation = new yespix.class.animation(this.animation, this);

        this.checkReady();
    },

    load: function() {
        this.animation.load();
    },
    
    trigger: function(event) {
        if (this.animation.trigger) {
            this.animation.trigger(event);    
        }
        return this.super(event);
    },

    step: function(time) {
        this.super(time);

        if (this.animation) {
            this.animation.step(time);
        }
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

