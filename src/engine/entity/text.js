yespix.define('text', {
    inheritClass: 'gfx',

    init: function(options) {
        options = options || {};
        options.text = new Text(options.text || {}, this);
        this.super(options);
    },


    drawRender: function(context) {
        if (this.text) {
            this.text.draw(context);
        }
    }

});
