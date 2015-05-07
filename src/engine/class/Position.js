function Position(options, entity) {

    options = options || {};

    this.x = options.x || 0;
    this.y = options.y || 0;
    this.z = options.z || 0;
    this.globalZ = options.globalZ || 0;
    this.rotation = options.rotation || 0;
    this.isChanged = true;
    this.isZSorted = false;

    this.entity = entity;
}

Position.prototype.set = function(pos) {
    if (pos.x || pos.x === 0) this.x = pos.x;
    if (pos.y || pos.y === 0) this.y = pos.y;
    if (pos.z || pos.z === 0) {
        this.z = pos.z;
        this.isZSorted = false;
    }
    if (pos.globalZ || pos.globalZ === 0) {
        this.globalZ = pos.globalZ;
        this.isZSorted = false;
    }
}
