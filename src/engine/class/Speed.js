function Speed(options, entity) {

    options = options || {};

    this.x = options.x || 0;
    this.y = options.y || 0;

    this.entity = entity;
}

Speed.prototype.to = function(speed) {
    if (speed.x || speed.x === 0) this.x = speed.x;
    if (speed.y || speed.y === 0) this.y = speed.y;
}
