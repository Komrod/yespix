
yespix.define('move', {
    speedX: 0,
    speedY: 0,
    accelX: 0,
    accelY: 0,
    moveFriction: 0.05,
    
    applyGravity: false,
    
    moveStop: function() {
        this.speedX = this.speedY = this.accelX = this.accelY = 0;
    },


    init: function() {
        yespix.on('enterFrame', this.move, this, yespix);
    },

    move: function() {
        if (this.applyGravity && yespix.gravity) this.applyGravity();
        this.speedX += this.accelX;
        this.speedY += this.accelY;
        this.speedX *= 1 - this.moveFriction;
        this.speedY *= 1 - this.moveFriction;
        if (yespix.level) yespix.level.collision(this);
        this.x += this.speedX;
        this.y += this.speedY;
    },

    applyGravity: function() {
        /*
				if (!this.isOnGround && yespix.gravity) {
					console.log('this.isOnGround = '+this.isOnGround+', apply gravity')
					if (yespix.gravity.x) this.accelX += yespix.gravity.x / 20;
					if (yespix.gravity.y) this.accelY += yespix.gravity.y / 20;
				}
				*/
    },

});
