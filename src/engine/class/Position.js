
function Position(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;


    var varDefault = {
        x: 0,
        y: 0,
        z: 1.0,
        globalZ: 1.0, // @TODO

        rotation: 0,
        snapToPixel: false,
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
            fromClass: 'Position',
            properties: options
        }
    );
}
