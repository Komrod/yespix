
yespix.define('path', 'gfx', {

    lineWidth: 1,
    lineColor: '#000000',
    lineAlpha: 1.0,

    fillColor: '#ffffff',
    fillAlpha: 1.0,

    isVisible: true,

    prerender: false,


    init: function() {

    },


    /**
     * Get the position and width in an object. In this object, it will be added later some other coordinates (path, context ...)
     * @param  {bool} absolute If true, just get entity x and y. If false, get the position relative to the parent
     * @return {object} Result {_type: "class", draw: {x, y, width, height}}
     */
    getBox: function(absolute) {
        this._box = {
            type: this._class
        };
        this._box.draw = this.getDrawBox(absolute);
        this._box.path = this.getPathBox();
        return this._box;
    },

    /**
     * Get the draw box with absolute position or relative to the parent entity
     * @param  {bool} absolute If true, just get entity x and y. If false, get the position relative to the parent
     * @return {object} Result {x, y, width, height}
     */
    getDrawBox: function(absolute) {
        var position = this.getPosition(absolute);

        return {
            x: position.x,
            y: position.y,
            width: this.width + this.lineWidth,
            height: this.height + this.lineWidth,
        };
    },

    getPathBox: function() {
        return {
            x: this._box.draw.x + this.lineWidth / 2,
            y: this._box.draw.y + this.lineWidth / 2,
            width: this.width,
            height: this.height
        };
    },

    canDrawPath: function(context) {
        return true;
    },

    drawPath: function(context) {
        context.beginPath();
    },

    canDrawLine: function(context) {
        return this.lineWidth > 0 && this.lineColor != '' && this.lineAlpha > 0;
    },

    drawLine: function(context) {
        this.drawAlpha(context, 'line');
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.stroke();
    },

    canDrawFill: function(context) {
        return this.fillColor != '' && this.fillAlpha > 0;
    },

    drawFill: function(context) {
        this.drawAlpha(context, 'fill');
        context.fillStyle = this.fillColor;
        context.fill();
    },

    drawRender: function(context) {
        if (this.canDrawPath(context))
        {
            this.drawPath(context);
            if (this.canDrawFill(context)) this.drawFill(context);
            if (this.canDrawLine(context)) this.drawLine(context);
        }
    },


    /**
     * Update the canvas for the prerender
     */
    prerenderUpdate: function() {
        this._box = this.getBox(this.prerenderCanvas.context);

        // save original coordinates
        var drawX = this._box.draw.x,
            drawY = this._box.draw.y,
            pathX = this._box.path.x,
            pathY = this._box.path.y;
        
        this._box.draw.x = 0;
        this._box.draw.y = 0;
        this._box.path.x = this.lineWidth / 2;
        this._box.path.y = this.lineWidth / 2;

        this.prerenderCanvas.width = this._box.draw.width;
        this.prerenderCanvas.height = this._box.draw.height;

        this.drawRender(this.prerenderCanvas.context);

        // set original coordinates
        this._box.draw.x = drawX;
        this._box.draw.y = drawY;
        this._box.path.x = pathX;
        this._box.path.y = pathY;
    },

    /**
     * Draw the pre-render on a canvas context
     */
    prerenderUse: function(context) {

        // check if image outside canvas
        if (this._box.draw.x > context.canvas.clientWidth 
            || this._box.draw.y > context.canvas.clientHeight 
            || this._box.draw.x + this._box.draw.width < 0
            || this._box.draw.y + this._box.draw.height < 0)
            return false;

        this.getContextBox(context, this.prerenderCanvas);

        // check if the contextDrawBox is flat
        if (this._box.context.width <= 0
            || this._box.context.height <= 0)
            return false;

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

});
