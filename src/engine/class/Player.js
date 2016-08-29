

function Player2w(properties, entity) {
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

        'waterswim': true,
        'wateridle': true,

        'throw': true,
        'attack': true,
        'use': true,

        'default': 'idle',
    };

    this.direction = 'right';

    this.anims: {
        'idleright': 'idleright',
        'idleleft': 'idleleft',

        'walkright': 'walkright',
        'walkleft': 'walkleft',

        'stealthright': 'stealthright',
        'stealthleft': 'stealthleft',

        'runright': 'runright',
        'runleft': 'runleft',

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


Player.prototype.set = function(properties, varDefault) {
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


Player.prototype.trigger = function() {
};


Player.prototype.step = function(time) {
};


Player.prototype.actorBeginContact = function(contact, myFixture, otherBody, otherFixture) {
};


Player.prototype.actorEndContact = function(contact, myFixture, otherBody, otherFixture) {
};


Player.prototype.actorPreSolve = function(contact, myFixture, otherBody, otherFixture, old) {
};


Player.prototype.actorPostSolve = function(contact, myFixture, otherBody, otherFixture, impact) {
};





yespix.defineClass('player2w', Player2w);



