/**
 * @class entity.gfx
 */
yespix.define('gfx', {
    inheritClass: 'base',

    init: function(options) {
        options = options || {};

        this.super(options);

        this.isReady = false;
        
        this.position = new Position(options.position || {}, this);
        this.aspect = new Aspect(options.aspect || {}, this);
        this.boundary = options.boundary || {};
        this.prerender = options.prerender || null;
        this.manager = options.manager || null;

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
     * Try to draw the gfx entity on a context
     * @return {bool} True if drawn
     */
    draw: function(context) {
        // if cannot draw, exit now
        if (!this.canDraw(context)) return false;

        // get the draw box
        if (this.position.isChanged || this.aspect.isChanged) {
            this.boundary.draw = this.getBoundaryDraw();
        }

        // if cannot draw from this draw box
        //if (!this.canDrawBox(context)) return false;

        // pre render on canvas
        /*if (this.prerender && this.prerenderCanvas && this.prerenderCanvas.width > 0) {

            // if changed, update the pre render canvas
            if (this.getChanged()) this.prerenderUpdate(context);

            // use the pre render canvas
            this.prerenderUse(context);

            // draw debug
            if (this.debug) this.drawDebug(context);

            // exit
            return this.drawExit(true);
        }*/

        this.drawRender(context);

        this.position.isChanged = false;
        this.aspect.isChanged = false;
        
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


    getBoundaryDraw: function() {
        return {

        };
    },


    /**
     * Event: some properties of the entity have changed
     */
    event: function(event) {
        if (!this.manager) return;
        switch (event.type+':'+event.fromClass) {
            case 'change:Position':
                if (event.entity && event.entity.position && event.entity.position.isZSorted == false) {
                    this.manager.isZSorted = false;
                }
                break;
        }
        return this.super(event);
    },

});
