

yespix.define('actor', {

    init: function(options) {
        options = options || {};
        this.actor = new Actor(this.collision, this);
        this.collision = new Collision(this.collision, this);
    },
});

