
function Aspect(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
        alpha: 1,
        width: 0,
        height: 0,
        isVisible: true,
        flipX: false,
        flipY: false,
        clipX: 0,
        clipY: 0,
        clipWidth: 0,
        clipHeight: 0
    };

    this.set(options, varDefault);
}

Aspect.prototype.set = function(options, varDefault) {
    
    yespix.copy(options, this, varDefault);
    
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            from: this,
            fromClass: 'Aspect',
            entity: this.entity,
            properties: options
        }
    );
}

