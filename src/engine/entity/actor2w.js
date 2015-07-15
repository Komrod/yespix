

yespix.define('actor2w', {

    inheritClass: 'actor',

    init: function(options, entity) {
        this.super(options, entity);

        this.speedWalk = this.speedWalk || 100;
        this.speedJump = this.speedJump || 400;
        this.speedAir = this.speedAir || 1;


    },

    bind: function(key, fct) {

    },

    prepare: function() {
        if (input.key('right')) {
            this.walkRight();
        } else if (input.key('left')) {
            this.walkLeft();
        }

        this.super();
    },


    jump: function() {

    },

    walkLeft: function () {
        return this.walk(true);
    },

    walkRight: function () {
        return this.walk(false);
    },

    walk: function(left) {
        left = left || false;
        if (!this.entity.collision) {
            return false;
        }
        //if (this.isOnGround) {
//console.log('actor2w:walk: impulse');
            this.entity.collision.impulse(0, this.speedWalk);
        //}
    },

});
