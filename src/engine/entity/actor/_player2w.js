yespix.define('player2w', 'actor2w', {

    actorKeys: {
        left: 'left',
        right: 'right',
        attack: 'space',
        jump: 'up',
    },

    actorAnims: {
        'idleright': 'idleright',
        'idleleft': 'idleleft',

        'walkright': 'walkright',
        'walkleft': 'walkleft',

        'lookup': 'lookup',
        'lookdown': 'lookdown',

        'jumpleft': 'jumpleft',
        'jumpright': 'jumpright',

        'airleft': 'airleft',
        'airright': 'airright',

        'attackleft': 'attackleft',
        'attackright': 'attackright',
    },

    playerSpawnOnFloor: false,
    playerAirFriction: 0.02,
    playerGroundFriction: 0.13,

    init: function() {
        var player = this;
        //console.log(yespix);
        if (this.playerSpawnOnFloor) {
            console.log('playerSpawnOnFloor');
            if (yespix.level && yespix.level.isReady) {
                console.log('level already set');
                if (player.isReady) {
                    console.log('player is ready #1');
                    player.playerFindGround();
                } else {
                    console.log('player is ready #1');
                    yespix.entitiesReady([player, yespix.level], function(entities) {
                        console.log('both ready #1');
                        player.playerFindGround();
                    });
                }
            } else {
                console.log('level not set');
                yespix.on('entityReady', function(e) {
                    console.log('entityReady :: e = ', e);
                }, this);
                yespix.on('entityReady:level', function(e) {
                    console.log('entityReady:level', e);
                    if (player.isReady) {
                        console.log('player is ready #2');
                        player.playerFindGround();
                    } else {
                        console.log('player is not ready #2');
                        yespix.entitiesReady([player, yespix.level], function(entities) {
                            console.log('both ready #2');
                            player.playerFindGround();
                        });
                    }
                }, this);
            }
        }

        yespix.on('enterFrame', function() {
            var move = '';

            if (this.actorMove.left && yespix.key(this.actorKeys.left) && !yespix.key(this.actorKeys.right)) {
                this.actorDirection = 'left';
                this.accelX = -this.actorSpeed;
            } else if (this.actorMove.right && yespix.key(this.actorKeys.right) && !yespix.key(this.actorKeys.left)) {
                this.actorDirection = 'right';
                this.accelX = this.actorSpeed;
            } else this.accelX = 0;

            //console.log('yespix.key('+this.actorKeys.attack+') = '+yespix.key(this.actorKeys.attack));
            //console.log('isOnGround = '+this.isOnGround+'');

            if (this.actorMove.attack && yespix.key(this.actorKeys.attack) && !this.isAttacking) {
                this.isAttacking = true;
                move = 'attack' + this.actorDirection;
                this.animWait = false;
                this.animPlay(this.actorAnims[move]);
                this.animWait = true;
                //yespix.dump(this);
            }

            if (this.actorMove.jump && this.isOnGround && yespix.key(this.actorKeys.jump)) {
                move = 'jump' + this.actorDirection;
                this.animWait = false;
                this.animPlay(this.actorAnims[move]);
                this.animWait = true;
                this.accelY = -this.actorSpeedJump;
                this.animNext = 'air' + this.actorDirection;
                this.isJumping = true;
                this.jumpTime = (new Date).getTime();
                //                console.log('this.jumpTime = ' + this.jumpTime);
            } else if (this.isJumping) {
                //                console.log('jumpTime = ' + this.jumpTime + ', now = ' + ((new Date).getTime()) + ', +400 ? ' + (this.jumpTime + 400 > (new Date).getTime()));
                if (this.jumpTime + 200 > (new Date).getTime() && yespix.key(this.actorKeys.jump)) {
                    this.accelY = -(this.actorSpeedJump / 6);
                    //this.accelY = 0;
                } else this.accelY = 0;
            } else this.accelY = 0;

            if (this.speedX > 0 && this.speedX >= this.speedY && this.speedX >= -this.speedY) {
                if (this.isOnGround) move = 'walk';
            } else if (this.speedX < 0 && this.speedX <= this.speedY && this.speedX <= -this.speedY) {
                if (this.isOnGround) move = 'walk';
            }
            if (!this.isOnGround) {
                if (this.speedY > 0) {
                    this.isJumping = false;
                    this.isFalling = true;
                }
                move = 'air';
            }

            if (move == '') move = this.actorMove['default'] + this.actorDirection;
            else move = move + this.actorDirection;
            this.animNext = this.actorAnims[move];
            //console.log('this.animWait='+this.animWait+', this.isAttacking='+this.isAttacking+', move='+move+', this.animNext='+this.animNext);
            if (this.animWait || this.isAttacking) return;
            this.animPlay(this.actorAnims[move]);
            //console.log('move = '+move+', anim = '+this.actorAnims[move]+', actorAnim = '+this.actorAnims[this.actorAnims[move]]);

        }, this, yespix);
    },

    applyFriction: function() {
        this.speedX *= (1 - this.playerGroundFriction);
        this.speedY *= (1 - this.playerAirFriction);
        if (this.speedX < this.actorSpeedMin && this.speedX > -this.actorSpeedMin) this.speedX = 0;
        if (this.speedY < this.actorSpeedMin && this.speedY > -this.actorSpeedMin) this.speedY = 0;
        return true;
    },

    playerFindGround: function() {
        console.log('playerFindGround :: start');
    },


});
