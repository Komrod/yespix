

yespix.defineEntity('sprite', {


    inheritClass: 'image',


    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.sprite = new yespix.class.sprite(this.sprite, this);
    },

    load: function() {
        this.sprite.load();
    },
    

    drawRender: function(context) {
        if (this.sprite && this.sprite.isReady) {
            this.image.draw(context);
        }
    },

    event: function(event) {
        if (event.type == 'ready' && event.fromClass == 'Image') {
            this.sprite.load();
        }
        return this.super(event);
    },

});

