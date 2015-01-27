yespix.define('path', 'gfx', {

    lineWidth: 0,
    lineColor: '',
    lineAlpha: 1.0,

    fillColor: '',
    fillAlpha: 1.0,

    isVisible: true,

    init: function() {

    },

    canDraw: function(context, contextDrawBox) {
        if (contextDrawBox.o_x > context.canvas.clientWidth 
            || contextDrawBox.o_y > context.canvas.clientHeight 
            || contextDrawBox.o_x + contextDrawBox.o_width < 0
            || contextDrawBox.o_y + contextDrawBox.o_height < 0)
            return false;
        
        return this.isVisible && this.alpha > 0;
    },

    canDrawPath: function(context, contextDrawBox) {
        return true;
    },

    drawPath: function(context, contextDrawBox) {
        context.beginPath();
    },

    canDrawLine: function(context, contextDrawBox) {
        return this.lineWidth > 0 && this.lineColor != '' && this.lineAlpha > 0;
    },

    drawLine: function(context, contextDrawBox) {
        this.drawAlpha(context, 'line');
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.stroke();
    },

    canDrawFill: function(context, contextDrawBox) {
        return this.fillColor != '' && this.fillAlpha > 0;
    },

    drawFill: function(context, contextDrawBox) {
        this.drawAlpha(context, 'fill');
        context.fillStyle = this.fillColor;
        context.fill();
    },

    drawRender: function(context, contextDrawBox, img) {
        if (this.canDrawPath(context, contextDrawBox))
        {
            this.drawPath(context, contextDrawBox);
            if (this.canDrawFill(context, contextDrawBox)) this.drawFill(context, contextDrawBox);
            if (this.canDrawLine(context, contextDrawBox)) this.drawLine(context, contextDrawBox);
        }
    },

    /**
     * Update the canvas for the prerender
     */
    prerenderUpdate: function() {
        //console.log('prerenderUpdate');
        var drawBox = this.getDrawBox();
        this.prerenderCanvas.width = drawBox.width;
        this.prerenderCanvas.height = drawBox.height;
        //console.log(drawBox);
        var contextDrawBox = {
            img_x: 0,
            img_y: 0,
            img_width: drawBox.width + this.lineWidth * 2,
            img_height: drawBox.height + this.lineWidth * 2,
            context_x: 0,
            context_y: 0,
            context_width: drawBox.width + this.lineWidth * 2,
            context_height: drawBox.height + this.lineWidth * 2,
            o_x: 0,
            o_y: 0,
            o_width: drawBox.width + this.lineWidth * 2,
            o_height: drawBox.height + this.lineWidth * 2
            };

        this.drawRender(this.prerenderCanvas.context, contextDrawBox);
    },
});
