
function Aspect(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
        alpha: 1,
        width: 0,
        height: 0,
        isVisible: true
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
            entity: this.entity,
            properties: options
        }
    );
}

