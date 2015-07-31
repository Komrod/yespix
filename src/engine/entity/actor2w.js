

yespix.define('actor2w', {


    inheritClass: 'actor',


    init: function(properties, entity) {
        this.super(properties, entity);

        if (yespix.isUndefined(this.speedWalk)) this.speedWalk = 0.4;
        if (yespix.isUndefined(this.speedJump)) this.speedJump = 6;
        if (yespix.isUndefined(this.speedUp)) this.speedUp = 0.2;
        if (yespix.isUndefined(this.speedTimeJump)) this.speedTimeJump = 0.4;
        if (yespix.isUndefined(this.speedAir)) this.speedAir = 0.15;
        if (yespix.isUndefined(this.speedMax)) this.speedMax = 10;

        if (yespix.isUndefined(this.frictionAir)) this.frictionAir = 0.01;
        if (yespix.isUndefined(this.frictionGround)) this.frictionGround = 2;
        if (yespix.isUndefined(this.frictionIdle)) this.frictionIdle = 5;

        this.groundTouch = 0;
    },


    step: function(time) {
        if (!this.entity.collision || !this.entity.collision.isReady) {
            return false;
        }
        
        this.checkState(time);
        this.checkInput(time);
        this.checkSpeed(time);

        this.super();
    },

    checkState: function(time) {
        this.groundTouch = (this.entity.collision.getTouchList(this.groundFixture)).length;
        this.isIdle = true;
        if (this.groundTouch > 0) {
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }
    },

    checkSpeed: function(time) {

        // change speed
        var vel = this.entity.collision.getLinearVelocity();
        if (Math.abs(vel.x) > this.speedXMax || Math.abs(vel.y) > this.speedMax) {
            if (Math.abs(vel.x) > this.speedXMax) {            
                vel.x = (vel.x > 0 ? 1 : -1) * this.speedXMax;
            }
            if (Math.abs(vel.y) > this.speedYMax) {
                vel.y = (vel.y > 0 ? 1 : -1) * this.speedYMax;
            }
            this.entity.collision.setLinearVelocity(vel);
        }

        // change friction
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
    },

    checkInput: function(time) {
        if (input.key('right')) {
            if (this.isOnGround) {
                this.walkRight(time);
            } else {
                this.airMoveRight(time);
            }
        } else if (input.key('left')) {
            if (this.isOnGround) {
                this.walkLeft(time);
            } else {
                this.airMoveLeft(time);
            }
        }
        if (input.key('up')) {
            if (this.isOnGround) {
                this.jump(time);
            } else {
                this.airMoveUp(time);
            }
        }
    },


    jump: function(time) {
        if (!this.isOnGround) {
            return false;
        }
        this.timeJump = +new Date();
        var vel = this.entity.collision.getLinearVelocity();
        vel.y = 0;
        this.entity.collision.setLinearVelocity(vel);

        this.isIdle = false;
        this.entity.collision.impulse(-90, this.speedJump);
    },


    walkLeft: function (time) {
        if (!this.isOnGround || !this.entity.collision) {
            return false;
        }
        var vel = this.entity.collision.getLinearVelocity();
        if (Math.abs(vel.x)>this.speedWalk) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(180, this.speedWalk * time / 1000);
    },


    walkRight: function (time) {
        if (!this.isOnGround || !this.entity.collision) {
            return false;
        }
        var vel = this.entity.collision.getLinearVelocity();
        if (Math.abs(vel.x)>this.speedWalk) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(0, this.speedWalk * time / 1000);
    },


    airMoveUp: function (time) {
//console.log((+new Date() < this.timeJump + this.speedTimeJump * 1000), '+new Date() = ', (+new Date()), ', this.timeJump = ', yespix.precision(this.timeJump, 4)
//    , ' this.speedTimeJump = ', yespix.precision(this.speedTimeJump * 1000, 4), ', + = ', yespix.precision(this.timeJump + this.speedTimeJump, 4));
        if (this.isOnGround || !this.entity.collision || (+new Date() > this.timeJump + this.speedTimeJump * 1000)) {
            return false;
        }
        /*
        var vel = this.entity.collision.body.GetLinearVelocity();
        if (vel.y > -(this.speedJump * this.timeJump)) {
            return false;
        }*/
        this.isIdle = false;
        this.entity.collision.impulse(-90, this.speedUp);
    },

    airMoveLeft: function (time) {
        if (this.isOnGround || !this.entity.collision) {
            return false;
        }
        var vel = this.entity.collision.getLinearVelocity();
        if (Math.abs(vel.x)>this.speedAir) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(180, this.speedAir * time / 1000);
    },


    airMoveRight: function (time) {
        if (this.isOnGround || !this.entity.collision) {
            return false;
        }
        var vel = this.entity.collision.getLinearVelocity();
        if (Math.abs(vel.x)>this.speedAir) {
            return false;
        }
        this.isIdle = false;
        this.entity.collision.impulse(0, this.speedAir * time / 1000);
    },


    createPhysics: function(collision) {
        if (!this.listener) {
            this.listener = collision.physics.getListener();
        }
        collision.setUserData({collision: collision, entity: this.entity, type: 'body'});

        var body = collision.physics.create(collision);
        if (this.listener) {
            var size = collision.getSize();
            // ground fixture is a sensor at the bottom of the rectangle
            this.groundFixture = collision.physics.createFixture(0, size.height / 2, size.width * 0.98, 5, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'ground'}}, body);

//            collision.engine.createFixture(0, -size.height / 2, size.width * 0.8, 5, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'ceil'}}, body);
//            collision.engine.createFixture(-size.width / 2, 0, 5, size.height * 0.8, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'wallLeft'}}, body);
//            collision.engine.createFixture(size.width / 2, 0, 5, size.height * 0.8, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'wallRight'}}, body);
        }

        return body;
    },


    actorBeginContact: function(contact, myFixture, otherBody, otherFixture) {
    },


    actorEndContact: function(contact, myFixture, otherBody, otherFixture) {
    },


    actorPreSolve: function(contact, myFixture, otherBody, otherFixture, old) {
    },


    actorPostSolve: function(contact, myFixture, otherBody, otherFixture, impact) {
    }

});
