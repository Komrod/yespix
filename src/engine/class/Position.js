

/**
 * Position class
 * Use for a Gfx entity to set and change his position
 * @events  create change ready
 * @parent  entity
 */


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

    this.entityTrigger('create');

    this.isReady = true;
    this.entityTrigger('ready');
}


Position.prototype.entityTrigger = function(type, properties) {
    if (this.entity) {
        properties = properties || {};
        this.entity.trigger(
            {
                type: type,
                entity: this.entity,
                from: this,
                fromClass: 'Position',
                properties: properties
            }
        );
    }
};


Position.prototype.set = function(properties, varDefault) {
    if (!yespix.isUndefined(properties.z) && properties.z != this.z
        || !yespix.isUndefined(properties.globalZ) && properties.globalZ != this.globalZ)
    {
        this.isZSorted = false;
    }
    yespix.copy(properties, this, varDefault);

    if (this.entity.boundary) {
        this.entity.boundary.image = null;
        this.entity.boundary.draw = null;
    }
    
    this.isChanged = true;
    this.entityTrigger('change', properties);
};


yespix.defineClass('position', Position);
