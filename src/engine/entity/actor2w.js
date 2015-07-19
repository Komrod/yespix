

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
        this.isIdle = true;
        if (this.groundTouch > 0) {
            if (!this.isOnGround) {
                var vel = this.entity.collision.body.GetLinearVelocity();
                vel.y = 0;
                this.entity.collision.body.SetLinearVelocity(vel);
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
            this.listener = collision.engine.getListener();
            if (!this.listener) {
                this.listener = collision.engine.createListener();
            }
        }
        collision.userData = {collision: collision, entity: this.entity, type: 'body'};
        var body = collision.engine.create(collision);
        if (this.listener) {
            var size = collision.getSize();
            collision.engine.createFixture(0, size.height / 2, size.width * 1.0, 5, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'ground'}}, body);
//            collision.engine.createFixture(0, -size.height / 2, size.width * 0.8, 5, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'ceil'}}, body);
//            collision.engine.createFixture(-size.width / 2, 0, 5, size.height * 0.8, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'wallLeft'}}, body);
//            collision.engine.createFixture(size.width / 2, 0, 5, size.height * 0.8, {isSensor: true, userData: {collision: collision, entity: this.entity, type: 'wallRight'}}, body);
        }
        return body;
    },


    actorBeginContact: function(contact, myFixture, otherBody, otherFixture) {
if (otherBody.GetType() == 2) {
console.log('actorBeginContact: with dynamic object ------------------------------------------------');
}
        var myData = myFixture.GetUserData();
        if (myData && myData.type == 'ground') {
            this.groundTouch++;
console.log('actorBeginContact: groundTouch++: '+this.groundTouch);
//var vel = myFixture.GetBody().GetLinearVelocity();
//console.log('actorBeginContact: velocity = ', vel);
        } else {
console.log('actorBeginContact: NOT GROUND: myData = ', myData);
        }
    },


    actorEndContact: function(contact, myFixture, otherBody, otherFixture) {
console.log('actorEndContact: --------------------------------------');
console.log('actorEndContact: start, groundTouch = '+this.groundTouch);
        var myData = myFixture.GetUserData();
        if (myData && myData.type == 'ground') {
            this.groundTouch--;
//            if (this.groundTouch <= 0) {
                this.groundTouch = 0;
                var edge = myFixture.GetBody().GetContactList();
var count = 1;                
                while (edge) {
console.log('actorEndContact: edge '+count+' = ', edge.contact.IsTouching());
console.log('actorEndContact: B.isMyFix='+(edge.contact.GetFixtureB() == myFixture ? 'TRUE' : 'FALSE')+', A.NotSameBody='+(edge.contact.GetFixtureA().GetBody() != myFixture.GetBody() ? 'TRUE' : 'FALSE'));
                    if (edge.contact.IsTouching() && edge.contact.GetFixtureA() == myFixture && edge.contact.GetFixtureB().GetBody() != myFixture.GetBody() 
                        && otherFixture != edge.contact.GetFixtureB()) {
                        this.groundTouch++;
//                    } else if (next.contact.GetFixtureB() == myFixture && next.contact.GetFixtureA().GetBody() != myFixture.GetBody()) {
//                        this.groundTouch++;
                    }
count++;                    
                    edge = edge.next;
                }
//            }
console.log('actorEndContact: groundTouch--: '+this.groundTouch);
console.log('actorEndContact: --------------------------------------');
//var vel = myFixture.GetBody().GetLinearVelocity();
//console.log('actorBeginContact: velocity = ', vel);
        }
        /*
        var myData = myFixture.GetUserData();
        if (myData && myData.type == 'ground') {
            this.isOnGround = false;
        }*/
//var vel = myFixture.GetBody().GetLinearVelocity();
//console.log('actorEndContact: velocity = ', vel);
    },

    actorPreSolve: function(contact, myFixture, otherBody, otherFixture, old) {
/*        this.beforeContact = {
            myVel: myFixture.GetBody().GetLinearVelocity(),
            otherVel: otherBody.GetLinearVelocity()
        };*/
//console.log('actorPreSolve: myVel = ', this.beforeContact.myVel);
    },

    actorPostSolve: function(contact, myFixture, otherBody, otherFixture, impact) {
/*        if (this.beforeContact) {
            var myVel = myFixture.GetBody().GetLinearVelocity();
if (myVel.y > 0.1 || myVel.y <-0.1) {
console.log('actorPostSolve: before myVel = ', this.beforeContact.myVel);
console.log('actorPostSolve: myVel = ', myVel); }
            var otherVel = otherBody.GetLinearVelocity();
            var newVel = null;
            if (Math.abs(this.beforeContact.myVel.x - myVel.x) > 0.2 && Math.abs(this.beforeContact.otherVel.x - otherVel.x) > 0.2) {
                newVel = this.beforeContact.myVel;
            }
            if (Math.abs(this.beforeContact.myVel.y - myVel.y) > 0.2 && Math.abs(this.beforeContact.otherVel.y - otherVel.y) > 0.2) {
                newVel = this.beforeContact.myVel;
            }
            if (newVel) {
console.log('Set new vel: ', newVel);
                this.entity.collision.body.SetLinearVelocity(newVel);
            }
        }*/
    }

});
