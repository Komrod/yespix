        yespix.define('actor2w', 'actor', {
            actorMove: {
                'idle': true,

                'right': true,
                'left': true,

                'lookup': true,
                'lookdown': true,

                'walk': true,
                'run': true,

                'jump': true,
                'longjump': true,
                'doublejump': true,

                'crouch': true,
                'guard': true,

                'damage': true,
                'dead': true,

                'throw': true,
                'attack': true,
                'use': true,
                'default': 'idle',
            },

            actorSpeedJump: 1.1,
            actorGravity: true,
            actorDirection: 'right',

            actorAnims: {
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
            },

            actorInit: function(options) {},

            init: function() {},

            move: function() {
                this.trigger('moveStart', {
                    entity: this
                });

                this.speedX += this.accelX;
                this.speedY += this.accelY;

                this.applyFriction();
                this.applyGravity();

                if (yespix.level) yespix.level.collision(this);
                this.x += this.speedX;
                this.y += this.speedY;

                this.trigger('moveEnd', {
                    entity: this
                });
            },

            applyGravity: function() {
                if (!yespix.gravity) return false;
                if (!this.isOnGround && yespix.gravity) {
                    if (yespix.gravity.x) this.speedX += yespix.gravity.x / 20;
                    if (yespix.gravity.y) this.speedY += yespix.gravity.y / 20;
                }
            },

            applyFriction: function() {
                this.speedX *= (1 - this.moveFriction);
                this.speedY *= (1 - this.moveFriction);
                if (this.speedX < this.actorSpeedMin && this.speedX > -this.actorSpeedMin) this.speedX = 0;
                if (this.speedY < this.actorSpeedMin && this.speedY > -this.actorSpeedMin) this.speedY = 0;
                return true;
            },

        });
