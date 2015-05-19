
function Path(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
        lineWidth: 1,
        lineColor: '#000000',
        lineAlpha: 1.0,
        lineType: 'center', // @TODO

        fillColor: '#ffffff',
        fillAlpha: 1.0,
        fillType: 'center' // @TODO
    };
    this.set(options, varDefault);
}

Path.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            properties: options
        }
    );
}
