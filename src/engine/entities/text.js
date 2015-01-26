yespix.define('text', 'gfx', {
    textAlign: 'left', // "left" / "right" / "center"
    textFont: 'sans-serif',
    textSize: 16,
    textColor: '#000000',
    text: '',
    prerender: false,

    prerenderUpdate: function() {
        //console.log('prerenderUpdate');
        var drawBox = this.getDrawBox();
        this.prerenderCanvas.width = drawBox.width;
        this.prerenderCanvas.height = drawBox.height;

        //this.prerenderCanvas.context.fillStyle = '#FF0000';
        //this.prerenderCanvas.context.fillRect(0,0,100,100);

        var drawBox = this.getDrawBox();
        //console.log('prerenderUpdate :: drawbox = ');
        //console.log(drawBox);
        var contextDrawBox = {
            img_x: 0,
            img_y: 0,
            img_width: drawBox.width,
            img_height: drawBox.height,
            context_x: 0,
            context_y: drawBox.height,
            context_width: drawBox.width,
            context_height: drawBox.height
            };
        //console.log('prerenderUpdate :: contextDrawBox = ');
        //console.log(contextDrawBox);
        this.drawRender(this.prerenderCanvas.context, contextDrawBox);
    },

    getDrawBox: function(relative, context) {
        var position = this.getPosition(relative);
        //console.log('getDrawBox');
        //console.log(context);
        if (!context) {
            if (this.prerender) context = this.prerenderCanvas.context;
            else context = this.getContext();
        }

        //console.log(context);
        var size = context.measureText(this.text);
        //console.log('size = ');
        //console.log(size);
        size.height = yespix.getFontHeight(this.font);
        //console.log('size = ');
        //console.log(size);
        return {
            x: position.x,
            y: position.y,
            width: size.width * 2,
            height: size.height * 2,
            type: this._class
        };
    },

    draw: function() {
        if (!this.isVisible) return;
        //this.prerender = !this.prerender;

        var context;
        //console.log(canvas);
        //console.log('draw');
        //console.log(context);
        if (!context) context = this.getContext();
        //console.log(context);
        //console.log(this.prerenderCanvas);

        if (this.prerender && this.prerenderCanvas && this.prerenderCanvas.width > 0) {
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

            if (contextDrawBox.img_width == 0
                || contextDrawBox.img_height == 0
                || contextDrawBox.context_width == 0
                || contextDrawBox.context_height == 0)
                return;

            context.globalAlpha = this.alpha;
        
            //console.log(contextDrawBox);
            //console.log(this.prerenderCanvas);

            context.drawImage(this.prerenderCanvas, //image element
                contextDrawBox.img_x, // x position on image
                contextDrawBox.img_y, // y position on image
                contextDrawBox.img_width, // width on image
                contextDrawBox.img_height, // height on image
                contextDrawBox.context_x, // x position on canvas
                contextDrawBox.context_y - box.height, // y position on canvas
                contextDrawBox.context_width, // width on canvas
                contextDrawBox.context_height // height on canvas
            );
            return;
        } //else console.log('no prerender');

        if (context) {

            this.drawRender(context, { context_x: this.x, context_y: this.y});
        }

        if (this.debug) {
            this.drawDebug(context, this.getDrawBox());
        }

    },

    drawRender: function(context, contextDrawBox) {
        //console.log('drawRender');
        //console.log(context);
        //console.log(contextDrawBox);

        context.globalAlpha = this.alpha;
        context.fillStyle = this.textColor;
        context.font = this.textSize+'px '+this.textFont;
        context.fillText(this.text, contextDrawBox.context_x, contextDrawBox.context_y);
    }

});
