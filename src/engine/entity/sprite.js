

yespix.define('sprite', {


    inheritClass: 'image',


    init: function(options) {
        options = options || {};
        this.super(options);
        this.sprite = new Sprite(options.sprite, this);
    },

    load: function() {
        this.sprite.load();
    },
    

    drawRender: function(context) {
        if (this.sprite && this.sprite.isReady) {
            this.sprite.prepare();
            this.image.draw(context);
        }
    },

    event: function(event) {
console.log('sprite:event: event = ', event);
        if (event.type == 'ready' && event.fromClass == 'Image') {
            this.sprite.load();
        }
        return this.super(event);
    },

});

