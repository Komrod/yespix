/**
 * @class entity.path
 */
yespix.define('path', {
    
    init: function() {},
    
    draw: function(context) {
        if (!this.isVisible) return;

        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }

        var box = this.getDrawBox();
        var scaleX = this.flipX ? -1 : 1;
        var scaleY = this.flipY ? -1 : 1;

        if (context) {
            context.globalAlpha = this.alpha;

            if (this.rectColor !== '')
            {
                context.fillStyle = this.rectColor;
                context.fillRect(
                    box.x, // x position on canvas
                    box.y, // y position on canvas
                    box.width, // width on canvas
                    box.height // height on canvas
                );
            }
            if (this.lineWidth > 0 && this.lineColor != '') {
                context.lineWidth = this.lineWidth;
                context.strokeStyle = this.lineColor;
                context.strokeRect(box.x, box.y, box.width, box.height);
            }
            
            if (this.debug) {
                this.drawDebug(context, box);
            }
        }
    },

    canDrawPath: function()
    {

    },

    drawPath: function(context, box)    
    {

    },

    drawAlpha: function(context, box)
    {

    },

    canDrawStroke: function(context, box)
    {

    },

    drawStroke: function(context, box)
    {

    },

    canDrawFill: function(context, box)
    {

    },

    drawFill: function(context, box)
    {

    },

    

});
