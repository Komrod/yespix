

yespix.define('image', {


    inheritClass: 'gfx',


    init: function(properties) {
//console.log('isString properties = ', yespix.isString(properties), properties);        
        properties = properties || {};
        if (yespix.isString(properties)) {
            properties = {image: {src: properties}};
        }
        this.super(properties);
        this.image = new Image(this.image, this);
//console.log(yespix);
//        yespix.extendEntity.image(this);
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

    drawRender: function(context) {
        if (this.image) {
            this.image.draw(context);
        }
    },


    getAssets: function() {
        var list = this.super();
        if (this.image && this.image.src) {
            list = list.concat([this.image.src]);
        }
        return list;
    },
    
});

