

/**
 * Aspect class
 * Control the aspect of the Gfx
 * @events  create ready notReady change destroy
 * @parent  entity
 */


function Aspect(properties, entity) {

    properties = properties || {};
    if (entity) this.entity = entity;

    var varDefault = {
        alpha: 1,
        
        width: 0,
        height: 0,
        
        isVisible: true,
        
        flipX: false,
        flipY: false,
        
        clipX: 0,
        clipY: 0,
        clipWidth: 0,
        clipHeight: 0
    };

    this.set(properties, varDefault);

    this.ready(true);
}


Aspect.prototype.ready = function(bool) {
    if (bool) {
        if (this.isReady) return false;
        this.isReady = true;
        this.entityTrigger('ready');
    } else {
        if (!this.isReady) return false;
        this.isReady = false;
        this.entityTrigger('notReady');
    }
};


Aspect.prototype.trigger = function(event) {
    if (event.from == this) return false;
};


Aspect.prototype.entityTrigger = function(type, properties) {
    if (this.entity) {
        properties = properties || {};
        this.entity.trigger(
            {
                type: type,
                entity: this.entity,
                from: this,
                fromClass: 'Aspect',
                properties: properties
            }
        );
    }
};


Aspect.prototype.set = function(properties, varDefault) {
    // auto size from entity.image
    if (properties.width || properties.height) {
        if (this.entity && this.entity.image) {
            if (this.entity.image.set) {
                this.entity.image.set({autoSize: false});
            } else {
                if (yespix.isString(this.entity.image)) {
                    this.entity.image = {
                        src: this.entity.image,
                        autoSize: false
                    };
                } else {
                    this.entity.image.autoSize = false;
                }
            }
        }
    }
    
    yespix.copy(properties, this, varDefault);
    
    this.isChanged = true;
    this.entityTrigger('change', properties);
}


yespix.defineClass('aspect', Aspect);

