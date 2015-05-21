

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
        fillType: 'center', // @TODO

        borderRadius: 0,
        type: 'rect',
        vertex: 4
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
            fromClass: 'path',
            properties: options
        }
    );
}


Path.prototype.getBorderRadius = function() {
    if (this.entity.aspect.width >= this.borderRadius * 2 || this.entity.aspect.height >= this.borderRadius * 2) return this.borderRadius;
    if (this.entity.aspect.height < this.entity.aspect.width) return this.entity.aspect.height / 2;
    return this.entity.aspect.width / 2;
}


Path.prototype.drawLine = function(context) {
    context.globalAlpha = this.entity.aspect.alpha * this.lineAlpha;
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.lineColor;
    context.stroke();
}


Path.prototype.drawFill = function(context) {
    context.globalAlpha = this.entity.aspect.alpha * this.fillAlpha;
    context.fillStyle = this.fillColor;
    context.fill();
}


Path.prototype.draw = function(context) {
    switch (this.type) {
        case 'rect':
            if (this.getBorderRadius() > 0) {
                this.drawRectRadius(context);
            } else {
                this.drawRect(context);
            }
            break;
        case 'circle':
            if (this.entity.aspect.width == this.entity.aspect.height) {
                this.drawCircle(context);
            } else {
                this.drawEllipse(context);
            }
            break;
        case 'polygon':
            this.drawPolygon(context);
            break;
    }
}


Path.prototype.drawRect = function(context) {

    if (!this.entity || !this.entity.aspect || !this.entity.position) return false;

    // draw path
    context.beginPath();
    context.rect(this.entity.position.x, this.entity.position.y, this.entity.aspect.width, this.entity.aspect.height);

    // draw line
    if (this.lineColor != '' && this.lineWidth > 0) {
        this.drawLine(context);
    }

    // draw fill
    if (this.fillColor != '') {
        this.drawFill(context);
    }
}


Path.prototype.drawRectRadius = function(context) {

    if (!this.entity || !this.entity.aspect || !this.entity.position) return false;

    var radius = this.getBorderRadius();

    // draw path
    context.beginPath();
    context.moveTo(this.entity.position.x + radius, this.entity.position.y);
    context.lineTo(this.entity.position.x + this.entity.aspect.width - radius, this.entity.position.y);
    context.quadraticCurveTo(this.entity.position.x + this.entity.aspect.width, this.entity.position.y, this.entity.position.x + this.entity.aspect.width, this.entity.position.y + radius);
    context.lineTo(this.entity.position.x + this.entity.aspect.width, this.entity.position.y + this.entity.aspect.height - radius);
    context.quadraticCurveTo(this.entity.position.x + this.entity.aspect.width, this.entity.position.y + this.entity.aspect.height, this.entity.position.x + this.entity.aspect.width - radius, this.entity.position.y + this.entity.aspect.height);
    context.lineTo(this.entity.position.x + radius, this.entity.position.y + this.entity.aspect.height);
    context.quadraticCurveTo(this.entity.position.x, this.entity.position.y + this.entity.aspect.height, this.entity.position.x, this.entity.position.y + this.entity.aspect.height - radius);
    context.lineTo(this.entity.position.x, this.entity.position.y + radius);
    context.quadraticCurveTo(this.entity.position.x, this.entity.position.y, this.entity.position.x + radius, this.entity.position.y);

    // draw line
    if (this.lineColor != '' && this.lineWidth > 0) {
        this.drawLine(context);
    }

    // draw fill
    if (this.fillColor != '') {
        this.drawFill(context);
    }
}


Path.prototype.drawCircle = function(context) {

    if (!this.entity || !this.entity.aspect || !this.entity.position) return false;

    // draw path
    context.beginPath();
    var radius = this.entity.aspect.width / 2;
    context.arc(this.entity.position.x + radius, this.entity.position.y + radius, radius, 0, 2 * Math.PI, false);

    // draw line
    if (this.lineColor != '' && this.lineWidth > 0) {
        this.drawLine(context);
    }

    // draw fill
    if (this.fillColor != '') {
        this.drawFill(context);
    }
}


Path.prototype.drawEllipse = function(context) {

    if (!this.entity || !this.entity.aspect || !this.entity.position) return false;

    // draw path
    context.beginPath();
    var radiusX = this.entity.aspect.width / 2
        ,radiusY = this.entity.aspect.height / 2;
    context.ellipse(this.entity.position.x + radiusX, this.entity.position.y + radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI, false);

    // draw line
    if (this.lineColor != '' && this.lineWidth > 0) {
        this.drawLine(context);
    }

    // draw fill
    if (this.fillColor != '') {
        this.drawFill(context);
    }
}

