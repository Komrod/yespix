

function Path(properties, entity) {

    properties = properties || {};
    if (entity) this.entity = entity;

    var varDefault = {
        lineWidth: 1,
        lineColor: '#000000',
        lineAlpha: 1.0,
        lineAlign: 'center',
        lineLayer: 'top',
        lineCap: 'butt',

        fillColor: '#ffffff',
        fillAlpha: 1.0,

        borderRadius: 0,
        type: 'rect',

        vertex: 4 // @TODO
    };

    this.set(properties, varDefault);
console.log('path created ', this);    
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


Path.prototype.drawBorder = function(context) {
    context.globalAlpha = this.entity.aspect.alpha * this.lineAlpha;
    context.lineWidth = this.lineWidth;
    context.strokeStyle = this.lineColor;
    context.lineCap = this.lineCap;
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
//console.log('this.type = '+this.type);
    switch (this.type) {
        case 'line':
            this.drawLine(context);
            break;
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

Path.prototype.drawLine = function(context) {
//console.log('drawLine: ok');        
    if (this.lineColor != '' && this.lineWidth > 0) {
//console.log('drawLine: draw ', this.entity.position);        
        context.beginPath();
        context.moveTo(this.entity.position.x, this.entity.position.y);
        context.lineTo(this.entity.position.toX, this.entity.position.toY);
        this.drawBorder(context);
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
            this._pathDrawn = true;
            this.drawBorder(context);
        }
    }

    // draw fill
    if (this.fillColor != '') {
        if (!this._pathSame || !this._pathDrawn) {
            context.beginPath();
            context.rect(this.entity.position.x, this.entity.position.y, this.entity.aspect.width, this.entity.aspect.height);
            this._pathDrawn = true;
        }
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            if (!this._pathSame || !this._pathDrawn) {
                context.beginPath();
                context.rect(this.entity.position.x - this._pathPosition, this.entity.position.y - this._pathPosition, this.entity.aspect.width + this._pathPosition*2, this.entity.aspect.height + this._pathPosition*2);
                this.pathDrawn = true;
            }

            this.drawBorder(context);
        }
    }

};


Path.prototype.drawRectRadiusPath = function(context, radius, position) {

    // draw path
    context.beginPath();
    context.moveTo(this.entity.position.x + radius, this.entity.position.y - position);
    
    context.lineTo(this.entity.position.x + this.entity.aspect.width - radius, this.entity.position.y - position);
    context.quadraticCurveTo(this.entity.position.x + this.entity.aspect.width + position, this.entity.position.y - position, this.entity.position.x + this.entity.aspect.width + position, this.entity.position.y + radius);
    
    context.lineTo(this.entity.position.x + this.entity.aspect.width + position, this.entity.position.y + this.entity.aspect.height - radius);
    context.quadraticCurveTo(this.entity.position.x + this.entity.aspect.width + position, this.entity.position.y + this.entity.aspect.height + position, this.entity.position.x + this.entity.aspect.width - radius, this.entity.position.y + this.entity.aspect.height + position);
    
    context.lineTo(this.entity.position.x + radius, this.entity.position.y + this.entity.aspect.height + position);
    context.quadraticCurveTo(this.entity.position.x - position, this.entity.position.y + this.entity.aspect.height + position, this.entity.position.x - position, this.entity.position.y + this.entity.aspect.height - radius);
    
    context.lineTo(this.entity.position.x - position, this.entity.position.y + radius);
    context.quadraticCurveTo(this.entity.position.x - position, this.entity.position.y - position, this.entity.position.x + radius, this.entity.position.y - position);

};


Path.prototype.drawRectRadius = function(context) {

    this._pathDrawn = false;
    this._pathSame = !(this.lineWidth > 0);
    if (this.lineAlign == 'outside') {
        this._pathPosition = this.lineWidth/2;
    } else if (this.lineAlign == 'inside') {
        this._pathPosition = -this.lineWidth/2;
    } else {
        this._pathPosition = 0;
    }

    this._radius = this.getBorderRadius();

    // draw line bottom
    if (this.lineLayer == 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            this._pathDrawn = false;
            this.drawRectRadiusPath(context, this._radius, this._pathPosition);
            this.drawBorder(context);
            this._pathDrawn = true;
        }
    }

    // draw fill
    if (this.fillColor != '') {
        if (!this._pathSame || !this._pathDrawn) {
            this.drawRectRadiusPath(context, this._radius, 0);
            this._pathDrawn = true;
        }
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            if (!this._pathSame || !this._pathDrawn) {
                this.drawRectRadiusPath(context, this._radius, this._pathPosition);
                this._pathDrawn = true;
            }
            this.drawBorder(context);
        }
    }

};


Path.prototype.drawCircle = function(context) {

    this._pathDrawn = false;
    this._pathSame = !(this.lineWidth > 0);
    if (this.lineAlign == 'outside') {
        this._pathPosition = this.lineWidth/2;
    } else if (this.lineAlign == 'inside') {
        this._pathPosition = -this.lineWidth/2;
    } else {
        this._pathPosition = 0;
    }
    this._radius = this.entity.aspect.width / 2;

    // draw path
    if (this.lineLayer == 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            context.beginPath();
            context.arc(this.entity.position.x + this._radius, this.entity.position.y + this._radius, this._radius + this._pathPosition, 0, 2 * Math.PI, false);
            this.drawBorder(context);
            this._pathDrawn = true;
        }
    }

    // draw fill
    if (this.fillColor != '') {
        if (!this._pathSame || !this._pathDrawn) {
            context.beginPath();
            context.arc(this.entity.position.x + this._radius, this.entity.position.y + this._radius, this._radius, 0, 2 * Math.PI, false);
            this._pathDrawn = true;
        }
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            if (!this._pathSame || !this._pathDrawn) {
                context.beginPath();
                context.arc(this.entity.position.x + this._radius, this.entity.position.y + this._radius, this._radius + this._pathPosition, 0, 2 * Math.PI, false);
                this._pathDrawn = true;
            }
            this.drawBorder(context);
        }
    }
};



Path.prototype.drawEllipse = function(context) {

    this._pathDrawn = false;
    this._pathSame = !(this.lineWidth > 0);
    if (this.lineAlign == 'outside') {
        this._pathPosition = this.lineWidth/2;
    } else if (this.lineAlign == 'inside') {
        this._pathPosition = -this.lineWidth/2;
    } else {
        this._pathPosition = 0;
    }

    // draw path
    this._radiusX = this.entity.aspect.width / 2;
    this._radiusY = this.entity.aspect.height / 2;


    // draw line bottom
    if (this.lineLayer == 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            context.beginPath();
            context.ellipse(this.entity.position.x + this._radiusX, this.entity.position.y + this._radiusY, this._radiusX + this._pathPosition, this._radiusY + this._pathPosition, 0, 0, 2 * Math.PI, false);
            this.drawBorder(context);
            this._pathDrawn = true;
        }
    }

    // draw fill
    if (this.fillColor != '') {
        if (!this._pathSame || !this._pathDrawn) {
            context.beginPath();
            context.ellipse(this.entity.position.x + this._radiusX, this.entity.position.y + this._radiusY, this._radiusX, this._radiusY, 0, 0, 2 * Math.PI, false);
            this._pathDrawn = true;
        }
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            if (!this._pathSame || !this._pathDrawn) {
                context.beginPath();
                context.ellipse(this.entity.position.x + this._radiusX, this.entity.position.y + this._radiusY, this._radiusX + this._pathPosition, this._radiusY + this._pathPosition, 0, 0, 2 * Math.PI, false);
                this._pathDrawn = true;
            }
            this.drawBorder(context);
        }
    }

};


yespix.defineClass('path', Path);

