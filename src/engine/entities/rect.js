yespix.define('rect', 'path', {

    init: function() {},

    drawPath: function(context, contextDrawBox) {
    },

    drawFill: function(context, contextDrawBox) {
        context.fillStyle = this.fillColor;
        context.fillRect(
            contextDrawBox.o_x, // x position on canvas
            contextDrawBox.o_y, // y position on canvas
            contextDrawBox.o_width, // width on canvas
            contextDrawBox.o_height // height on canvas
        );
    },

    drawLine: function(context, contextDrawBox) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.strokeRect(
            contextDrawBox.o_x, 
            contextDrawBox.o_y, 
            contextDrawBox.o_width, 
            contextDrawBox.o_height);
    }
});
