yespix.define('rect', 'gfx', {

    lineWidth: 0,
    lineColor: '#000000',
    rectColor: '#999999',
    isVisible: true,

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
            if (this.lineWidth > 0) {
                context.lineWidth = this.lineWidth;
                context.strokeStyle = this.lineColor;
                context.strokeRect(box.x, box.y, box.width, box.height);
            }

            context.fillStyle = this.rectColor;
            context.fillRect(
                box.x, // x position on canvas
                box.y, // y position on canvas
                box.width, // width on canvas
                box.height // height on canvas
            );
            if (this.debug) {
                context.globalAlpha = 1;
                context.lineWidth = 0.5;
                context.strokeStyle = "#ff1111";
                context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width + 1 * scaleX, box.height + 1 * scaleY);
                context.fillStyle = '#999999';

                if (this.collisionBox) {
                    var box = this.collisionBox();
                    context.lineWidth = 0.5;
                    context.strokeStyle = "#000099";
                    context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width * this.pixelSize + 1 * scaleX, box.height * this.pixelSize + 1 * scaleY);
                }
            }
        }
    },

});
