
yespix.define('path', 'gfx', {

    lineWidth: 0,
    lineColor: '',
    lineAlpha: 1.0,

    fillColor: '',
    fillAlpha: 1.0,

    isVisible: true,

    init: function() {

    },


    
    getPathBox: function(absolute) {
        return {
            x: position.x,
            y: position.y,
            width: this.width + this.lineWidth,
            height: this.height + this.lineWidth,
            type: this._class
        };
    },

    getContextDrawBoxDefault: function(context, img, box) {
        
        return {
            img_x: 0,
            img_y: 0,
            img_width: img.realWidth,
            img_height: img.realHeight,
            context_x: box.x,
            context_y: box.y,
            context_width: box.width,
            context_height: box.height,
            o_x: box.x + this.lineWidth / 2,
            o_y: box.y + this.lineWidth / 2,
            o_width: box.width,
            o_height: box.height
        };
    },

    canDrawBox: function(context, contextDrawBox) {
        if (contextDrawBox.o_x > context.canvas.clientWidth 
            || contextDrawBox.o_y > context.canvas.clientHeight 
            || contextDrawBox.o_x + contextDrawBox.o_width < 0
            || contextDrawBox.o_y + contextDrawBox.o_height < 0)
            return false;
        
        return this.isVisible && this.alpha > 0;
    },

    canDrawPath: function(context, contextDrawBox) {
        return true;
    },

    drawPath: function(context, contextDrawBox) {
        context.beginPath();
    },

    canDrawLine: function(context, contextDrawBox) {
        return this.lineWidth > 0 && this.lineColor != '' && this.lineAlpha > 0;
    },

    drawLine: function(context, contextDrawBox) {
        this.drawAlpha(context, 'line');
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.stroke();
    },

    canDrawFill: function(context, contextDrawBox) {
        return this.fillColor != '' && this.fillAlpha > 0;
    },

    drawFill: function(context, contextDrawBox) {
        this.drawAlpha(context, 'fill');
        context.fillStyle = this.fillColor;
        context.fill();
    },

    drawRender: function(context, contextDrawBox, img) {
        //console.log('path.drawRender :: contextDrawBox = ');
        //console.log(contextDrawBox);

        if (this.canDrawPath(context, contextDrawBox))
        {
            this.drawPath(context, contextDrawBox);
            if (this.canDrawFill(context, contextDrawBox)) this.drawFill(context, contextDrawBox);
            if (this.canDrawLine(context, contextDrawBox)) this.drawLine(context, contextDrawBox);
        }
    },

    /**
     * Update the canvas for the prerender
     */
    prerenderUpdate: function() {
        var drawBox = this.getDrawBox(false, this._context);

        //console.log('path.prerenderUpdate :: drawBox = ');
        //console.log(drawBox);

        this.prerenderCanvas.width = drawBox.width;
        this.prerenderCanvas.height = drawBox.height;

        //this.prerenderCanvas.context.fillStyle = '#FF0000';
        //this.prerenderCanvas.context.fillRect(0, 0, 200, 200);

        //console.log('path.prerenderUpdate :: this.prerenderCanvas = ');
        //console.log(this.prerenderCanvas);

        var contextDrawBox = {
            img_x: 0,
            img_y: 0,
            img_width: drawBox.width,
            img_height: drawBox.height,
            context_x: 0,
            context_y: 0,
            context_width: drawBox.width,
            context_height: drawBox.height,
            o_x: this.lineWidth / 2,
            o_y: this.lineWidth / 2,
            o_width: drawBox.width,
            o_height: drawBox.height
            };

        //console.log('path.prerenderUpdate :: contextDrawBox = ');
        //console.log(contextDrawBox);
        
        this.drawRender(this.prerenderCanvas.context, contextDrawBox);
    },

    /**
     * Draw the pre-render on a canvas context
     */
    prerenderUse: function(context) {
        var box = this.getDrawBox(false, context);
        
        //console.log('prerenderUse :: drawBox = ');
        //console.log(box);

        if (this.snapToPixel) {
            box.x = parseInt(box.x);
            box.y = parseInt(box.y);
        }

        // check if image outside canvas
        if (box.x > context.canvas.clientWidth 
            || box.y > context.canvas.clientHeight 
            || box.x + box.width < 0
            || box.y + box.height < 0)
            return false;

        var contextDrawBox = this.getContextDrawBox(context, {realWidth: box.width, realHeight: box.height}, box);

        // check if the contextDrawBox is flat
        if (contextDrawBox.img_width == 0
            || contextDrawBox.img_height == 0
            || contextDrawBox.context_width == 0
            || contextDrawBox.context_height == 0)
            return false;

        context.globalAlpha = this.alpha;
        
        /*console.log('prerenderUse :: contextDrawBox = ');
        console.log(contextDrawBox);*/

        context.drawImage(this.prerenderCanvas, //image element
            contextDrawBox.img_x, // x position on image
            contextDrawBox.img_y, // y position on image
            contextDrawBox.img_width, // width on image
            contextDrawBox.img_height, // height on image
            contextDrawBox.context_x, // x position on canvas
            contextDrawBox.context_y, // y position on canvas
            contextDrawBox.context_width, // width on canvas
            contextDrawBox.context_height // height on canvas
        );
        return true;
    },

});
