
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
        this.isReady = true;
        this.entity.trigger(
            {
                type: 'ready',
                from: this,
                fromClass: 'Aspect',
                entity: this.entity,
                properties: { 
                    isReady: true
                }
            }
        );
    } else {
        this.isReady = false;
        this.entity.trigger(
            {
                type: 'notReady',
                from: this,
                fromClass: 'Aspect',
                entity: this.entity,
                properties: { 
                    isReady: false
                }
            }
        );
    }
};


Aspect.prototype.trigger = function(event) {
    if (event.from == this) return false;
};


Aspect.prototype.set = function(properties, varDefault) {
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
    this.entity.trigger(
        {
            type: 'change',
            from: this,
            fromClass: 'Aspect',
            entity: this.entity,
            properties: properties
        }
    );
}

yespix.defineClass('aspect', Aspect);
