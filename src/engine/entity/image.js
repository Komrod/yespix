yespix.define('image', {

    inheritClass: 'gfx',

    init: function(options) {
        options = options || {};
        options.image = new Image(options.image || {}, this);
        this.super(options);
    },

    /**
     * Return True if something has changed (position, aspect ...)
     * @return {bool} 
     */
    getChanged: function() {
        if (this.super()) return true;
        if (this.image && this.image.isChanged) return true;
        return false;
    },

    drawRender: function(context) {
        if (this.image) {
            this.image.draw(context);
        }
    },

    event: function(event) {

        this.super(event);
    }
});
