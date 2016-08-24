

yespix.defineEntity('control', {


    inheritClass: 'combo',


    init: function(properties) {
        properties = properties || {};
        if (yespix.isString(properties)) {
            properties = {image: {src: properties}};
        }
        this.super(properties);


        this.checkReady();
    },

    
    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
//        if (this.image && !this.image.isReady) return false;
        return this.super();
    },


    load: function(src) {
    },

    unload: function() {
    },
    
    /**
     * Return True if something has changed (position, aspect ...)
     * @return {bool} 
     */
    getChanged: function() {
        if (this.super()) return true;

        return false;
    },

    drawRender: function(context) {
    },


    getAssets: function() {
        var list = this.super();
        if (this.image && this.image.src) {
            list = list.concat([this.image.src]);
        }
        return list;
    },
    
});

