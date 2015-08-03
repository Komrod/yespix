

yespix.defineClass('player2w', {


    inheritClass: 'actor2w',


    init: function(properties, entity) {
        this.super(properties, entity);
        if (yespix.isUndefined(this.entityName)) this.entityName = 'player';

        if (this.input) {
            this.input.addState(this.entityName, {
                'jump': 'up',
                'walkLeft': 'left',
                'walkRight': 'right',
            })
        }
    },

    
    state: function(actionName) {
        return this.input.state(this.entityName, actionName);

    },


    step: function(time) {
        if (!this.entity.collision || !this.entity.collision.isReady) {
            return false;
        }
        
        this.checkState(time);
        this.checkInput(time);
        this.checkSpeed(time);
    },


    checkInput: function(time) {
        if (this.state('walkRight')) {
            if (this.isOnGround) {
                this.walkRight(time);
            } else {
                this.airMoveRight(time);
            }
        } else if (this.state('walkLeft')) {
            if (this.isOnGround) {
                this.walkLeft(time);
            } else {
                this.airMoveLeft(time);
            }
        }
        
        if (this.state('jump')) {
            if (this.isOnGround) {
                this.jump(time);
            } else {
                this.airMoveUp(time);
            }
        }
    },



});

