

function Player2w(properties, entity) {
    properties = properties || {};
    if (entity) this.entity = entity;

    var varDefault = {
        name: 'player'
    };


    this.actions = {
        //'lookup': true, 
        //'lookdown': true,

        'walk': true,
        //'run': true,
        //'stealth': true,

        'jump': true,
        'longjump': true,
        'doublejump': true,

        //'crouch': true,
        //'guard': true,

        //'damage': true,
        //'dead': true,

        //'roll': true,
        //'slide': true,

        //'wallhang': true,

        //'ladder': true,

        //'push': true,
        //'pull': true,

        //'waterswim': true,
        //'wateridle': true,

        //'throw': true,
        //'attack': true,
        //'use': true,

    };

    this.direction = 'left';
    this.action = 'idle';

    this.anims = {
        'idleright': 'idleright',
        'idleleft': 'idleleft',

        'walkright': 'walkright',
        'walkleft': 'walkleft',

        'stealthright': 'stealthright',
        'stealthleft': 'stealthleft',

        'runright': 'runright',
        'runleft': 'runleft',

        'lookupleft': 'lookupleft',
        'lookdownleft': 'lookdownleft',

        'lookupright': 'lookupright',
        'lookdownright': 'lookdownright',

        'attackleft': 'attackleft',
        'attackright': 'attackright',

        'jumpleft': 'jumpleft',
        'jumpright': 'jumpright',
        'airleft': 'airleft',
        'airright': 'airright',
        'landleft': 'landleft',
        'landright': 'landright',
    };

    this.speed = {
        max: {
            walk: 4,
            air: 10
        },
        ground: {
            walk: 20,
            jump: 100,
            friction: 0.3

        },
        air: {
            walk: 4,
            jump: 16,
            jumpStop: 1.0,
            friction: 0.05
        }
    };


    this.entityTrigger('create');
    this.ready(true);


    this.isOnGround = false;
    this.isFalling = true;
    this.doubleJump = false;
    this.jumpTime = 0;

    this.state = {};
}


Player2w.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entityTrigger('change', properties);
};


Player2w.prototype.trigger = function(event) {
    if (event.from == this) return false;

    if (event.type == 'ready' && event.fromClass == 'Image') {
        this.getSpritesReady();
        return true;
    }
    return true;
};


Player2w.prototype.entityTrigger = function(type, properties) {
    if (this.entity) {
        properties = properties || {};
        this.entity.trigger(
            {
                type: type,
                entity: this.entity,
                from: this,
                fromClass: 'Player2w',
                properties: properties
            }
        );
    }
};    


Player2w.prototype.ready = function(bool) {
    if (bool) {
        this.isReady = true;
        this.entityTrigger('ready');
    } else {
        this.isReady = false;
        this.entityTrigger('notReady');
    }
};


Player2w.prototype.createPhysics = function(collision) {
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

Player2w.prototype.step = function(time) {

    // @test this prevent sleep mode
    this.entity.collision.impulse(180, 0);

    this.updateState();

    if (!this.isOnGround && this.state.lv.y>0) this.isFalling = true;

    // prevent flying on ground
    if (!this.isOnGround) {
        if (this.entity.collision.getTouchList(this.groundFixture).length > 0) {
            this.land();
        }
    }

    // walk action
    if (this.actions.walk) {
        if (this.state.right) {
            if (this.direction!='right')  this.changeDirection('right');
            if (this.isOnGround) this.entity.collision.impulse(0, this.speed.ground.walk*time/1000);
            else this.entity.collision.impulse(0, this.speed.air.walk*time/1000);
        } else if (this.state.left) {
            if (this.direction!='left') this.changeDirection('left');
            if (this.isOnGround) this.entity.collision.impulse(180, this.speed.ground.walk*time/1000);
            else this.entity.collision.impulse(180, this.speed.air.walk*time/1000);
        }
    }

    // jump action
    if (this.state.jump && this.actions.jump) {
        if (this.isOnGround) {
            this.state.lv.y = -this.speed.ground.jump*80/1000;
            this.entity.collision.setLinearVelocity(this.state.lv);

            this.entity.collision.setFriction(this.speed.air.friction);

            this.isOnGround = false;
            this.isFalling = false;

            // prevent double jump right after jump
            this.state.holdJump = true;
        } else {
            if (this.actions.longjump && !this.isFalling && this.state.lv.y < -this.speed.air.jumpStop) {
                var factor = ((-this.state.lv.y)-this.speed.air.jumpStop)/this.speed.max.air + 0.5;
                this.entity.collision.impulse(270, this.speed.air.jump*time/1000*factor);
            }
        }
    }

    // double jump action
    if (this.actions.doublejump && !this.isOnGround && !this.state.holdJump && this.state.jump && !this.doubleJump) {
        this.state.lv.y = -this.speed.ground.jump*80/1000;
        this.entity.collision.setLinearVelocity(this.state.lv);
        this.entity.collision.setFriction(this.speed.air.friction);

        this.isOnGround = false;
        this.isFalling = false;
        this.doubleJump = true;
    }

    // limits speed
    if (this.isOnGround) {
        var newLv = this.entity.collision.vec2(this.state.lv.x, this.state.lv.y);
        if (newLv.x > this.speed.max.walk) newLv.x = this.speed.max.walk;
        if (newLv.x < -this.speed.max.walk) newLv.x = -this.speed.max.walk;
        if (newLv.y > this.speed.max.walk) newLv.y = this.speed.max.walk;
        if (newLv.y < -this.speed.max.walk) newLv.y = -this.speed.max.walk;
        if (newLv.x != this.state.lv.x || newLv.x != this.state.lv.x) {
            this.entity.collision.setLinearVelocity(newLv);
            this.state.lv = newLv;
        }
    } else {
        var newLv = this.entity.collision.vec2(this.state.lv.x, this.state.lv.y);
        if (newLv.x > this.speed.max.air) newLv.x = this.speed.max.air;
        if (newLv.x < -this.speed.max.air) newLv.x = -this.speed.max.air;
        if (newLv.y > this.speed.max.air) newLv.y = this.speed.max.air;
        if (newLv.y < -this.speed.max.air) newLv.y = -this.speed.max.air;
        if (newLv.x != this.state.lv.x || newLv.x != this.state.lv.x) {
            this.entity.collision.setLinearVelocity(newLv);
            this.state.lv = newLv;
        }
    }

    this.stepAnimation();
};


Player2w.prototype.updateState = function() {
    this.state.left = this.entity.input.gamepad('left') || this.entity.input.key('left');
    this.state.right = this.entity.input.gamepad('right') || this.entity.input.key('right');
    this.state.up = this.entity.input.gamepad('up');
    this.state.down = this.entity.input.gamepad('down');
    this.state.holdJump = !!this.state.jump && (this.entity.input.gamepad('a') || this.entity.input.key('up'));
    this.state.jump = this.entity.input.gamepad('a') || this.entity.input.key('up');
    this.state.fire = this.entity.input.gamepad('x');
    this.state.lv = this.entity.collision.getLinearVelocity();
};


Player2w.prototype.stepAnimation = function() {
    // anim walk
    if (this.isOnGround) {
        var speed = this.groundSpeed();
//console.log(speed); aze;
        // #start isOnGround
        if (this.action == 'air' && speed > 0.01 || this.state.right || this.state.left) {
            this.changeAction('walk', true);
        } else if (this.action == 'air' || speed < 0.01) {
            this.changeAction('idle', true);
        }
        // #end isOnGround
    } else {
        // #start !isOnGround
        this.changeAction('air');

        // #end !isOnGround
    }

};


Player2w.prototype.groundSpeed = function() {
    var list = this.entity.collision.getTouchList(this.groundFixture);
    if (!list || list.length == 0) {
        return Math.abs(this.state.lv.x);
    }
    if (!this.isOnGround) {
        this.land();
    }
    if (this.entity.collision && this.entity.collision.physics && this.entity.collision.physics.getUserData(list[0].body)) {
        var groundSpeed = this.entity.collision.physics.getUserData(list[0].body).collision.getLinearVelocity();
        return Math.abs(groundSpeed.x - this.state.lv.x);
    }
    return Math.abs(this.state.lv.x);
};


Player2w.prototype.changeDirection = function(dir) {
    this.direction = dir;
    this.entity.animation.play(this.anims[this.action+this.direction]);
};


Player2w.prototype.changeAction = function(action, force) {
    force = force || false;

    this.action = action;
    if (action == 'walk') {
        this.entity.animation.speed = this.groundSpeed() / this.speed.max.walk * 1.5 + 0.3;
    } else {
        this.entity.animation.speed = 1.0;
    }
    this.entity.animation.play(this.anims[this.action+this.direction]);
};


Player2w.prototype.land = function() {
    if (this.isOnGround) return false;
    this.entity.collision.setFriction(this.speed.ground.friction);
    this.isOnGround = true;
    this.isFalling = false;
    this.doubleJump = false;

    this.stepAnimation();

};


Player2w.prototype.fall = function() {
    if (!this.isOnGround) return false;
    this.entity.collision.setFriction(this.speed.air.friction);
    this.isOnGround = false;
    this.isFalling = false;
    this.doubleJump = false;

    this.stepAnimation();

};


Player2w.prototype.destroy = function() {
};


Player2w.prototype.actorBeginContact = function(contact, myFixture, otherBody, otherFixture) {
    if (!this.isOnGround) {
        if (myFixture && myFixture.m_userData && myFixture.m_userData.type == 'ground') { // @TODO use getUserData
            this.land();
        }
    }
};


Player2w.prototype.actorEndContact = function(contact, myFixture, otherBody, otherFixture) {
    // prevent flying on ground
    if (this.isOnGround) {
        if (this.entity.collision.getTouchList(this.groundFixture).length == 0) {
            this.fall();
        }
    }
};


Player2w.prototype.actorPreSolve = function(contact, myFixture, otherBody, otherFixture, old) {
};


Player2w.prototype.actorPostSolve = function(contact, myFixture, otherBody, otherFixture, impact) {
};


yespix.defineClass('player2w', Player2w);

