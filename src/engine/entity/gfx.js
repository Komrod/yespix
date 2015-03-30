/**
 * @class entity.gfx
 */
yespix.define('gfx', {
    inheritClass: 'base',

    position: null,
    aspect: null,

    isVisible: true,
    prerender: null,

    init: function(options) {
        this.super(options);

        this.position = new Position(this.options.position || {}, this);
        this.aspect = new Aspect(this.options.aspect || {}, this);
        this.boundary = {};
        this.isVisible = this.options.isVisible || true;
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
console.log('gfx::draw : context = ', context);
console.log('gfx::draw : this = ', this);
console.log('gfx::draw : this.canDraw(context) = ', this.canDraw(context));
        // if cannot draw, exit now
        if (!this.canDraw(context)) return false;

//console.log('gfx::draw : this.getChanged() = ', this.getChanged());
        // get the draw box
        //if (this.getChanged()) this.getBoundary(false);

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
        if (!context || !this.isVisible || this.aspect.alpha <= 0)
            return false;

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
        // Child entities must provide the code to draw something on the 2d context
    },


    getBoundaryDraw: function() {
        if (this.boundary.draw) return this.boundary.draw;

        this.boundary.draw = {

        };
        return this.boundary.draw;
    },

    getBoundaryCollision: function() {
        if (this.boundary.collision) return this.boundary.collision;
    },


});
