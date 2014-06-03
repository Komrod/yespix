yespix.define('circle', 'gfx', {

	circleRadius: 5,
	
    init: function() {},
    
    drawPath: function(context)
    {
        context.beginPath();
        context.arc(this.x, this.y, this.circleRadius, 0, 2 * Math.PI, false);
    },
    
    draw: function(context) {
        if (!this.isVisible) return;

        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }

        var box = this.getDrawBox();

        if (context) {
            context.globalAlpha = this.alpha;
            if (this.rectColor != '') {
	            context.fillStyle = this.rectColor;
            	this.drawPath(context);
                context.fill();
            }
            if (this.lineWidth > 0 && this.lineColor != '') {
                context.lineWidth = this.lineWidth;
                context.strokeStyle = this.lineColor;
                if (this.rectColor == '') this.drawPath(context);
                context.stroke();
            }
            if (this.debug) {
            	this.drawDebug(context, box);
            }
        }
    },

});
