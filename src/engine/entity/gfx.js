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
            for (var t=0; t<4; t++) {
                context.beginPath();
                context.strokeStyle = '#ffff00';
                var x = this.boundary.draw.points[t].x,
                    y = this.boundary.draw.points[t].y;
                context.moveTo(x - 5, y);
                context.lineTo(x + 5, y);
                context.stroke();
                context.moveTo(x, y - 5);
                context.lineTo(x, y + 5);
                context.stroke();
            }
            context.beginPath();
            context.strokeStyle = '#333';
            context.globalAlpha = 0.3;
            context.lineWidth = 2.0;
            context.moveTo(this.boundary.draw.points[0].x, this.boundary.draw.points[0].y);
            context.lineTo(this.boundary.draw.points[1].x, this.boundary.draw.points[1].y);
            context.lineTo(this.boundary.draw.points[3].x, this.boundary.draw.points[3].y);
            context.lineTo(this.boundary.draw.points[2].x, this.boundary.draw.points[2].y);
            context.lineTo(this.boundary.draw.points[0].x, this.boundary.draw.points[0].y);
            context.stroke();
        }
    },


    rotatePoint: function(x, y, px, py, ang) {
        ang = ang * Math.PI / 180;
        var  xr = (x - px) * Math.cos(ang) - (y - py) * Math.sin(ang) + px,
             yr = (x - px) * Math.sin(ang) + (y - py) * Math.cos(ang) + py;
        return {x: xr, y: yr};
    },


    getBoundaryDraw: function() {
        var pivot = this.getPivot();
        var points = [
            this.rotatePoint(
                this.position.x, 
                this.position.y, 
                pivot.x, 
                pivot.y, 
                this.position.rotation),

            this.rotatePoint(
                this.position.x + this.aspect.width, 
                this.position.y, 
                pivot.x, 
                pivot.y, 
                this.position.rotation),

            this.rotatePoint(
                this.position.x, 
                this.position.y + this.aspect.height, 
                pivot.x, 
                pivot.y, 
                this.position.rotation),

            this.rotatePoint(
                this.position.x + this.aspect.width, 
                this.position.y + this.aspect.height, 
                pivot.x, 
                pivot.y, 
                this.position.rotation)
        ];

        var rad = this.position.rotation * Math.PI / 180;

        return {
            points: points,
            x: Math.min(points[0].x, points[1].x, points[2].x, points[3].x),
            y: Math.min(points[0].y, points[1].y, points[2].y, points[3].y),
            width: Math.abs(Math.cos(rad))*this.aspect.width + Math.abs(Math.sin(rad))*this.aspect.height,
            height: Math.abs(Math.cos(rad))*this.aspect.height + Math.abs(Math.sin(rad))*this.aspect.width
        };
    },


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
