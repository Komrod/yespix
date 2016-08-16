

function Tween(properties, entity) {
    properties = properties || {};
    if (entity) this.entity = entity;

    this.from = {};
    this.to = {};

    var varDefault = {
    };

    this.set(properties, varDefault);
}


Aspect.prototype.set = function(properties, varDefault) {

    yespix.copy(properties, this, varDefault);
    
    this.entity.trigger(
        {
            type: 'tween',
            from: this,
            fromClass: 'Tween',
            entity: this.entity,
            properties: properties
        }
    );
};




yespix.defineClass('tween', Tween);