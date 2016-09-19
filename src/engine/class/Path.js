

/**
 * Path class
 * Create and draw path, circle and rectangles
 * @events  create ready notReady change destroy
 * @parent  entity
 */


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

        points: []
    };

    this.set(properties, varDefault);

    if (this.points) {
        this.setPoints(this.points);
    }

    this.entityTrigger('create');

    this.boundaryPolygon = null;
    this.ready(true);
}


Path.prototype.ready = function(bool) {
    if (bool) {
        this.isReady = true;
        this.entityTrigger('ready');
    } else {
        this.isReady = false;
        this.entityTrigger('notReady');
    }
};


Path.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entityTrigger('change', properties);

    // aspect is changed
    this.entity.aspect.isChanged = true;
};


Path.prototype.setPoints = function(points) {
    this.points = [];
    if (yespix.isObject(points)) {
        this.addPoint({x: 0, y:0});
        this.addPoint(points);
        return true;
    }
    for (var t=0; t<points.length; t++) {
        this.addPoint(points[t]);
    }
    return true;
};


Path.prototype.addPoint = function(point) {
    if (!point.x) {
        point.x = 0;
    }
    if (!point.y) {
        point.y = 0;
    }
    this.points.push(point);
};


Path.prototype.getBoundaryImagePloygon = function() {

    if (this.points.length < 1) {
        return false;
    }

    var minX, minY, maxX, maxY;

    for (var t=0; t<this.points.length; t++) {
        if (this.points[t]) {
            if (yespix.isUndefined(minX) || minX > this.points[t].x) minX = this.points[t].x;
            if (yespix.isUndefined(maxX) || maxX < this.points[t].x) maxX = this.points[t].x;
            if (yespix.isUndefined(minY) || minY > this.points[t].y) minY = this.points[t].y;
            if (yespix.isUndefined(maxY) || maxY < this.points[t].y) maxY = this.points[t].y;
        }
    }

    if (minX === null) {
        return false;
    }

    this.boundaryPolygon = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
    };

    return {
        x: this.boundaryPolygon.x + this.entity.position.x,
        y: this.boundaryPolygon.y + this.entity.position.y,
        width: this.boundaryPolygon.width,
        height: this.boundaryPolygon.height
    };
};


Path.prototype.getBoundaryDrawPloygon = function() {

    if (!this.entity.boundary.image) {
        this.entity.boundary.image = this.getBoundaryImagePloygon();
    }

    if (!this.entity.boundary.image) {
        return false;
    }

    var pivot = this.entity.getPivot();
    var points = [
        this.entity.rotatePoint(
            this.entity.boundary.image.x, 
            this.entity.boundary.image.y, 
            pivot.x, 
            pivot.y, 
            this.entity.position.rotation),

        this.entity.rotatePoint(
            this.entity.boundary.image.x + this.entity.boundary.image.width, 
            this.entity.boundary.image.y, 
            pivot.x, 
            pivot.y, 
            this.entity.position.rotation),

        this.entity.rotatePoint(
            this.entity.boundary.image.x, 
            this.entity.boundary.image.y + this.entity.boundary.image.height, 
            pivot.x, 
            pivot.y, 
            this.entity.position.rotation),

        this.entity.rotatePoint(
            this.entity.boundary.image.x + this.entity.boundary.image.width, 
            this.entity.boundary.image.y + this.entity.boundary.image.height, 
            pivot.x, 
            pivot.y, 
            this.entity.position.rotation)
    ];

    var rad = this.entity.position.rotation * Math.PI / 180;

    return {
        points: points,
        x: Math.min(points[0].x, points[1].x, points[2].x, points[3].x),
        y: Math.min(points[0].y, points[1].y, points[2].y, points[3].y),
        width: Math.abs(Math.cos(rad))*this.entity.boundary.image.width + Math.abs(Math.sin(rad))*this.entity.boundary.image.height,
        height: Math.abs(Math.cos(rad))*this.entity.boundary.image.height + Math.abs(Math.sin(rad))*this.entity.boundary.image.width
    };
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
    
    if (this.entity.position.rotation != 0) {
        var pivot = this.entity.getPivot();
        contextSaved = true;
        context.save();
        context.translate(pivot.x, pivot.y);
        context.rotate(this.entity.position.rotation * Math.PI / 180);
        context.translate(-pivot.x, -pivot.y);
    }
    
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
    if (this.lineColor != '' && this.lineWidth > 0) {
        if (this.points) {
            if (this.points.length == 0) {
                return true;
            }
            context.beginPath();
            context.moveTo(this.points[0].x + this.entity.position.x, this.points[0].y + this.entity.position.y);
            if (this.points.length == 1) {
                context.lineTo(this.points[0].x + this.entity.position.x, this.points[0].y + this.entity.position.y);
                this.drawBorder(context);
                return true;
            }
            for (var t=1; t<this.points.length; t++) {
                context.lineTo(this.points[t].x + this.entity.position.x, this.points[t].y + this.entity.position.y);
            }
            this.drawBorder(context);
        }
    }
};


Path.prototype.drawPloygonPath = function(context) {
    if (this.lineColor != '' && this.lineWidth > 0) {
        if (this.points) {
            if (this.points.length < 3) {
                return true;
            }
            context.beginPath();
            context.moveTo(this.points[0].x + this.entity.position.x, this.points[0].y + this.entity.position.y);
            for (var t=1; t<this.points.length; t++) {
                context.lineTo(this.points[t].x + this.entity.position.x, this.points[t].y + this.entity.position.y);
            }
            context.closePath();
        }
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


Path.prototype.drawPolygon = function(context) {

    this.drawPloygonPath(context);

    // draw line bottom
    if (this.lineLayer == 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
            this.drawBorder(context);
        }
    }

    // draw fill
    if (this.fillColor != '') {
        this.drawFill(context);
    }

    // draw line top
    if (this.lineLayer != 'bottom') {
        if (this.lineColor != '' && this.lineWidth > 0) {
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

    if (this._radius + this._pathPosition < 0) {
        this._pathPosition = this._radius;
    }
    
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


Path.prototype.entityTrigger = function(type, properties) {
    if (this.entity) {
        properties = properties || {};
        this.entity.trigger(
            {
                type: type,
                entity: this.entity,
                from: this,
                fromClass: 'Path',
                properties: properties
            }
        );
    }
};


Path.prototype.getBoundaryImage = function() {
    return {
        x: this.entity.position.x,
        y: this.entity.position.y,
        width: this.entity.aspect.width + 2 * this.lineWidth,
        height: this.entity.aspect.height + 2 * this.lineWidth
    };
};


Path.prototype.getBoundaryRender = function() {
    return {
        x: this.lineWidth,
        y: this.lineWidth,
        width: this.entity.aspect.width + 2 * this.lineWidth,
        height: this.entity.aspect.height + 2 * this.lineWidth
    };
};


Path.prototype.getBoundaryClip = function() {
    return {
        x: 0,
        y: 0,
        width: this.entity.aspect.width + 2 * this.lineWidth,
        height: this.entity.aspect.height + 2 * this.lineWidth
    };
};


Path.prototype.destroy = function() {
    // @TODO
};


yespix.defineClass('path', Path);

