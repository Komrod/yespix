yespix.define('path', {

    inheritClass: 'gfx',

    init: function(options) {
        options = options || {};
        options.path = new Path(options.path || {}, this);
        this.super(options);
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
