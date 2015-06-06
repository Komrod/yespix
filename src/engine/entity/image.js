

yespix.define('image', {


    inheritClass: 'gfx',


    init: function(options) {
console.log('isString options = ', yespix.isString(options), options);        
        options = options || {};
        if (yespix.isString(options) || yespix.isArray(options)) {
            options = {image: {src: options}};
        }
        this.super(options);
        this.image = new Image(options.image, this);
    },

    load: function() {
        this.image.load();
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
            if (yespix.isArray(this.image.src)) {
                list = list.concat(this.image.src);
            } else {
                list = list.concat([this.image.src]);
            }
        }
        return list;
    },

    

});

