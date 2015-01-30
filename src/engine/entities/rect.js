yespix.define('rect', 'path', {

    init: function() {},

    drawPath: function(context, contextDrawBox) {
    },

    drawFill: function(context, contextDrawBox) {
        context.fillStyle = this.fillColor;
        this.drawAlpha(context, 'fill');
        context.fillRect(
            contextDrawBox.o_x, // x position on canvas
            contextDrawBox.o_y, // y position on canvas
            contextDrawBox.o_width - this.lineWidth, // width on canvas
            contextDrawBox.o_height - this.lineWidth // height on canvas
        );
    },

    drawLine: function(context, contextDrawBox) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        this.drawAlpha(context, 'line');
        context.strokeRect(
            contextDrawBox.o_x, 
            contextDrawBox.o_y, 
            contextDrawBox.o_width - this.lineWidth, 
            contextDrawBox.o_height - this.lineWidth);
    }
});
