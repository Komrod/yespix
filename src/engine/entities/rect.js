yespix.define('rect', 'path', {

    init: function() {},

    drawFill: function(context, box) {
        context.fillStyle = this.fillColor;
        context.fillRect(
            this.x, // x position on canvas
            this.y, // y position on canvas
            this.width, // width on canvas
            this.height // height on canvas
        );
    },

    drawLine: function(context, box) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.strokeRect(box.x, box.y, box.width, box.height);
    }
});
