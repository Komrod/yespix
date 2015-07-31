

yespix.defineEntity('text', {
    inheritClass: 'gfx',

    init: function(properties) {
        properties = properties || {};
        this.super(properties);
        this.text = new yespix.class.text(this.text || {}, this);

        this.isReady = true;
    },


    drawRender: function(context) {
        if (this.text) {
            this.text.draw(context);
        }
    }
});

