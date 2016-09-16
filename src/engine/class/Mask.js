

/**
 * Mask class
 * Control the gfx mask
 * @events  create ready notReady change load unload destroy
 * @parent  entity
 */


function Mask(properties, entity) {
    
    properties = properties || {};
    if (entity) this.entity = entity;
    if (yespix.isString(properties)) {
        properties = {src: properties};
    }
    
    var varDefault = {
        src: '',  // source and params of the images
    };

    this.set(properties, varDefault);

    this.isReady =  false;
console.log('properties', properties);
console.log('yespix.class', yespix.class);
    this.image = new yespix.class.image(properties.src);

console.log('mask', this);    
    this.entityTrigger('create');

}


Mask.prototype.entityTrigger = function(type, properties) {
    if (this.entity) {
        properties = properties || {};
        this.entity.trigger(
            {
                type: type,
                entity: this.entity,
                from: this,
                fromClass: 'Mask',
                properties: properties
            }
        );
    }
};


Mask.prototype.ready = function(bool) {
    if (bool) {
        this.isReady = true;
        this.entityTrigger('ready');
    } else {
        this.isReady = false;
        this.entityTrigger('notReady');
    }
};


Mask.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entityTrigger('change', properties);
};


Mask.prototype.destroy = function() {

    this.entityTrigger('destroy');
    return true;
};


Mask.prototype.use = function(context) {
    
};


Mask.prototype.load = function(src) {
    
};


yespix.defineClass('mask', Mask);

