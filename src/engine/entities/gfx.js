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
            if (obj.prerender) obj._changed = true;
        });

        if (this.prerender) {
            this.prerenderInit();
        }

        return true;
    },

    ///////////////////////////// Pre-render functions /////////////////////////////

    /**
     * Init the pre-render of the gfx
     */
    prerenderInit: function() {
        //console.log('prerenderInit');
        this.prerenderCreate();
    },

    /**
     * Create the canvas for the pre-render
     */
    prerenderCreate: function() {
        this.prerenderCanvas = yespix.document.createElement('canvas');
        this.prerenderCanvas.context = this.prerenderCanvas.getContext('2d');

        this.prerenderUpdate();
    },

    /**
     * Update the canvas for the prerender
     */
    prerenderUpdate: function() {

        var drawBox = this.getDrawBox();

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

    ///////////////////////////////// Main functions ////////////////////////////////

    getPosition: function(relative) {
        if (relative || !this._parent) {
            return {
                x: this.x,
                y: this.y
            };
        } else {
            var position = this._parent.getPosition();
            //if (yespix.frame < 100) console.log('getPosition :: absolute position x=' + (this.x + position.x) + ', y=' + (this.y + position.y));
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

    getDrawBox: function(relative, context) {
        var position = this.getPosition(relative);

        return {
            x: position.x,
            y: position.y,
            width: this.width,
            height: this.height,
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
            o_x: box.x,
            o_y: box.y,
            o_width: box.width,
            o_height: box.height
        };
    },

    getContextDrawBox: function(context, img, box) {
        
        var contextDrawBox = this.getContextDrawBoxDefault(context, img, box);
        
        // check if the whole image is inside canvas
        // as image here cant be entirely outside canvas
        if (box.x > 0 && box.x + box.width < context.canvas.clientWidth 
            && box.y > 0 && box.y + box.height < context.canvas.clientHeight )
            return contextDrawBox;

        // crop the image
        var scale_x = contextDrawBox.context_width / contextDrawBox.img_width;
        var scale_y = contextDrawBox.context_height / contextDrawBox.img_height;
        if (contextDrawBox.context_x < 0) {
            contextDrawBox.img_x = contextDrawBox.img_x - contextDrawBox.context_x / scale_x;
            contextDrawBox.img_width = contextDrawBox.img_width + contextDrawBox.context_x / scale_x;
            contextDrawBox.context_width = contextDrawBox.context_width + contextDrawBox.context_x;
            contextDrawBox.context_x = 0;
        }
        if (contextDrawBox.context_y < 0) {
            contextDrawBox.img_y = contextDrawBox.img_y - contextDrawBox.context_y / scale_y;
            contextDrawBox.img_height = contextDrawBox.img_height + contextDrawBox.context_y / scale_y;
            contextDrawBox.context_height = contextDrawBox.context_height + contextDrawBox.context_y;
            contextDrawBox.context_y = 0;
        }
        if (contextDrawBox.context_x + contextDrawBox.context_width > context.canvas.clientWidth) {
            var delta = contextDrawBox.context_x + contextDrawBox.context_width - context.canvas.clientWidth;
            contextDrawBox.img_width = contextDrawBox.img_width - delta / scale_x;
            contextDrawBox.context_width = contextDrawBox.context_width - delta;
        }
        if (contextDrawBox.context_y + contextDrawBox.context_height > context.canvas.clientHeight) {
            var delta = contextDrawBox.context_y + contextDrawBox.context_height - context.canvas.clientHeight;
            contextDrawBox.img_height = contextDrawBox.img_height - delta / scale_y;
            contextDrawBox.context_height = contextDrawBox.context_height - delta;
        }
        return contextDrawBox;
            
    },
    
    getContext: function() {
        if (this._context) return this._context;
        var canvas = yespix.find('.canvas')[0];
        if (canvas) this._context = canvas.context;
        return this._context;
    },

    draw: function() {
        if (!this.isVisible) return;

        var context = this.getContext();

        if (this.prerender && this.prerenderCanvas && this.prerenderCanvas.width > 0) {
            if (this._changed){
                this.prerenderUpdate();
                this._changed = false;
            }
            this.prerenderUse(context);
            if (this.debug) {
                this.drawDebug(context, this.getDrawBox());
            }
            return true;
        }

        if (context) {
            var box = this.getDrawBox();
            var getContextDrawBox = this.getContextDrawBox(context, { realWidth: this.width, realHeight: this.height}, box);
            this.drawRender(context, getContextDrawBox);
            if (this.debug) {
                this.drawDebug(context, box);
            }
        }
    },

    /**
     * 
     */
    drawRender: function(context, contextDrawBox, img) {
    },


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

    canDrawDebug: function(context, box) {
        return this.debug;
    },

    canDrawDebugPosition: function(context, box) {
        return yespix.isFunction(this.drawDebugPosition) && this.debugPosition;
    },

    canDrawDebugImage: function(context, box) {
        return yespix.isFunction(this.drawDebugImage) && this.debugImage;
    },

    canDrawDebugCollision: function(context, box) {
        return yespix.isFunction(this.drawDebugCollision) && this.debugCollision;
    },

    canDrawDebugMove: function(context, box) {
        return yespix.isFunction(this.drawDebugMove) && this.debugMove;
    },

    drawDebug: function(context, box) {
        this.drawAlpha(context, 'debug', true);
        if (this.canDrawDebugPosition(context, box)) this.drawDebugPosition(context, box);
        if (this.canDrawDebugImage(context, box)) this.drawDebugImage(context, box);
        if (this.canDrawDebugCollision(context, box)) this.drawDebugCollision(context, box);
        if (this.canDrawDebugMove(context, box)) this.drawDebugMove(context, box);
    },

    drawDebugPosition: function(context, box) {
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
