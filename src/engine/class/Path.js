

function Path(properties, entity) {

    properties = properties || {};
    if (entity) this.entity = entity;

    var varDefault = {
        lineWidth: 1,
        lineColor: '#000000',
        lineAlpha: 1.0,
        lineAlign: 'center',
        lineLayer: 'top',

        fillColor: '#ffffff',
        fillAlpha: 1.0,

        borderRadius: 0,
        type: 'rect',

        vertex: 4 // @TODO
    };

    this.set(properties, varDefault);
}


Path.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Path',
            properties: properties
        }
    );
};


Path.prototype.getBorderRadius = function() {
    if (this.entity.aspect.width >= this.borderRadius * 2 && this.entity.aspect.height >= this.borderRadius * 2) return this.borderRadius;
    if (this.entity.aspect.height < this.entity.aspect.width) return this.entity.aspect.height / 2;
    return this.entity.aspect.width / 2;
};


Path.prototype.drawLine = function(context) {
    context.globalAlpha = this.entity.aspect.alpha * this.lineAlpha;
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.lineColor;
    context.stroke();
};


Path.prototype.drawFill = function(context) {
    context.globalAlpha = this.entity.aspect.alpha * this.fillAlpha;
    context.fillStyle = this.fillColor;
    context.fill();
};


Path.prototype.draw = function(context) {
    if (!this.entity || !this.entity.aspect || !this.entity.position) return false;

    var contextSaved = false;

    if (this.entity.aspect.rotation != 0) {
        var pivot = this.entity.getPivot();
        contextSaved = true;
        context.save();
        context.translate(pivot.x, pivot.y);
        context.rotate(this.entity.position.rotation * Math.PI / 180);
        context.translate(-pivot.x, -pivot.y);
    }

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

    if (contextSaved) {
        context.restore();
        //context.rotate(0);
        //context.setTransform(1, 0, 0, 1, 0, 0);
        //context.translate(0, 0);
    }
};


Path.prototype.drawRect = function(context) {

    this._pathDrawn = false;
    this._pathSame = !(this.lineWidth > 0);
    if (this.lineAlign == 'outside') {
        this._pathPosition = this.lineWidth/2;
    } else if (this.lineAlign == 'inside') {
        this._pathPosition = -this.lineWidth/2;
    } else {
        this._pathPosition = 0;
    }

    // draw line bottom
    if (this.lineLayer == 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            context.beginPath();
            context.rect(this.entity.position.x - this._pathPosition, this.entity.position.y - this._pathPosition, this.entity.aspect.width + this._pathPosition*2, this.entity.aspect.height + this._pathPosition*2);
            this.pathDrawn = true;
            this.drawLine(context);
        }
    }

    // draw fill
    if (this.fillColor != '') {
        if (!this._pathSame || !this._pathDrawn) {
            context.beginPath();
            context.rect(this.entity.position.x, this.entity.position.y, this.entity.aspect.width, this.entity.aspect.height);
            this.pathDrawn = true;
        }
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            if (!this._pathSame || !this._pathDrawn) {
                context.beginPath();
                context.rect(this.entity.position.x - this._pathPosition, this.entity.position.y - this._pathPosition, this.entity.aspect.width + this._pathPosition/2, this.entity.aspect.height + this._pathPosition/2);
                this.pathDrawn = true;
            }

            this.drawLine(context);
        }
    }
};


Path.prototype.drawRectRadius = function(context) {

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

    // draw line bottom
    if (this.lineLayer == 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            this.drawLine(context);
        }
    }

    // draw fill
    if (this.fillColor != '') {
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            this.drawLine(context);
        }
    }

};


Path.prototype.drawCircle = function(context) {

    // draw path
    context.beginPath();
    var radius = this.entity.aspect.width / 2;
    context.arc(this.entity.position.x + radius, this.entity.position.y + radius, radius, 0, 2 * Math.PI, false);

    // draw line bottom
    if (this.lineLayer == 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            this.drawLine(context);
        }
    }

    // draw fill
    if (this.fillColor != '') {
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            this.drawLine(context);
        }
    }
};


Path.prototype.drawEllipse = function(context) {

    // draw path
    context.beginPath();
    var radiusX = this.entity.aspect.width / 2
        ,radiusY = this.entity.aspect.height / 2;
    context.ellipse(this.entity.position.x + radiusX, this.entity.position.y + radiusY, radiusX, radiusY, 0, 0, 2 * Math.PI, false);

    // draw line bottom
    if (this.lineLayer == 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            this.drawLine(context);
        }
    }

    // draw fill
    if (this.fillColor != '') {
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            this.drawLine(context);
        }
    }

};


yespix.defineClass('path', Path);

