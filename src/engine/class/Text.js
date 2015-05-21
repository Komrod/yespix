

function Text(options, entity) {

    options = options || {};
    if (entity) this.entity = entity;

    var varDefault = {
	    align: 'left', // "left" / "right" / "center"
	    font: 'sans-serif',
	    size: 16,

	    wrapped: false,
	    lineHeight: 1.0,

	    fillColor: '#ffffff',
	    fillAlpha: 1.0,

	    lineColor: '',
	    lineWidth: 1,
	    lineAlpha: 1.0,

	    content: '',

    };

    this.set(options, varDefault);
}


Text.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);

    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'text',
            properties: options
        }
    );
};


Text.prototype.draw = function(context) {
    if (!this.entity || !this.entity.aspect || !this.entity.position) return false;
    if (this.content == '') return true;
	
    if (this.wrapped && this.entity.aspect.width > 0) {
        this.drawWrapped(context);
    } else {
        this.drawText(context);
    }
};


Text.prototype.drawText = function(context) {
console.log('Text:drawText');
    // draw fill
    if (this.fillColor != '' && this.fillAlpha > 0) {
        this.drawFill(context);
    }

    return true;
};


// @TODO
Text.prototype.drawLine = function(context) {
/*
    context.globalAlpha = this.entity.aspect.alpha * this.lineAlpha;
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.lineColor;
    context.stroke();
*/
};


Text.prototype.drawFill = function(context) {
    context.globalAlpha = this.entity.aspect.alpha * this.fillAlpha;
    context.fillStyle = this.fillColor;
    context.fillText(this.content, this.entity.position.x, this.entity.position.y + this.size);
};


Text.prototype.drawWrapped = function(context) {
    if (this.fillColor == '' || this.fillAlpha <= 0) {
    	return false;
    }

    context.globalAlpha = this.entity.aspect.alpha * this.fillAlpha;
    context.fillStyle = this.fillColor;

    var words = this.content.split(' ');
    var line = '';
    var y = 0;

    for (var n = 0; n < words.length; n++) {
		var testLine = line + words[n] + ' ';
		var metrics = context.measureText(testLine);
		var testWidth = metrics.width;
		if (testWidth > this.entity.aspect.width && n > 0) {
		    context.fillText(line, this.entity.position.x, this.entity.position.y + this.size + y);
			line = words[n] + ' ';
			y += this.lineHeight * this.size;
		}
		else {
			line = testLine;
		}
    }
	context.fillText(line, this.entity.position.x, this.entity.position.y + this.size + y);
    return true;
};

