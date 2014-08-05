yespix.define('text', 'gfx', {
    textAlign: 'left', // "left" / "right" / "center"
    textFont: 'sans-serif',
    textSize: 16,
    textColor: '#000000',
    text: '',

    getDrawBox: function(relative) {
        var position = this.getPosition(relative);
        return {
            x: position.x,
            y: position.y - this.textSize,
            width: this._context.measureText(this.text).width,
            height: this.textSize,
            type: this._class
        };
    },

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
            context.font = this.textSize+'px '+this.textFont;
            context.fillText(this.text, this.x, this.y);

            if (this.debug) {
                this.drawDebug(context, this.getDrawBox());
            }
        }
    },

});
