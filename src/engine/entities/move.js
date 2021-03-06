yespix.define('move', {
    speedX: 0,
    speedY: 0,
    accelX: 0,
    accelY: 0,
    moveFriction: 0.05,

    canApplyGravity: true,

    moveStop: function() {
        this.speedX = this.speedY = this.accelX = this.accelY = 0;
    },


    init: function() {
        yespix.on('enterFrame', this.move, this, yespix);
    },

    moveTo: function(x, y) {
        if (isNaN(x) || isNaN(y)) return false;

        // move children
        var deltaX = x - this.x,
            deltaY = y - this.y;

        //this.moveChildren(deltaX, deltaY);

        // move entity
        this.x = x;
        this.y = y;
    },

    move: function() {
        this.trigger('moveStart', {
            entity: this
        });

        // apply gravity
        if (this.canApplyGravity && yespix.gravity) this.applyGravity();

        // apply acceleration
        this.speedX += this.accelX;
        this.speedY += this.accelY;

        // apply friction
        this.speedX *= 1 - this.moveFriction;
        this.speedY *= 1 - this.moveFriction;

        // apply level collision
        if (yespix.level) yespix.level.collision(this);

        // apply speed
        this.x += this.speedX;
        this.y += this.speedY;

        // move children
        //this.moveChildren(this.speedX, this.speedY);

        this.trigger('moveEnd', {
            entity: this
        });
    },

    /*
    moveChildren: function(deltaX, deltaY) {
        var count = 0;
        if (this._children) count = this._children.length;
        if (!this._children || this._children.length == 0) return false;

        var t = 0,
            length = this._children.length;

        for (; t < length; t++) {
            if (this._children[t].isActive) {
                if (yespix.key('a')) console.log('moveChildren :: move children t=' + t + ', name=' + this._children[t].name);
                this._children[t].x += deltaX;
                this._children[t].y += deltaY;
            }
        }
    },
    */
    applyGravity: function() {
        if (!yespix.gravity) return false;
        if (!this.isOnGround && yespix.gravity) {
            if (yespix.gravity.x) this.speedX += yespix.gravity.x / 20;
            if (yespix.gravity.y) this.speedY += yespix.gravity.y / 20;
        }
    },

});
