
function Position(properties, entity) {

    properties = properties || {};
    if (entity) this.entity = entity;


    var varDefault = {
        x: 0,
        y: 0,
        z: 1.0,
        globalZ: 1.0, // @TODO

        rotation: 0,
        pivotX: 0,
        pivotY: 0,
        
        snapToPixel: false,
    };

    this.isZSorted = false;
    this.set(properties, varDefault);
}


Position.prototype.set = function(properties, varDefault) {
    if (!yespix.isUndefined(properties.z) && properties.z != this.z
        || !yespix.isUndefined(properties.globalZ) && properties.globalZ != this.globalZ)
    {
        this.isZSorted = false;
    }
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Position',
            properties: properties
        }
    );
}


yespix.defineClass('position', Position);
