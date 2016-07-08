

yespix.defineEntity('animation', {


    inheritClass: 'image',


    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.animation = new yespix.class.animation(this.animation, this);
    },

    load: function() {
console.log('animation::load');        
        this.animation.load();
//        this.super();
    },
    
/*
    drawRender: function(context) {
        if (this.animation && this.animation.isReady) {
            this.image.draw(context);
        }
    },
*/

    event: function(event) {
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

