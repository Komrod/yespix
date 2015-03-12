/**
 * @class entity.gfx
 */
yespix.define('gfx', {
    inheritClass: 'base',

    position: null,

    init: function(options) {
        this.super(options);

        this.position = new Position(this.options.position);
    }

});

