
function Actor(options, entity) {

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

}

Actor.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);
    
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            from: this,
            fromClass: 'Actor',
            entity: this.entity,
            properties: options
        }
    );
}

