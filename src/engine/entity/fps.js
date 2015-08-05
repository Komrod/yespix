

yespix.defineEntity('fps', {

    inheritClass: 'gfx',

    init: function(properties) {
        properties = properties || {};
        this.super(properties);

        this.objects = [];
        this.objects.push(new yespix.entity.path({path: {
            lineColor: '#ffffff',
            fillColor: '#000000',
            fillAlpha: 0.5,
        }}));
    },

    /**
     * Return True if something has changed (position, aspect ...)
     * @return {bool} 
     */
    getChanged: function() {
        return true;
    },

    drawRender: function(context) {
        for (var t=0; t<this.objects.length; t++) {

        }
    }

});

