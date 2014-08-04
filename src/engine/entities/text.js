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
                this.drawDebug(context, this.getDrawBox());
            }
        }
    },

});
