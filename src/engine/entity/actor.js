

yespix.define('actor', {

    inheritClass: 'base',

    init: function(options) {
        options = options || {};
        this.super(options);
        this.actor = new Actor(this.collision, this);
        this.collision = new Collision(this.collision, this);
    },

});

