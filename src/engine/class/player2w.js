

function Player2w(properties, entity) {
    properties = properties || {};
    if (entity) this.entity = entity;

    var varDefault = {
        name: 'player'
    };


    this.actions = {
        'idle': true,

        // 'lookup': true, @TODO
        //'lookdown': true,

        //'run': true,
        'walk': true,
        //'stealth': true,

        'jump': true,
        //'longjump': true,
        //'doublejump': true,

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

        'default': 'idle',
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

        'left': 'left',
        'right': 'right',
    };

    this.speed = {
        max: {
            walk: 4,
            air: 6
        },
        ground: {
            walk: 10,
            jump: 100,
            friction: 0.3

        },
        air: {
            walk: 2,
            jump: 16,
            jumpStop: 1.5,
            friction: 0.05
        }
    };

    this.entityTrigger('create');
    this.ready(true);


    this.isOnGround = false;
    this.isFalling = true;
    this.doubleJump = false;
    this.jumpTime = 0;
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
    var left = this.entity.input.gamepad('left') || this.entity.input.key('left'),
        right = this.entity.input.gamepad('right') || this.entity.input.key('right'),
        up = this.entity.input.gamepad('up'),
        down = this.entity.input.gamepad('down'),
        jump = this.entity.input.gamepad('a') || this.entity.input.key('up'),
        fire = this.entity.input.gamepad('x'),
        lv = this.entity.collision.getLinearVelocity();

    if (!this.isOnGround && lv.y>0) this.isFalling = true;

    if (right) {
        if (this.direction!='right')  this.changeDirection('right');
        if (this.isOnGround) this.entity.collision.impulse(0, this.speed.ground.walk*time/1000);
        else this.entity.collision.impulse(0, this.speed.air.walk*time/1000);
    } else if (left) {
        if (this.direction!='left') this.changeDirection('left');
        if (this.isOnGround) this.entity.collision.impulse(180, this.speed.ground.walk*time/1000);
        else this.entity.collision.impulse(180, this.speed.air.walk*time/1000);
    }

    if (jump) {
        if (this.isOnGround && this.jumpTime < yespix.getTime() - 100) {
            lv.y = -this.speed.ground.jump*80/1000;
            this.entity.collision.setLinearVelocity(lv);

            this.entity.collision.setFriction(this.speed.air.friction);

            this.isOnGround = false;
            this.isFalling = false;
            this.jumpTime = yespix.getTime();
        } else {
            if (!this.isFalling && lv.y < -1) {
                this.entity.collision.impulse(270, this.speed.air.jump*time/1000);
            }
        }
    }

    // limits speed
    if (this.isOnGround) {
        var newLv = this.entity.collision.vec2(lv.x, lv.y);
        if (newLv.x > this.speed.max.walk) newLv.x = this.speed.max.walk;
        if (newLv.x < -this.speed.max.walk) newLv.x = -this.speed.max.walk;
        if (newLv.y > this.speed.max.walk) newLv.y = this.speed.max.walk;
        if (newLv.y < -this.speed.max.walk) newLv.y = -this.speed.max.walk;
        if (newLv.x != lv.x || newLv.x != lv.x) {
            this.entity.collision.setLinearVelocity(newLv);
        }
    } else {
        var newLv = this.entity.collision.vec2(lv.x, lv.y);
        if (newLv.x > this.speed.max.air) newLv.x = this.speed.max.air;
        if (newLv.x < -this.speed.max.air) newLv.x = -this.speed.max.air;
        if (newLv.y > this.speed.max.air) newLv.y = this.speed.max.air;
        if (newLv.y < -this.speed.max.air) newLv.y = -this.speed.max.air;
        if (newLv.x != lv.x || newLv.x != lv.x) {
            this.entity.collision.setLinearVelocity(newLv);
        }
    }

    // anim walk
    if (this.isOnGround) {
        // #start isOnGround
        if (right || left) {
            this.changeAction('walk');
        } else if (Math.abs(lv.x) < 0.01) {
            this.changeAction('idle');
        }
        // #end isOnGround
    } else {
        // #start !isOnGround
        
        // #end !isOnGround

    }

};


Player2w.prototype.changeDirection = function(dir) {
    this.direction = dir;
    this.entity.animation.play(this.anims[this.action+this.direction]);
};


Player2w.prototype.changeAction = function(action) {
    this.action = action;

    if (action == 'walk') {
        var lv = this.entity.collision.getLinearVelocity();
        this.entity.animation.speed = Math.abs(lv.x) / this.speed.max.walk * 1.5 + 0.3;
    } else {
        this.entity.animation.speed = 1.0;
    }
    this.entity.animation.play(this.anims[this.action+this.direction]);
};


Player2w.prototype.land = function() {
    if (this.isOnGround) return false;

    // @test
    // push player at 25% of vl.x to prevent slow down when landing
    var lv = this.entity.collision.getLinearVelocity();
console.log(lv);    
    if (lv) {
        lv.x = lv.x * 1.75;
        this.entity.collision.setLinearVelocity(lv);
    }
    this.entity.collision.setFriction(this.speed.ground.friction);
    this.isOnGround = true;
    this.isFalling = false;
};


Player2w.prototype.destroy = function() {
};


Player2w.prototype.actorBeginContact = function(contact, myFixture, otherBody, otherFixture) {
    if (myFixture && myFixture.m_userData && myFixture.m_userData.type == 'ground') { // @TODO use getUserData
        this.land();
    }
};


Player2w.prototype.actorEndContact = function(contact, myFixture, otherBody, otherFixture) {
};


Player2w.prototype.actorPreSolve = function(contact, myFixture, otherBody, otherFixture, old) {
};


Player2w.prototype.actorPostSolve = function(contact, myFixture, otherBody, otherFixture, impact) {
};


yespix.defineClass('player2w', Player2w);

