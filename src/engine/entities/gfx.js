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



    ///////////////////////////////// Main functions ////////////////////////////////

    asset: function() {
        return [];
    },

    // initilize entity
    init: function() {

        yespix.listen(this, ['z', 'zGlobal'], function(obj, e) {
            yespix.drawEntitiesSort = true;
        });

        return true;
    },

    getPosition: function(relative) {
        if (relative || !this._parent) {
            return {
                x: this.x,
                y: this.y
            };
        } else {
            var position = this._parent.getPosition();
            if (yespix.frame < 100) console.log('getPosition :: absolute position x=' + (this.x + position.x) + ', y=' + (this.y + position.y));
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

    getDrawBox: function(relative) {
        var position = this.getPosition(relative);

        return {
            x: position.x,
            y: position.y,
            width: this.width,
            height: this.height,
            type: this._class
        };
    },

    getContextDrawBox: function(context, img, box) {
        
        var contextDrawBox = {
            img_x: 0,
            img_y: 0,
            img_width: img.realWidth,
            img_height: img.realHeight,
            context_x: box.x,
            context_y: box.y,
            context_width: box.width,
            context_height: box.height
        };

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
        if (this.canDrawDebug()) this.drawDebug();
    },

    drawAlpha: function(context, type, doNotUseGlobal) {
        if (!type) {
            context.globalAlpha = this.alpha;
        } else {
            if (!this[type + 'Alpha']) context.globalAlpha = 0;
            else if (doNotUseGlobal) context.globalAlpha = this[type + 'Alpha'];
            else context.globalAlpha = this.alpha * this[type + 'Alpha'];
        }
    },

    canDrawDebug: function() {
        return this.debug;
    },

    canDrawDebugPosition: function() {
        return yespix.isFunction(this.drawDebugPosition) && this.debugPosition;
    },

    canDrawDebugImage: function() {
        return yespix.isFunction(this.drawDebugImage) && this.debugImage;
    },

    canDrawDebugCollision: function() {
        return yespix.isFunction(this.drawDebugCollision) && this.debugCollision;
    },

    canDrawDebugMove: function() {
        return yespix.isFunction(this.drawDebugMove) && this.debugMove;
    },

    drawDebug: function(context, box) {
        this.drawAlpha(context, 'debug', true);
        if (this.canDrawDebugPosition()) this.drawDebugPosition(context, box);
        if (this.canDrawDebugImage()) this.drawDebugImage(context, box);
        if (this.canDrawDebugCollision()) this.drawDebugCollision(context, box);
        if (this.canDrawDebugMove()) this.drawDebugMove(context, box);
    },

    drawDebugPosition: function(context, drawBox) {
        var box = drawBox || this.getDrawBox();
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
