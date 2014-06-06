yespix.define('roundrect', 'rect', {

    rectRadius: 5,

    init: function() {},

    drawPath: function(context) {
        context.beginPath();
        context.moveTo(this.x + this.rectRadius, this.y);
        context.lineTo(this.x + this.width - this.rectRadius, this.y);
        context.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.rectRadius);
        context.lineTo(this.x + this.width, this.y + this.height - this.rectRadius);
        context.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.rectRadius, this.y + this.height);
        context.lineTo(this.x + this.rectRadius, this.y + this.height);
        context.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.rectRadius);
        context.lineTo(this.x, this.y + this.rectRadius);
        context.quadraticCurveTo(this.x, this.y, this.x + this.rectRadius, this.y);
    },

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
            if (this.rectColor != '') {
                context.fillStyle = this.rectColor;
                this.drawPath(context);
                context.fill();
            }
            if (this.lineWidth > 0 && this.lineColor != '') {
                context.lineWidth = this.lineWidth;
                context.strokeStyle = this.lineColor;
                if (this.rectColor == '') this.drawPath(context);
                context.stroke();
            }
            if (this.debug) {
                this.drawDebug(context, box);
            }
        }
    },

});
