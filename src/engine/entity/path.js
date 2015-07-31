yespix.define('path', {

    inheritClass: 'gfx',

    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.path = new Path(this.path || {}, this);
        this.isReady = true;
    },

    /**
     * Return True if something has changed (position, aspect ...)
     * @return {bool} 
     */
    getChanged: function() {
        if (this.super()) return true;
        if (this.path && this.path.isChanged) return true;
        return false;
    },

    drawRender: function(context) {
        if (this.path) {
            this.path.draw(context);
        }
    }

});
