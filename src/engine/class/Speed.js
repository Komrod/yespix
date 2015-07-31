function Speed(properties, entity) {

    properties = properties || {};

    this.x = properties.x || 0;
    this.y = properties.y || 0;

    this.entity = entity;
}

Speed.prototype.set = function(speed) {
	if (!speed) return;
    if (speed.x || speed.x === 0) this.x = speed.x;
    if (speed.y || speed.y === 0) this.y = speed.y;
}
