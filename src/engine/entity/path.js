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

    setChanged: function(b) {
        this.super(b);
        if (this.path) this.path.isChanged = b;
    },


    drawRender: function(context) {
        if (this.path) {
            this.path.draw(context);
        }
        if (this.debug) {
            this.drawDebug(context);
        }
    },


    getBoundaryImage: function() {
        return this.path.getBoundaryImage();
    },


    getBoundaryClip: function() {
        return this.path.getBoundaryClip();
    },


    getBoundaryRender: function() {
        return this.path.getBoundaryRender();
    },


    getBoundaryDraw: function() {
        var boundaryDraw = this.super();
        var lineWidth = this.path.lineWidth;

        if (this.path.lineAlign == 'center') {
            lineWidth *= 0.5;
        } else if (this.path.lineAlign == 'inside') {
            lineWidth = 0;
        }

        return {
            x: boundaryDraw.x - lineWidth,
            y: boundaryDraw.y - lineWidth,
            width: boundaryDraw.width + lineWidth * 2,
            height: boundaryDraw.height + lineWidth * 2
        };
    },


});
