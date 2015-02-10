yespix.define('text', 'gfx', {
    textAlign: 'left', // "left" / "right" / "center"
    textFont: 'sans-serif',
    textSize: 16,
    textColor: '#000000',
    text: '',
    prerender: true,

    init: function() {
        // change pre-render on change these properties
        yespix.listen(this, ['text', 'textAlign', 'textFont', 'textSize', 'textColor'], function(obj, e) {
            if (obj.prerender) obj._changed = true;
        });
    },


    /**
     * Draw pre-render for text, change y position on canvas context
     */
    prerenderUse: function(context) {
        /*
        // check if image outside canvas
        if (this._box.draw.x > context.canvas.clientWidth 
            || this._box.draw.y > context.canvas.clientHeight 
            || this._box.draw.x + this._box.draw.width < 0
            || this._box.draw.y + this._box.draw.height < 0)
            return;
        */
       
        if (!this._box.context || !this._box.img) this.getContextBox(context, this.prerenderCanvas);

        /*
        if (this._box.context.width <= 0
            || this._box.context.height <= 0)
            return false;
        */
       
        context.globalAlpha = this.alpha;
    
        context.drawImage(this.prerenderCanvas, //image element
            this._box.img.x, // x position on image
            this._box.img.y, // y position on image
            this._box.img.width, // width on image
            this._box.img.height, // height on image
            this._box.context.x, // x position on canvas
            this._box.context.y, // y position on canvas
            this._box.context.width, // width on canvas
            this._box.context.height // height on canvas
        );
        return true;
    },


    getDrawBox: function(absolute) {
        //console.log('text.getDrawBox');
        var position = this.getPosition(absolute);

        this._context = this._context || yespix.context || this.document.createElement('canvas');

        /*if (!this._context) {
            return {
                x: position.x,
                y: position.y,
                width: 0,
                height: 0
            };
        }*/
        //var size = this._context.measureText(this.text);
        //var height = Math.ceil(yespix.getFontHeight(this.font));
        //var width = Math.ceil(size.width);

        return {
            x: position.x,
            y: position.y,
            width: Math.ceil(this._context.measureText(this.text).width) * 2,
            height: Math.ceil(yespix.getFontHeight(this.font)) * 2
        };
    },


    drawRender: function(context) {
        context.globalAlpha = this.alpha;
        context.fillStyle = this.textColor;
        context.font = this.textSize+'px '+this.textFont;
        context.fillText(this.text, this._box.draw.x, this._box.draw.y + this.textSize);
    }

});
