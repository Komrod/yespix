/**
 * @class entity.gfx
 */
yespix.define('gfx', {

    _changed: false,
    
    /**
     * True when the entity is ready to be drawn (usually when all assets are loaded)
     * @type {Boolean}
     */
    isReady: false,

    /**
     * True if the entity must be drawn
     * @type {Boolean}
     */
    isVisible: true,

    /**
     * True if the x/y position values must be rounded to nearest integer
     * @type {Boolean}
     */
    snapToPixel: false,

    /**
     * X position of the gfx.
     * You should use the getPosition function to get the correct position relative to parent
     * @type {Number}
     */
    x: 0,

    /**
     * Y position of the gfx.
     * You should use the getPosition function to get the correct position relative to parent
     * @type {Number}
     */
    y: 0,

    /**
     * Z index of the gfx. A higher Z index means the gfx will be drawn at the top
     * @type {Number}
     */
    z: 0,
    zGlobal: 0,

    /**
     * Alpha render of the gfx from 0.0 to 1.0
     * @type {Number}
     */
    alpha: 1,
    
    /**
     * @TODO
     * @type {Number}
     */
    rotation: 0,

    /**
     * Stores all the boxes (draw, context, img ...)
     * @type {Boolean|object}
     */
    _box: false,


    /**
     * Alpha of the debug informations draw on screen, if debug is true
     * @type {Number}
     */
    debugAlpha: 1.0,

    debugPosition: true,
    debugImage: true,
    debugCollision: true,
    debugMove: true,

    /**
     * Use pre render on a canvas if True. Can improve speed fot path entity and others
     * @type {Boolean}
     */
    prerender: false,

    /**
     * Store the canvas where the gfx is draw to use it every frame without rewriting it
     * @type {Boolean}
     */
    prerenderCanvas: false,

    /**
     * Return the files assets
     * @return {array} Array of string path to the files
     */
    asset: function() {
        return [];
    },

    /**
     * initilize entity
     */
    init: function() {

        yespix.listen(this, ['z', 'zGlobal'], function(obj, e) {
            // @todo use an event
            yespix.drawEntitiesSort = true;
        });
        yespix.listen(this, ['prerender', 'alpha'], function(obj, e) {
            // @todo use an event
            obj._changed = true;
        });

        if (this.prerender) {
            this.prerenderInit();
        }

        return true;
    },

    
    ///////////////////////////// Pre-render functions /////////////////////////////
    
    // Render entity on a canvas and only draw this canvas to save time
    // Only enable it when the drawRender function is long (for path entities ...)
    

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
        this._box = this.getBox(this.prerenderCanvas.context);

        // save original coordinates
        var drawX = this._box.draw.x,
            drawY = this._box.draw.y;
        this._box.draw.x = 0;
        this._box.draw.y = 0;

        this.prerenderCanvas.width = this._box.draw.width;
        this.prerenderCanvas.height = this._box.draw.height;

        this.drawRender(this.prerenderCanvas.context);

        // set original coordinates
        this._box.draw.x = drawX;
        this._box.draw.y = drawY;
    },

    /**
     * Draw the pre-render on a canvas context
     */
    prerenderUse: function(context) {
        var box = this.getDrawBox(false, context);
        
        //console.log('prerenderUse :: drawBox = ');
        //console.log(box);

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
     * Get the position and width/height of an entity and return an object. In this object, it will be added 
     * later some other coordinates (path, context ...)
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
     * Get the draw box with absolute position or relative to the parent entity
     * @param  {bool} absolute If true, just get entity x and y. If false, get the position relative to the parent
     * @return {object} Result {x, y, width, height}
     */
    getDrawBox: function(absolute) {
        var position = this.getPosition(absolute);
        return {
            x: position.x,
            y: position.y,
            width: this.width * this.imageScale,
            height: this.height * this.imageScale
        };
    },

    /**
     * Get the position absolute or relative to the parent entity
     * @param  {bool} absolute If true, just get entity x and y. If false, get the position relative to the parent
     * @return {object} Result {x, y}
     */
    getPosition: function(absolute) {
        var x = this.x, y = this.y;

        if (this.snapToPixel) {
            x = parseInt(x);
            y = parseInt(y);
        }
        if (absolute || !this._parent) {
            return {
                x: x,
                y: y
            };
        } else {
            var position = this._parent.getPosition();
            if (position) return {
                x: x + position.x,
                y: y + position.y
            };
        }
        return {
            x: x,
            y: y
        };
    },

    getContextBoxDefault: function(context) {
        return {
            x: this._box.draw.x,
            y: this._box.draw.y,
            width: this._box.draw.width,
            height: this._box.draw.height,
        };
    },

    getContextBox: function(context, img) {

        this._box.context = this.getContextBoxDefault();

        if (img) {
            this._box.img = {
                x: img.x,
                y: img.y,
                width: (img.realWidth ? img.realWidth : img.width) * this.imageScale,
                height: (img.realHeight ? img.realHeight : img.height) * this.imageScale,    
            }
        }

        // check if the whole draw box is inside canvas, as here it cant be entirely outside canvas
        if (this._box.draw.x >= 0 && this._box.draw.x + this._box.draw.width < context.canvas.clientWidth 
            && this._box.draw.y >= 0 && this._box.draw.y + this._box.draw.height < context.canvas.clientHeight )
        {
            // flip horizontally
            if (this.flipX) {
                this._box.context.x = -this._box.context.x - this._box.context.width;
            }

            // flip vertically
            if (this.flipY) {
                this._box.context.y = -this._box.context.y - this._box.context.height;
            }

            return this._box.context;
        }

        // get the correct width and height of what will be drawn (usually an image)
        if (img) {
            var scaleX = this._box.context.width / this._box.img.width;
            var scaleY = this._box.context.height / this._box.img.height;
        }

        // crop the left
        if (this._box.context.x < 0) {
            if (img) {
                this._box.img.x = this._box.img.x - this._box.context.x / scaleX;
                this._box.img.width = this._box.img.width + this._box.context.x / scaleX;
            }
            this._box.context.width = this._box.context.width + this._box.context.x;
            this._box.context.x = 0;
        }

        // crop the top
        if (this._box.context.y < 0) {
            if (img) {
                this._box.img.y = this._box.img.y - this._box.context.y / scaleY;
                this._box.img.height = this._box.img.height + this._box.context.y / scaleY;
        }
            this._box.context.height = this._box.context.height + this._box.context.y;
            this._box.context.y = 0;
        }

        // crop the right
        if (this._box.context.x + this._box.context.width > context.canvas.clientWidth) {
            var delta = this._box.context.x + this._box.context.width - context.canvas.clientWidth;
            if (img) this._box.img.width = this._box.img.width - delta / scaleX;
            this._box.context.width = this._box.context.width - delta;
        }

        // crop the bottom
        if (this._box.context.y + this._box.context.height > context.canvas.clientHeight) {
            var delta = this._box.context.y + this._box.context.height - context.canvas.clientHeight;
            if (img) this._box.img.height = this._box.img.height - delta / scaleY;
            this._box.context.height = this._box.context.height - delta;
        }

        // flip horizontally
        if (this.flipX) {
            if (this._box.draw.width > 0) {
                this._box.context.x = -this._box.context.x - this._box.context.width;
                if (img) {
                    if (this._box.img.x == 0) this._box.img.x = this._box.draw.width - this._box.context.width;
                    else this._box.img.x = 0;
                }
            }
        }

        // flip vertically
        if (this.flipY) {
            if (this._box.draw.height > 0) {
                this._box.context.y = -this._box.context.y - this._box.context.height;
                if (img) {
                    if (this._box.img.y == 0) this._box.img.y = this._box.draw.height - this._box.context.height;
                    else this._box.img.y = 0;
                }
            }
        }
        //console.log(this._box.context);
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
        if (!this.canDraw(context)) return this.drawExit(false);

        // get the draw box
        this._box = this.getBox(context);

        // if cannot draw from this draw box
        if (!this.canDrawBox(context)) return this.drawExit(false);

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

        this.drawRender(context);

        // draw debug
        if (this.debug) this.drawDebug(context);

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
    drawRender: function(context) {
        // Empty. 
        // Child entities must provide the code to draw something on the 2d context
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
