/**
 ***********************************************************************************************************
 ***********************************************************************************************************
 * YESPIX INIT
 */

/**
 * Initialisation of the YESPIX engine
 * @method init
 */
yespix.fn.init = function(properties) {

    // current version of the engine
    this.version = "0.0.14";

    // store the properties
    this.properties = properties || {};


    this.class = {};
    this.entity = {};

    this.cache = {};

    if (this.properties['init']) this.properties['init']();


    // set document and window
    this.document = this.properties["document"] || document;
    this.window = this.properties["window"] || window;

    initEntities(this);

    if (this.properties['ready']) this.properties['ready']();

    return this;
};
