

yespix.defineEntity('physics', {


    init: function(properties, entity) {
        properties = properties || {};
        if (entity) this.entity = entity;

        var varDefault = {
            isAttacking: false,
            isFalling: false,
            isJumping: false,
            isOnGround: false,
            isIdle: true,

            shield: 0,
            life: 100,
            power: 100,
            stamina: 100,
            level: 1

        };

        this.set(properties, varDefault);
    },


    set: function(properties, varDefault) {
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

    },


    trigger: function(event) {
        if (this.entity) this.entity.trigger(event);
        return true;
    },


    step: function(time) {
    },


});
