

yespix.defineEntity('sprite', {


    inheritClass: 'image',


    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.sprite = new yespix.class.sprite(this.sprite, this);

        this.checkReady();
    },


    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
        if (this.sprite && !this.sprite.isReady) return false;
        return this.super();
    },


    load: function() {
        this.sprite.load();
    },
    

    drawRender: function(context) {
        if (this.sprite && this.sprite.isReady) {
            this.image.draw(context);
        }
    },

    trigger: function(event) {
        if (event.type == 'ready' && event.fromClass == 'Image') {
            this.sprite.load();
        }
        return this.super(event);
    },

});

