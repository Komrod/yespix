/**
 ***********************************************************************************************************
 ***********************************************************************************************************
 * YESPIX INIT
 */

/**
 * Initialisation of the YESPIX engine
 * @method init
 */
yespix.fn.init = function(options) {

    // current version of the engine
    this.version = "0.0.14";

    // store the options
    this.options = options || {};


    this.class = {};

    if (this.options['init']) this.options['init']();


    // set document and window
    this.document = this.options["document"] || document;
    this.window = this.options["window"] || window;

    initEntities(this);

    if (this.options['ready']) this.options['ready']();

    return this;
};
