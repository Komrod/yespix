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
        if (this.debug) {
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
        }
    },


    /**
     * Boundary when gfx drawn on final canvas
     */
    getBoundaryDraw: function() {
        var rad = yespix.degreeToRadian(this.position.rotation);
        var width = Math.abs(Math.cos(rad))*this.aspect.width + Math.abs(Math.sin(rad))*this.aspect.height;
        var height = Math.abs(Math.cos(rad))*this.aspect.height + Math.abs(Math.sin(rad))*this.aspect.width;

        // @TODO only works if pivot is at the center of the object
        var pivot = this.getPivot();

        var x = this.position.x - width / 2 + this.aspect.width / 2; //     + (pivot.x - this.aspect.width / 2) * Math.cos(rad) - width * Math.cos(rad);
        var y = this.position.y - height / 2 + this.aspect.height / 2; //   + (pivot.y - this.aspect.height / 2) * Math.sin(rad) - height * Math.sin(rad);
        
        return {
            x: x,
            y: y,
            width: width,
            height: height
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
