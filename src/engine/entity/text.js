

yespix.defineEntity('text', {
    inheritClass: 'gfx',

    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.text = new yespix.class.text(this.text || {}, this);

        this.checkReady();
    },


    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
        if (this.text && !this.text.isReady) return false;
        return this.super();
    },


    drawRender: function(context) {
        if (this.text) {
            this.text.draw(context);
        }
    }
});

