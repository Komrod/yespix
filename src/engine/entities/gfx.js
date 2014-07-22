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

    debugAlpha: 1,

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

    drawAlpha: function(context, type) {
        if (!type) {
            context.globalAlpha = this.alpha;
        } else {
            if (!this[type + 'Alpha']) context.globalAlpha = 0;
            else context.globalAlpha = this.alpha * this[type + 'Alpha'];
        }
    },

    canDrawDebug: function() {
        return this.debug;
    },

    drawDebug: function(context, box) {
        this.drawAlpha(context, 'debug');
        if (yespix.isFunction(this.drawDebugPosition)) this.drawDebugPosition(context, box);
        if (yespix.isFunction(this.drawDebugImage)) this.drawDebugImage(context, box);
        if (yespix.isFunction(this.drawDebugCollision)) this.drawDebugCollision(context, box);
        if (yespix.isFunction(this.drawDebugMove)) this.drawDebugMove(context, box);
    },

    drawDebugPosition: function(context, drawBox) {
        var box = drawBox || this.getDrawBox();
        context.lineWidth = 0.5;
        context.strokeStyle = "#ff1111";
        context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width + 1 * scaleX, box.height + 1 * scaleY);
    },

});
