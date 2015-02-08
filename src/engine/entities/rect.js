yespix.define('rect', 'path', {

    prerender: true,
    
    init: function() {},

    drawPath: function(context) {
    },

    drawFill: function(context) {
        context.fillStyle = this.fillColor;
        this.drawAlpha(context, 'fill');
        context.fillRect(
            this._box.path.x, // x position on canvas
            this._box.path.y, // y position on canvas
            this._box.path.width, // width on canvas
            this._box.path.height // height on canvas
        );
    },

    drawLine: function(context) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        this.drawAlpha(context, 'line');
        context.strokeRect(
            this._box.path.x, 
            this._box.path.y, 
            this._box.path.width, 
            this._box.path.height);
    }
});
