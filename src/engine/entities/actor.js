yespix.define('actor', 'anim, move, collision', {

    isAttacking: false,
    isFalling: false,
    isJumping: false,
    isOnGround: false,

    actorMove: {},
    actorSpeed: 2,
    actorSpeedMin: 0.05,
    actorDirection: '',
    actorAnims: {},
    actorInit: function(options) {},
    init: function() {},

    applyFriction: function() {
        this.speedX *= (1 - this.moveFriction);
        this.speedY *= (1 - this.moveFriction);
        if (this.speedX < this.actorSpeedMin && this.speedX > -this.actorSpeedMin) this.speedX = 0;
        if (this.speedY < this.actorSpeedMin && this.speedY > -this.actorSpeedMin) this.speedY = 0;
    }
});
