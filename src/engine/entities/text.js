yespix.define('text', 'gfx', {
    textAlign: 'left', // "left" / "right" / "center"
    textFont: '16px sans-serif',
    textColor: '#000000',
    text: '',

    draw: function(context) {
        if (!this.isVisible) return;

        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }

        if (context) {

            context.globalAlpha = this.alpha;
            context.fillStyle = this.textColor;
            context.font = this.textFont;
            context.fillText(this.text, this.x, this.y);

            if (this.debug) {
                context.globalAlpha = 1;
                context.lineWidth = 0.5;
                context.strokeStyle = "#ff1111";
                context.strokeRect(this.x - 0.5, this.x - 0.5, this.width, this.height);

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
