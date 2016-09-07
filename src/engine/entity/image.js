

yespix.defineEntity('image', {


    inheritClass: 'gfx',


    init: function(properties) {
//console.log('isString properties = ', yespix.isString(properties), properties);        
        properties = properties || {};
        
        // disable prerender for image
        properties.prerender = false;

        if (yespix.isString(properties)) {
            properties = {image: {src: properties}};
        }
        

        this.super(properties);
        this.image = new yespix.class.image(this.image, this);

        this.checkReady();
    },

    
    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
        if (this.image && !this.image.isReady) return false;
        return this.super();
    },


    load: function(src) {
        this.image.load(src);
    },


    unload: function() {
        this.image.unload();
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


    setChanged: function(b) {
        this.super(b);
        if (this.image) this.image.isChanged = b;
    },


    drawRender: function(context) {
        if (this.image) {
            this.image.draw(context);
        }
        if (this.debug) {
            this.drawDebug(context);
        }
    },


    getBoundaryImage: function() {
        return this.image.getBoundaryImage();
    },

/*
    getBoundaryClip: function() {
        return this.image.getBoundaryClip();
    },
*/

    getAssets: function() {
        var list = this.super();
        if (this.image && this.image.src) {
            list = list.concat([this.image.src]);
        }
        return list;
    },
    
});

