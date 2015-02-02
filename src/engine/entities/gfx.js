/**
 * @class entity.gfx
 */
yespix.define('gfx', {

    _changed: false,
    
    isReady: false,
    isVisible: true,
    snapToPixel: false,

    x: 0,
    y: 0,
    z: 0,
    zGlobal: 0,

    alpha: 1,
    rotation: 0,

    _flipX: false,
    _flipY: false,

    /**
     * Stores all the boxes (draw, context, img ...)
     * @type {Boolean|object}
     */
    _box: false,

    debugAlpha: 1.0,

    debugPosition: true,
    debugImage: true,
    debugCollision: true,
    debugMove: true,

    prerender: false,
    prerenderCanvas: false,


    asset: function() {
        return [];
    },

    // initilize entity
    init: function() {

        yespix.listen(this, ['z', 'zGlobal'], function(obj, e) {
            yespix.drawEntitiesSort = true;
        });
        yespix.listen(this, ['prerender', 'alpha', '_flipX', '_flipY'], function(obj, e) {
            obj._changed = true;
        });

        if (this.prerender) {
            this.prerenderInit();
        }

        return true;
    },

    
    ///////////////////////////// Pre-render functions /////////////////////////////
    
    // Render entity on a canvas and only draw canvas to save time
    // Only enable it when the drawRender function is long (for path ...)
    

    /**
     * Init the pre-render of the gfx
     */
    prerenderInit: function() {
        this.prerenderCreate();
        this.prerenderUpdate();
    },

    /**
     * Create the canvas for the pre-render
     */
    prerenderCreate: function() {
        this.prerenderCanvas = yespix.document.createElement('canvas');
        this.prerenderCanvas.context = this.prerenderCanvas.getContext('2d');
    },

    /**
     * Update the canvas for the prerender
     */
    prerenderUpdate: function() {

        var box = this.getDrawBox();

        //console.log('prerenderUpdate :: drawBox = ');
        //console.log(drawBox);

        this.prerenderCanvas.width = drawBox.width;
        this.prerenderCanvas.height = drawBox.height;

        //console.log('prerenderUpdate :: this.prerenderCanvas = ');
        //console.log(this.prerenderCanvas);

        //console.log(drawBox);
        var contextDrawBox = {
            img_x: 0,
            img_y: 0,
            img_width: drawBox.width,
            img_height: drawBox.height,
            context_x: 0,
            context_y: 0,
            context_width: drawBox.width,
            context_height: drawBox.height,
            o_x: 0,
            o_y: 0,
            o_width: drawBox.width,
            o_height: drawBox.height
            };
        
        //this.prerenderCanvas.context.fillStyle = '#ff0000';
        //this.prerenderCanvas.context.fillRect(0,0,200,200);
        //console.log('prerenderUpdate :: contextDrawBox = ');
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
        
        //console.log('prerenderUse :: contextDrawBox = ');
        //console.log(contextDrawBox);

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

    ///////////////////////////////// Box functions ////////////////////////////////

    /*
    box: {
        type: _class,
        draw: {x, y, width, height},
        path: {x, y, width, height},
        context: {x, y, width, height},
        img: {x, y, width, height},
    }
    */

    /**
     * Get the position and width in an object. In this object, it will be added later some other coordinates (path, context ...)
     * @param  {bool} absolute If true, just get entity x and y. If false, get the position relative to the parent
     * @return {object} Result {_type: "class", draw: {x, y, width, height}}
     */
    getBox: function(absolute) {
        var box = {
            type: this._class
        };
        box.draw = this.getDrawBox(absolute);
        return box;
    },

    /**
     * Get the position absolute or relative to the parent entity
     * @param  {bool} absolute If true, just get entity x and y. If false, get the position relative to the parent
     * @return {object} Result {x, y}
     */
    getPosition: function(absolute) {
        if (absolute || !this._parent) {
            return {
                x: this.x,
                y: this.y
            };
        } else {
            var position = this._parent.getPosition();
            if (position) return {
                x: this.x + position.x,
                y: this.y + position.y
            };
        }
        return {
            x: this.x,
            y: this.y
        };
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
            width: this.width,
            height: this.height,
        };
    },

    getContextBoxDefault: function(context, box) {
        
        return {
            x: box.draw.x,
            y: box.draw.y,
            width: box.draw.width,
            height: box.draw.height,
        };
    },

    getContextBox: function(context, box) {
        
        var contextBox = this.getContextBoxDefault(context, box);
        
        // check if the whole image is inside canvas
        // as image here cant be entirely outside canvas
        if (box.draw.x >= 0 && box.draw.x + box.draw.width < context.canvas.clientWidth 
            && box.draw.y >= 0 && box.draw.y + box.draw.height < context.canvas.clientHeight )
            return contextBox;

        if (contextBox.x < 0) {
            contextBox.width = contextBox.width + contextBox.x;
            contextBox.x = 0;
        }
        if (contextBox.y < 0) {
            contextBox.height = contextBox.height + contextBox.y;
            contextBox.y = 0;
        }
        if (contextBox.context_x + contextBox.context_width > context.canvas.clientWidth) {
            var delta = contextBox.x + contextBox.width - context.canvas.clientWidth;
            contextBox.context_width = contextBox.context_width - delta;
        }
        if (contextBox.context_y + contextBox.context_height > context.canvas.clientHeight) {
            var delta = contextBox.context_y + contextBox.context_height - context.canvas.clientHeight;
            contextBox.context_height = contextBox.context_height - delta;
        }

        /*
        // crop the image
        var scale_x = contextBox.context_width / contextBox.img_width;
        var scale_y = contextBox.context_height / contextBox.img_height;
        if (contextBox.context_x < 0) {
            contextBox.img_x = contextBox.img_x - contextBox.context_x / scale_x;
            contextBox.img_width = contextBox.img_width + contextBox.context_x / scale_x;
            contextBox.context_width = contextBox.context_width + contextBox.context_x;
            contextBox.context_x = 0;
        }
        if (contextBox.context_y < 0) {
            contextBox.img_y = contextBox.img_y - contextBox.context_y / scale_y;
            contextBox.img_height = contextBox.img_height + contextBox.context_y / scale_y;
            contextBox.context_height = contextBox.context_height + contextBox.context_y;
            contextBox.context_y = 0;
        }
        if (contextBox.context_x + contextBox.context_width > context.canvas.clientWidth) {
            var delta = contextBox.context_x + contextBox.context_width - context.canvas.clientWidth;
            contextBox.img_width = contextBox.img_width - delta / scale_x;
            contextBox.context_width = contextBox.context_width - delta;
        }
        if (contextBox.context_y + contextBox.context_height > context.canvas.clientHeight) {
            var delta = contextBox.context_y + contextBox.context_height - context.canvas.clientHeight;
            contextBox.img_height = contextBox.img_height - delta / scale_y;
            contextBox.context_height = contextBox.context_height - delta;
        }
        */
        return contextBox;
            
    },
    

    ///////////////////////////////// Main draw functions ////////////////////////////////


    /**
     * Try to draw the gfx entity on a canvas
     * @return {bool} True if drawn
     */
    draw: function(context) {

        // get the context
        context = context || yespix.context;

        // if cannot draw, exit now
        if (!this.canDraw()) return this.drawExit(false);

        // reset _box
        this._box = false;

        // pre render on canvas
        if (this.prerender && this.prerenderCanvas && this.prerenderCanvas.width > 0) {

            // if changed, update the pre render canvas
            if (this._changed) this.prerenderUpdate(context);

            // use the pre render canvas
            this.prerenderUse(context);

            // draw debug
            if (this.debug) this.drawDebug(context);

            // exit
            return this.drawExit(true);
        }

        // get the draw box
        this._box = this.getBox(context);

        // if cannot draw from this draw box
        if (!this.canDrawBox(context)) return this.drawExit(false);

        // get the context box
        this._box.context = this.getContextBox(context);

        this.drawRender(context, getContextBox);

        // draw debug
        if (this.debug) this.drawDebug(context, box);

        // exit
        return this.drawExit(true);
    },

    /**
     * Function called at the end of draw function
     * @param {bool} isDrawn True if the entity was just drawn on this frame
     */
    drawExit: function(isDrawn) {
        this._changed = false;
        return isDrawn;
    },

    /**
     * Returns true if the entity can be drawn, get this information from basic properties of the entity
     * @return {bool} True if can be drawn
     */
    canDraw: function(context) {
        if (!this.isActive 
            || !this.isVisible 
            || this.alpha <= 0
            || !context) 
            return false;

        return true;
    },


    /**
     * Return true if the entity can be drawn on context, get this information from the box coordinates.
     * @return {bool} True if can be drawn
     */
    canDrawBox: function(context) {
        
        if (this._box.draw.x > context.width
            || this._box.draw.y > context.height
            || this._box.draw.x + this._box.draw.width < 0
            || this._box.draw.y + this._box.draw.height < 0
            )
            return false;
        return true;
    },


    /**
     * Render the entity on the context with coordinates from the box
     * @param {object} context Context object
     * @param {object} box Box object with the coordinates
     */
    drawRender: function(context, box) {
        // Empty. Child entities must provide the code
    },

    /**
     * set the alpha for a type of content in the context
     * @param  {object} context
     * @param  {string} type Type ("line", "fill" ...)
     * @param  {bool} doNotUseGlobal 
     */
    drawAlpha: function(context, type, doNotUseGlobal) {
        if (!type) {
            context.globalAlpha = this.alpha;
        } else {
            if (!this[type + 'Alpha'])
            {
                context.globalAlpha = 0;
            } else if (doNotUseGlobal)
            {
                context.globalAlpha = this[type + 'Alpha'];
            } else 
            {
                context.globalAlpha = this.alpha * this[type + 'Alpha'];
            }
        }
    },


    ///////////////////////////////// Debug functions ////////////////////////////////


    canDrawDebug: function(context) {
        return this.debug;
    },

    canDrawDebugPosition: function(context) {
        return yespix.isFunction(this.drawDebugPosition) && this.debugPosition;
    },

    canDrawDebugImage: function(context) {
        return yespix.isFunction(this.drawDebugImage) && this.debugImage;
    },

    canDrawDebugCollision: function(context) {
        return yespix.isFunction(this.drawDebugCollision) && this.debugCollision;
    },

    canDrawDebugMove: function(context) {
        return yespix.isFunction(this.drawDebugMove) && this.debugMove;
    },

    drawDebug: function(context) {
        this.drawAlpha(context, 'debug', true);
        if (this.canDrawDebugPosition(context)) this.drawDebugPosition(context);
        if (this.canDrawDebugImage(context)) this.drawDebugImage(context);
        if (this.canDrawDebugCollision(context)) this.drawDebugCollision(context);
        if (this.canDrawDebugMove(context)) this.drawDebugMove(context);
    },

    drawDebugPosition: function(context) {

        var box = this._box.draw;
        
        context.lineWidth = 0.5;
        context.strokeStyle = "#cc3333";
        context.strokeRect(box.x - 0.5, box.y - 0.5, box.width + 1, box.height + 1);

        context.strokeStyle = "#ff0000";
        context.beginPath();
        context.moveTo(box.x - 2, box.y - 2);
        context.lineTo(box.x + 2, box.y + 2);
        context.stroke();
        context.moveTo(box.x + 2, box.y - 2);
        context.lineTo(box.x - 2, box.y + 2);
        context.stroke();
    },

});
