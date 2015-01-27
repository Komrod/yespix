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
        var box = this.getDrawBox(true, context);
        if (this.snapToPixel) {
            box.x = parseInt(box.x);
            box.y = parseInt(box.y);
        }

        // check if image outside canvas
        if (box.x > context.canvas.clientWidth 
            || box.y > context.canvas.clientHeight 
            || box.x + box.width < 0
            || box.y + box.height < 0)
            return;

        var contextDrawBox = this.getContextDrawBox(context, {realWidth: box.width, realHeight: box.height}, box);

        console.log('text.prerenderUse :: drawBox = ');
        console.log(box);

        console.log('text.prerenderUse :: contextDrawBox = ');
        console.log(contextDrawBox);

        // check if the contextDrawBox is flat
        if (contextDrawBox.img_width == 0
            || contextDrawBox.img_height == 0
            || contextDrawBox.context_width == 0
            || contextDrawBox.context_height == 0)
            return;

        context.globalAlpha = this.alpha;
    
        console.log('text.prerenderUse :: prerenderCanvas = ');
        console.log(this.prerenderCanvas);
        
        console.log('text.prerenderUse :: context = ');
        console.log(context);
        console.log(this.prerenderCanvas, //image element
            contextDrawBox.img_x, // x position on image
            contextDrawBox.img_y, // y position on image
            contextDrawBox.img_width, // width on image
            contextDrawBox.img_height, // height on image
            contextDrawBox.context_x, // x position on canvas
            contextDrawBox.context_y + box.height, // y position on canvas
            contextDrawBox.context_width, // width on canvas
            contextDrawBox.context_height);

        context.drawImage(
            this.prerenderCanvas, //image element
            contextDrawBox.img_x, // x position on image
            contextDrawBox.img_y, // y position on image
            contextDrawBox.img_width, // width on image
            contextDrawBox.img_height, // height on image
            contextDrawBox.context_x, // x position on canvas
            contextDrawBox.context_y + box.height, // y position on canvas
            contextDrawBox.context_width, // width on canvas
            contextDrawBox.context_height // height on canvas
        );
        return true;
    },


    getDrawBox: function(relative, context) {
        var position = this.getPosition(relative);
        if (!context) {
            if (this.prerender) context = this.prerenderCanvas.context;
            else context = this.getContext();
        }

        var size = context.measureText(this.text);
        size.height = yespix.getFontHeight(this.font);
        return {
            x: position.x,
            y: position.y,
            width: size.width * 2,
            height: size.height * 2,
            type: this._class
        };
    },


    drawRender: function(context, contextDrawBox) {
        context.globalAlpha = this.alpha;
        context.fillStyle = this.textColor;
        context.font = this.textSize+'px '+this.textFont;
        context.fillText(this.text, contextDrawBox.context_x, contextDrawBox.context_y);
    }

});
