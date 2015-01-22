yespix.define('path', 'gfx', {

    lineWidth: 0,
    lineColor: '',
    lineAlpha: 1.0,

    fillColor: '',
    fillAlpha: 1.0,

    isVisible: true,

    init: function() {},

    canDraw: function(context, box) {
        if (box.x > context.canvas.clientWidth 
            || box.y > context.canvas.clientHeight 
            || box.x + box.width < 0
            || box.y + box.height < 0)
            return false;
    
        return this.isVisible && this.alpha > 0;
    },

    canDrawPath: function(context, box) {
        return true;
    },

    drawPath: function(context, box) {

    },

    canDrawLine: function(context, box) {
        return this.lineWidth > 0 && this.lineColor != '' && this.lineAlpha > 0;
    },

    drawLine: function(context, box) {
        this.drawAlpha(context, 'line');
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.stroke();
    },

    canDrawFill: function(context, box) {
        return this.fillColor != '' && this.fillAlpha > 0;
    },

    drawFill: function(context, box) {
        this.drawAlpha(context, 'fill');
        context.fillStyle = this.fillColor;
        context.fill();
    },


    draw: function(context) {
        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }
        var box = this.getDrawBox();

        if (!this.canDraw(context, box)) return;


        if (context) {
            if (this.canDrawPath(context, box))
            {
                this.drawPath(context, box);
                if (this.canDrawFill(context, box)) this.drawFill(context, box);
                if (this.canDrawLine(context, box)) this.drawLine(context, box);
            }
            if (this.canDrawDebug(context, box)) this.drawDebug(context, box);
        }
    },
});
