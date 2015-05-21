
function Position(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;


    var varDefault = {
        x: 1,
        y: '#000000',
        z: 1.0,
        globalZ: 'center', // @TODO

        rotation: 0,
    };

    this.isZSorted = false;
    this.set(options, varDefault);
}


Position.prototype.set = function(options, varDefault) {
    if (!yespix.isUndefined(options.z) && options.z != this.z
        || !yespix.isUndefined(options.globalZ) && options.globalZ != this.globalZ)
    {
        this.isZSorted = false;
    }
    yespix.copy(options, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'position',
            properties: options
        }
    );
}
