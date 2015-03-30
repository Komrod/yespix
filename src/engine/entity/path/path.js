yespix.define('path', {

    inheritClass: 'gfx',

    path: null,
    prerender: null,

    isVisible: true,


    init: function(options) {
        this.super(options);
        this.path = new Path(this.options.path || {}, this);
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

});
