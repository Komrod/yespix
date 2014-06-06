yespix.define('rect', 'shape', {

    init: function() {},


    drawFill: function(context, box) {
        context.fillStyle = this.fillColor;
        context.fillRect(
            box.x, // x position on canvas
            box.y, // y position on canvas
            box.width, // width on canvas
            box.height // height on canvas
        );
    },

    drawLine: function(context, box) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.strokeRect(box.x, box.y, box.width, box.height);
    }
});
