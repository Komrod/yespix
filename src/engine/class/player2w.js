

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

    this.speed = {
        ground: {
            walk: 5,
            jump: 20
        },
        air: {
            walk: 2,
            jump: 5
        }
    };

    this.entityTrigger('create');
    this.ready(true);


    this.isOnGround = true;
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


Player2w.prototype.step = function(time) {
    var left = this.entity.input.gamepad('left'),
        right = this.entity.input.gamepad('right'),
        up = this.entity.input.gamepad('up'),
        down = this.entity.input.gamepad('down'),
        jump = this.entity.input.gamepad('a'),
        fire = this.entity.input.gamepad('x'),
        lv = this.entity.collision.getLinearVelocity();

    if (right) {
        if (this.direction!='right') {
            this.changeDirection('right');
        }
        if (this.isOnGround) {
            this.entity.collision.impulse(0, this.speed.ground.walk*time/1000);
        } else {
            this.entity.collision.impulse(0, this.speed.air.walk*time/1000);
        }

    } else if (left) {
        if (this.direction!='left') {
            this.changeDirection('left');
        }
        if (this.isOnGround) {
            this.entity.collision.impulse(180, this.speed.ground.walk*time/1000);
        } else {
            this.entity.collision.impulse(180, this.speed.air.walk*time/1000);
        }
    }

    if (jump) {
        if (this.isOnGround) {
            this.entity.collision.impulse(270, this.speed.ground.jump*time/1000);
        } else {
            this.entity.collision.impulse(270, this.speed.air.walk*time/1000);
        }
    }

    // @TODO detects if on ground
    
};


Player2w.prototype.changeDirection = function(dir) {
    this.direction = dir;
    this.entity.animation.play(this.anims[this.action+this.direction]);
};


Player2w.prototype.destroy = function() {
};


yespix.defineClass('player2w', Player2w);

