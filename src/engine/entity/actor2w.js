

yespix.define('actor2w', {


    inheritClass: 'actor',


    init: function(options, entity) {
        this.super(options, entity);

        this.speedWalk = this.speedWalk || 0.9;
        this.speedJump = this.speedJump || 12;
        this.speedUp = this.speedUp || 0.12;
        this.speedAir = this.speedAir || 0.15;
        this.speedXMax = this.speedXMax || 10;
        this.speedYMax = this.speedYMax || 10;

        this.frictionAir = this.frictionAir || 0.01;
        this.frictionGround = this.frictionGround || 2;
        this.frictionIdle = this.frictionIdle || 5;

        this.groundTouch = 0;
    },


    prepare: function() {
        if (!this.entity.collision.isReady) {
            return false;
        }
        
        this.isIdle = true;
        if (this.groundTouch > 0) {
            if (!this.isOnGround) {
                var vel = this.entity.collision.getLinearVelocity();
                vel.y = 0;
                this.entity.collision.setLinearVelocity(vel);
            }
            this.isOnGround = true;
        } else {
            this.isOnGround = false;
        }

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

        var vel = this.entity.collision.getLinearVelocity();
        if (Math.abs(vel.x) > this.speedXMax || Math.abs(vel.y) > this.speedYMax) {
            if (Math.abs(vel.x) > this.speedXMax) {            
                vel.x = (vel.x > 0 ? 1 : -1) * this.speedXMax;
            }
            if (Math.abs(vel.y) > this.speedYMax) {
                vel.y = (vel.y > 0 ? 1 : -1) * this.speedYMax;
            }
            this.entity.collision.setLinearVelocity(vel);
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
        var vel = this.entity.collision.getLinearVelocity();
        vel.y = 0;
        this.entity.collision.setLinearVelocity(vel);

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
        if (vel.y > -(this.speedJump2 * 1)) {
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
            this.listener = collision.physics.getListener();
            if (!this.listener) {
                this.listener = collision.physics.createListener();
            }
        }
        collision.userData = {collision: collision, entity: this.entity, type: 'body'};
        var body = collision.physics.create(collision);
        if (this.listener) {
            var size = collision.getSize();
            collision.physics.createFixture(0, size.height / 2, size.width * 1.0, 5, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'ground'}}, body);
//            collision.engine.createFixture(0, -size.height / 2, size.width * 0.8, 5, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'ceil'}}, body);
//            collision.engine.createFixture(-size.width / 2, 0, 5, size.height * 0.8, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'wallLeft'}}, body);
//            collision.engine.createFixture(size.width / 2, 0, 5, size.height * 0.8, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'wallRight'}}, body);
        }
        return body;
    },


    actorBeginContact: function(contact, myFixture, otherBody, otherFixture) {
        var myData = myFixture.GetUserData();
        if (myData && myData.type == 'ground') {
            this.groundTouch++;
        }
    },


    actorEndContact: function(contact, myFixture, otherBody, otherFixture) {
        var myData = myFixture.GetUserData();
        if (myData && myData.type == 'ground') {
            this.groundTouch--;
                this.groundTouch = 0;
                var edge = myFixture.GetBody().GetContactList();
                while (edge) {
                    if (edge.contact.IsTouching() && edge.contact.GetFixtureA() == myFixture && edge.contact.GetFixtureB().GetBody() != myFixture.GetBody() 
                        && otherFixture != edge.contact.GetFixtureB()) {
                        this.groundTouch++;
                    }
                    edge = edge.next;
                }
        }
    },

    actorPreSolve: function(contact, myFixture, otherBody, otherFixture, old) {
    },

    actorPostSolve: function(contact, myFixture, otherBody, otherFixture, impact) {
    }

});
