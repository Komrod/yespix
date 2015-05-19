
yespix.define('rect', {

    inheritClass: 'path',

    init: function() {
        this.super();
    },

    drawRender: function(context) {
    	if (this.path) {
    		this.path.reset(context);
    		this.path.draw();
    		this.path.line();
    		this.path.fill();
    	}
    }
});
