
function Path(options, entity) {

    options = options || {};

    this.lineWidth = options.lineWidth || 1;
    this.lineColor = options.lineColor || '#000000';
    this.lineAlpha = options.lineAlpha || 1.0;

    this.fillColor = options.fillColor || '#ffffff';
    this.fillAlpha = options.fillAlpha || 1.0;
    this.fillType = options.fillType || 'center';		// @TODO inside / outside
    this.isChanged = true;

    this.entity = entity;
}

Path.prototype.set = function(aspect) {
    if (aspect.alpha || aspect.alpha === 0) this.alpha = aspect.alpha;
    if (aspect.width || aspect.width === 0) this.width = aspect.width;
    if (aspect.height || aspect.height === 0) this.height = aspect.height;

    this.change(aspect);
}

Path.prototype.change = function(aspect) {
    this.isChanged = true;
    this.entity.change('path', aspect);
}
