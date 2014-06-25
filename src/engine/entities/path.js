yespix.define('path', 'gfx', {

    lineWidth: 0,
    lineColor: '',
    lineAlpha: 1.0,

    fillColor: '',
    fillAlpha: 1.0,

    isVisible: true,

    init: function() {},

    canDraw: function() {
        return this.isVisible && this.alpha > 0;
    },

    canDrawPath: function() {
        return true;
    },

    drawPath: function(context, box) {

    },

    canDrawLine: function() {
        return this.lineWidth > 0 && this.lineColor != '' && this.lineAlpha > 0;
    },

    drawLine: function(context, box) {
        this.drawAlpha(context, 'line');
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.stroke();
    },

    canDrawFill: function() {
        return this.fillColor != '' && this.fillAlpha > 0;
    },

    drawFill: function(context, box) {
        this.drawAlpha(context, 'fill');
        context.fillStyle = this.fillColor;
        context.fill();
    },


    draw: function(context) {
        if (!this.canDraw()) return;

        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }

        var box = this.getDrawBox();

        if (context) {
            if (this.canDrawPath()) this.drawPath(context, box);
            if (this.canDrawFill()) this.drawFill(context, box);
            if (this.canDrawLine()) this.drawLine(context, box);
            if (this.canDrawDebug()) this.drawDebug(context, box);
        }
    },
});
