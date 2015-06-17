

yespix.define('sprite', {


    inheritClass: 'image',


    init: function(options) {
        options = options || {};
        this.super(options);
        this.sprite = new Sprite(options.sprite, this);
    },

    load: function() {
        this.super();
        this.sprite.load();
    },
    

    drawRender: function(context) {
        if (this.image && this.sprite) {
            this.sprite.prepare();
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

