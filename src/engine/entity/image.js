

yespix.define('image', {


    inheritClass: 'gfx',


    init: function(options) {
//console.log('isString options = ', yespix.isString(options), options);        
        options = options || {};
        if (yespix.isString(options)) {
            options = {image: {src: options}};
        }
        this.super(options);
        this.image = new Image(this.image, this);
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

