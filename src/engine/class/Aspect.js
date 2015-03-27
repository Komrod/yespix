
function Aspect(options, entity) {
	
	options = options || {};

	this.alpha = options.alpha || 1;
	this.width = options.width || 0;
	this.height = options.height || 0;
	this.isChanged = true;

	this.entity = entity;
}

Aspect.prototype.to = function(aspect) {
	if (aspect.alpha || aspect.alpha === 0) this.alpha = aspect.alpha;
	if (aspect.width || aspect.width === 0) this.width = aspect.width;
	if (aspect.height || aspect.height === 0) this.height = aspect.height;
	
	this.change(aspect);
}

Aspect.prototype.change = function(aspect) {
	this.isChanged = true;
	this.entity.change('astpect', aspect);
}


