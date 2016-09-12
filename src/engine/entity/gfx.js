/**
 * @class entity.gfx
 */
yespix.defineEntity('gfx', {
    

    inheritClass: 'base',


    init: function(properties) {
        properties = properties || {};

        if (properties.prerender == true) {
            delete(properties.prerender);
        }
        this.super(properties);

        this.isReady = false;
        
        this.position = new yespix.class.position(this.position || {}, this);
        this.aspect = new yespix.class.aspect(this.aspect || {}, this);
        this.boundary = this.boundary || {};
        this.manager = this.manager || null;

        if (this.collision) {

            this.collision = new yespix.class.collision(this.collision, this);
        }

        if (properties.prerender !== false) {
            this.prerender = new yespix.class.prerender(this.prerender, this);
        }

        this.checkReady();
    },


    setManager: function(manager) {
        this.manager = manager;
        if (this.collision) {
            this.collision.setManager(manager);
        }
    },


    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
        if (this.position && !this.position.isReady) return false;
        if (this.aspect && !this.aspect.isReady) return false;
        return this.super();
    },


    /**
     * Return True if something has changed (position, aspect ...)
     * @return {bool} 
     */
    getChanged: function() {
        if (this.position && this.position.isChanged) return true;
        if (this.aspect && this.aspect.isChanged) return true;
        return false;
    },


    /**
     * Set changed state
     */
    setChanged: function(b) {
        if (this.position) this.position.isChanged = b;
        if (this.aspect) this.aspect.isChanged = b;
    },


    /**
     * Try to draw the gfx entity on a context
     * @return {bool} True if drawn
     */
    draw: function(context) {
        // if cannot draw, exit now
        if (!this.canDraw(context)) return false;

        this.trigger(
            {
                type: 'render',
                from: this,
                fromClass: 'Entity',
                entity: this
            }
        );

        // get the draw box
        if (this.position.isChanged || this.aspect.isChanged) {
            this.boundary.draw = this.getBoundaryDraw();
        }

        // if cannot draw from this draw box
        //if (!this.canDrawBox(context)) return false;

        // prerender on canvas
        if (this.prerender) {
            if (this.prerender.use(context)) {
                this.setChanged(false);
                return true;
            }
        }

        this.drawRender(context);

        this.setChanged(false);
        
        // draw debug
        /*
        if (this.debug) this.debug.draw(context);
		*/
        // exit
        return true;
    },


    /**
     * Returns true if the entity can be drawn, get this information from basic properties of the entity
     * @return {bool} True if can be drawn
     */
    canDraw: function(context) {
        if (!context || !this.aspect || !this.aspect.isVisible || this.aspect.alpha <= 0) {
            return false;
        }
        return true;
    },


    /**
     * Return true if the entity can be drawn on context, get this information from the box coordinates.
     * @return {bool} True if can be drawn
     */
    /*
    canDrawBoundaryDraw: function(context) {

        if (this.box.draw.x >= context.canvas.clientWidth || this.box.draw.y >= context.canvas.clientHeight || this.box.draw.x + this.box.draw.width < 0 || this.box.draw.y + this.box.draw.height < 0)
            return false;
        return true;
    },
    */

    /**
     * Render the entity on the context with coordinates from the box
     * @param {object} context Context object
     * @param {object} box Box object with the coordinates
     */
    drawRender: function(context) {
        // Empty. 
        // Child entities must provide the code to draw something on the context
    },


    drawDebug: function(context) {
        if (!this.boundary.draw) {
            this.boundary.draw = this.getBoundaryDraw();
        }
        context.beginPath();
        context.rect(this.boundary.draw.x, this.boundary.draw.y, this.boundary.draw.width, this.boundary.draw.height);
        context.globalAlpha = 1.0;
        context.lineWidth = 1.0;
        context.strokeStyle = '#ff3300';
        context.stroke();

        context.beginPath();
        context.strokeStyle = '#0033ff';
        context.moveTo(this.position.x - 5, this.position.y - 5);
        context.lineTo(this.position.x + 5, this.position.y + 5);
        context.stroke();
        context.moveTo(this.position.x + 5, this.position.y - 5);
        context.lineTo(this.position.x - 5, this.position.y + 5);
        context.stroke();

        if (this.position.rotation != 0) {
            context.beginPath();
            context.strokeStyle = '#993399';
            var pivot = this.getPivot();
            context.moveTo(pivot.x - 5, pivot.y - 5);
            context.lineTo(pivot.x + 5, pivot.y + 5);
            context.stroke();
            context.moveTo(pivot.x + 5, pivot.y - 5);
            context.lineTo(pivot.x - 5, pivot.y + 5);
            context.stroke();
        }

        if (this.boundary.draw && this.boundary.draw.points) {
console.log(this.boundary.draw.points);                
            for (var t=0; t<1; t++) {
                context.beginPath();
                context.strokeStyle = '#ffff00';
                var x = this.boundary.draw.points[t*2],
                    y = this.boundary.draw.points[t*2+1];
                context.moveTo(x - 5, y);
                context.lineTo(x + 5, y);
                context.stroke();
                context.moveTo(x, y - 5);
                context.lineTo(x, y + 5);
                context.stroke();
            }
        }
    },


    rotatePoint(x, y, px, py, a) {
        var cos = Math.cos,
            sin = Math.sin,

            a = a * Math.PI / 180, // Convert to radians because that is what
                                   // JavaScript likes

            // Subtract midpoints, so that midpoint is translated to origin
            // and add it in the end again
            xr = (x - xm) * cos(a) - (y - ym) * sin(a)   + xm,
            yr = (x - xm) * sin(a) + (y - ym) * cos(a)   + ym;

        return [xr, yr];
    }

    //function getImageBounds(img, x, y, cx, cy, sx, sy, ang) {
    
    getBoundaryDraw: function() {
        var rad = yespix.degreeToRadian(this.position.rotation);

        // axis
        var xdx = Math.cos(rad) * this.aspect.width; // x axis
        var xdy = Math.sin(rad) * this.aspect.width;
        var ydx = -Math.sin(rad) * this.aspect.height; // y axis
        var ydy = Math.cos(rad) * this.aspect.height;

        var p = [// the 4 corner points [x,y,x,y...
            -this.position.pivotX * xdx + (-this.position.pivotY * ydy * 2) + this.position.x,
            this.position.pivotY * xdy + (-this.position.pivotX * ydx * 2) + this.position.y
/*            r * xdx + (-this.position.pivotY * ydx) + this.position.x,
            r * xdy + (-this.position.pivotY * ydy) + this.position.y,
            r * xdx + ydx + b * this.position.x,
            r * xdy + ydy + b * this.position.y,
            -this.position.pivotX * xdx + b * ydx + this.position.x,
            -this.position.pivotX * xdy + b * ydy + this.position.y*/
        ];

        return {
            points: p,
            x: Math.min(p[0], p[2], p[4], p[6]),
            y: Math.min(p[1], p[3], p[5], p[7]),
            width: Math.abs(Math.cos(rad))*this.aspect.width + Math.abs(Math.sin(rad))*this.aspect.height,
            height: Math.abs(Math.cos(rad))*this.aspect.height + Math.abs(Math.sin(rad))*this.aspect.width
        };

        //extent.right = Math.max(extent.right, p[0], p[2], p[4], p[6]);
        //extent.bottom = Math.max(extent.bottom, p[1], p[3], p[5], p[7]);
        //extent.width = extent.right - extent.left;
        //extent.height = extent.bottom - extent.top;
        //return extent;
    },

    /**
     * Boundary when gfx drawn on final canvas
     */
/*
    getBoundaryDraw: function() {
        var rad = yespix.degreeToRadian(this.position.rotation);
        var width = Math.abs(Math.cos(rad))*this.aspect.width + Math.abs(Math.sin(rad))*this.aspect.height;
        var height = Math.abs(Math.cos(rad))*this.aspect.height + Math.abs(Math.sin(rad))*this.aspect.width;

        // @TODO only works if pivot is at the center of the object
        var pivot = this.getPivot();
*/
/*        
        // NOT WORKING
        var dx = this.position.pivotX - this.aspect.width / 2;
        var dy = this.position.pivotY - this.aspect.height / 2;
        var h = Math.sqrt(dx*dx+dy*dy);
        var da = rad + Math.asin(dx/h);
        var x = pivot.x + this.aspect.width / 2 - width / 2 - h * Math.cos(da);
        var y = pivot.y + this.aspect.height / 2 - height / 2 - h * Math.sin(da);
console.log(dx, dy, h, da, rad, x, y);
*/
/*
        var x = pivot.x - width / 2;
        var y = pivot.y - height / 2;

        return {
            x: x,
            y: y,
            width: width,
            height: height
        };
    },
*/


    /**
     * Boundary on image
     */
    getBoundaryImage: function() {
        return {
            x: this.position.x,
            y: this.position.y,
            width: this.aspect.width,
            height: this.aspect.height
        };
    },


    /**
     * Boundary on image
     */
    getBoundaryRender: function() {
        return {
            x: 0,
            y: 0,
            width: this.aspect.width,
            height: this.aspect.height
        };
    },


    getBoundaryClip: function() {
        var clip = {
            x: this.aspect.clipX,
            y: this.aspect.clipY,
            width: this.aspect.clipWidth,
            height: this.aspect.clipHeight
        };
        
        if (!clip.width) clip.width = this.aspect.width;
        if (!clip.height) clip.height = this.aspect.height;

        return clip;
    },


    getPivot: function() {
        return {
            x: this.position.x + this.aspect.width / 2 + this.position.pivotX,
            y: this.position.y + this.aspect.height / 2 + this.position.pivotY
        }
    },


    trigger: function(event) {
        if (this.manager) {
            switch (event.type+':'+event.fromClass) {
                case 'change:Position':
                    if (event.entity && event.entity.position && event.entity.position.isZSorted == false) {
                        this.manager.isZSorted = false;
                    }
                    break;
            }
        }
        
        if (this.prerender) {
            this.prerender.trigger(event);
        }

        return this.super(event);
    },


    destroy: function() {
        this.super();
        if (this.collision) {
            this.collision.destroy();
            this.collision = null;
        }
    }
});
