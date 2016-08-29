
/*
function Actor(properties, entity) {
    properties = properties || {};
    if (entity) this.entity = entity;

    var varDefault = {
        isAttacking: false,
        isFalling: false,
        isJumping: false,
        isOnGround: false,
        isIdle: true
    };

    this.states = {
        'idle': true,

        'lookup': true,
        'lookdown': true,

        'run': true,
        'walk': true,
        'stealth': true,

        'jump': true,
        'longjump': true,
        'doublejump': true,

        'crouch': true,
        'guard': true,

        'damage': true,
        'dead': true,

        'roll': true,
        'slide': true,

        'wallhang': true,

        'ladder': true,

        'throw': true,
        'attack': true,
        'use': true,

        'default': 'idle',
    };

            actorSpeedJump: 1.1,
            actorGravity: true,
            actorDirection: 'right',

    this.anims: {
        'idleright': 'idleright',
        'idleleft': 'idleleft',

        'walkright': 'walkright',
        'walkleft': 'walkleft',

        'lookup': 'lookup',
        'lookdown': 'lookdown',

        'lookup': 'lookup',
        'lookdown': 'lookdown',

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

    this.set(properties, varDefault);
}


Actor.prototype.set = function() {
    yespix.copy(properties, this, varDefault);

    this.entity.trigger(
        {
            type: 'change',
            from: this,
            fromClass: 'actor',
            entity: this.entity,
            properties: properties
        }
    );
};


Actor.prototype.trigger = function() {
};


Actor.prototype.step = function(time) {
};


Actor.prototype.actorBeginContact = function(contact, myFixture, otherBody, otherFixture) {
};


Actor.prototype.actorEndContact = function(contact, myFixture, otherBody, otherFixture) {
};


Actor.prototype.actorPreSolve = function(contact, myFixture, otherBody, otherFixture, old) {
};


Actor.prototype.actorPostSolve = function(contact, myFixture, otherBody, otherFixture, impact) {
};





yespix.defineClass('actor', Actor);

*/

