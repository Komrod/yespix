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

    ///////////////////////////////// Main functions ////////////////////////////////

    asset: function() {
        return [];
    },

    // initilize object
    init: function() {

        yespix.listen(this, ['z', 'zGlobal'], function(obj, e) {
            yespix.drawEntitiesSort = true;
        });

        return true;
    },

    getDrawBox: function() {
        if (this.snapToPixel) {
            var x = parseInt(this.x);
            var y = parseInt(this.y);
        } else {
            var x = this.x;
            var y = this.y;
        }
        var width = this.width;
        var height = this.height;

        if (this.typeof('image')) {
            var img = this.image(this.imageSelected);
            width = this.width || img.width || img.realWidth;
            height = this.height || img.height || img.realHeight;
        } else if (this.typeof('anim')) {
            var img = this.image(this.imageSelected);
            width = this.width || img.width || img.realWidth;
            height = this.height || img.height || img.realHeight;
        }

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    },

    getContext: function() {
        if (this._context) return this._context;
        if (this._parent == null) {
            var canvas = yespix.find('.canvas')[0];
            if (!this._context && canvas) this._context = canvas.context;
        }
        return this._context;
    },

});
