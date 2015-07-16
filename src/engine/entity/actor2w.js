

yespix.define('actor2w', {


    inheritClass: 'actor',


    init: function(options, entity) {
        this.super(options, entity);

        this.speedWalk = this.speedWalk || 6;
        this.speedJump = this.speedJump || 8;
        this.speedUp = this.speedUp || 0.25;
        this.speedAir = this.speedAir || 3;
        this.speedXMax = this.speedXMax || 2;
        this.speedYMax = this.speedYMax || 4;

        this.frictionAir = this.frictionAir || 0;
        this.frictionGround = this.frictionGround || 0.2;
        this.frictionIdle = this.frictionIdle || 1;
    },


    prepare: function() {
        this.isIdle = true;

        if (input.key('right')) {
            if (this.isOnGround) {
                this.walkRight();
            } else {
                this.airMoveRight();
            }
        } else if (input.key('left')) {
            if (this.isOnGround) {
                this.walkLeft();
            } else {
                this.airMoveLeft();
            }
        }

        var vel = this.entity.collision.body.GetLinearVelocity();
        if (Math.abs(vel.x) > this.speedXMax || Math.abs(vel.y) > this.speedYMax) {
            if (Math.abs(vel.x) > this.speedXMax) {            
                vel.x = (vel.x > 0 ? 1 : -1) * this.speedXMax;
            }
            if (Math.abs(vel.y) > this.speedYMax) {
                vel.y = (vel.y > 0 ? 1 : -1) * this.speedYMax;
            }
            this.entity.collision.body.SetLinearVelocity(vel);
        }

        if (input.key('up')) {
            if (this.isOnGround) {
                this.jump();
            } else {
                this.airMoveUp();
            }
        }

        if (this.isOnGround) {
            if (this.isIdle) {
                this.entity.collision.setFriction(this.frictionIdle);
            } else {
                this.entity.collision.setFriction(this.frictionGround);
            }
        } else {
            if (this.isIdle) {
                this.entity.collision.setFriction(this.frictionAir);
            } else {
                this.entity.collision.setFriction(this.frictionAir);
            }
        }

        this.super();
    },


    jump: function() {
        if (!this.isOnGround) {
            return false;
        }
        var vel = this.entity.collision.body.GetLinearVelocity();
        vel.y = 0;
        this.entity.collision.body.SetLinearVelocity(vel);

        this.isIdle = false;
        this.entity.collision.impulse(-90, this.speedJump);
    },


    walkLeft: function () {
        if (!this.isOnGround || !this.entity.collision) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(180, this.speedWalk);
    },


    walkRight: function () {
        if (!this.isOnGround || !this.entity.collision) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(0, this.speedWalk);
    },


    airMoveUp: function () {
        if (this.isOnGround || !this.entity.collision) {
            return false;
        }
        var vel = this.entity.collision.body.GetLinearVelocity();
        if (vel.y>-2) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(-90, this.speedUp);
    },

    airMoveLeft: function () {
        if (this.isOnGround || !this.entity.collision) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(180, this.speedAir);
    },


    airMoveRight: function () {
        if (this.isOnGround || !this.entity.collision) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(0, this.speedAir);
    },


    createPhysics: function(collision) {
        if (!this.listener) {
            this.listener = collision.engine.getListener();
            if (!this.listener) {
                this.listener = collision.engine.createListener();
            }
        }
        collision.userData = {collision: collision, entity: this.entity, type: 'body'};
        var body = collision.engine.create(collision);
        if (this.listener) {
            var size = collision.getSize();
            collision.engine.createFixture(0, size.height / 2, size.width * 0.8, 5, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'ground'}}, body);
            collision.engine.createFixture(0, -size.height / 2, size.width * 0.8, 5, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'ceil'}}, body);
            collision.engine.createFixture(-size.width / 2, 0, 5, size.height * 0.8, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'wallLeft'}}, body);
            collision.engine.createFixture(size.width / 2, 0, 5, size.height * 0.8, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'wallRight'}}, body);
        }
        return body;
    },


    actorBeginContact: function(contact, myFixture, otherBody, otherFixture) {
        var myData = myFixture.GetUserData();
        if (myData && myData.type == 'ground') {
            this.isOnGround = true;
            
            var vel = this.entity.collision.body.GetLinearVelocity();
            vel.y = 0;
            this.entity.collision.body.SetLinearVelocity(vel);
        }
    },


    actorEndContact: function(contact, myFixture, otherBody, otherFixture) {
        var myData = myFixture.GetUserData();
        if (myData && myData.type == 'ground') {
            this.isOnGround = false;
        }
    },

});
