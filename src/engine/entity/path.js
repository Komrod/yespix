yespix.defineEntity('path', {

    inheritClass: 'gfx',

    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.path = new yespix.class.path(this.path || {}, this);
        
        this.checkReady();
    },


    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
        if (!this.path.isReady) return false;
        return this.super();
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
