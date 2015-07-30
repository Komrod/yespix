

yespix.define('actor', {


    init: function(options, entity) {
        options = options || {};
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

        this.set(options, varDefault);
    },


    set: function(properties, varDefault) {
        yespix.copy(properties, this, varDefault);

        this.entity.event(
            {
                type: 'change',
                from: this,
                fromClass: 'actor',
                entity: this.entity,
                properties: properties
            }
        );

    },


    event: function(event) {
        if (this.entity) this.entity.event(event);
        return true;
    },


    step: function(time) {
    },

    createPhysics: function() {
        return null;
    },

    actorBeginContact: function(contact, myFixture, otherBody, otherFixture) {
    },

    actorEndContact: function(contact, myFixture, otherBody, otherFixture) {
    },

    actorPreSolve: function(contact, myFixture, otherBody, otherFixture, old) {
    },

    actorPostSolve: function(contact, myFixture, otherBody, otherFixture, impact) {
    },


});
