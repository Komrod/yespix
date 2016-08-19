
function Position(properties, entity) {

    properties = properties || {};
    if (entity) this.entity = entity;


    var varDefault = {
        x: 0,
        y: 0,
        z: 1.0,
        globalZ: 1.0, // @TODO

        toX: 0,
        toY: 0,

        rotation: 0,
        pivotX: 0,
        pivotY: 0,
        
        snapToPixel: false,
    };

    this.isZSorted = false;
    this.set(properties, varDefault);

    this.isReady = true;
    this.entity.trigger(
        {
            type: 'ready',
            entity: this.entity,
            from: this,
            fromClass: 'Position',
            properties: {
                isReady: true
            }
        }
    );
}


Position.prototype.set = function(properties, varDefault) {
//console.log('Position:set', properties);    
    if (!yespix.isUndefined(properties.z) && properties.z != this.z
        || !yespix.isUndefined(properties.globalZ) && properties.globalZ != this.globalZ)
    {
        this.isZSorted = false;
    }
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entity.trigger(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Position',
            properties: properties
        }
    );
};


yespix.defineClass('position', Position);
