

yespix.define('text', {
    inheritClass: 'gfx',

    init: function(options) {
        options = options || {};
        this.super(options);
        this.text = new Text(this.text || {}, this);

        this.isReady = true;
    },


    drawRender: function(context) {
        if (this.text) {
            this.text.draw(context);
        }
    }
});

