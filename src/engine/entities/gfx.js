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
        context.strokeStyle = "#ff1111";
        context.strokeRect(box.x - 0.5, box.y - 0.5, box.width + 1, box.height + 1);
        console.log(box);
    },

});
