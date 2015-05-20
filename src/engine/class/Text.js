function Text(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
	    align: 'left', // "left" / "right" / "center"
	    font: 'sans-serif',
	    size: 16,
	    
	    fillColor: '#000000',
	    fillAlpha: 1.0,

	    lineColor: '#000000',
	    lineWidth: 1,
	    lineAlpha: 1.0,

	    text: ''
    };

    yespix.copy(options, this, varDefault);

}

Text.prototype.set = function(properties) {

}

Text.prototype.draw = function(context) {
    if (!this.entity || !this.entity.position || !this.entity.aspect) return false;

    context.globalAlpha = this.entity.aspect.alpha;
    context.fillStyle = this.color;
    context.font = this.size+'px '+this.font;
    
    context.fillText(this.text, this._box.draw.x, this._box.draw.y + this.textSize);

}
