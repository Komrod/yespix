
function Aspect(options, entity) {

    options = options || {};
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

    this.set(options, varDefault);
}

Aspect.prototype.set = function(options, varDefault) {
    
    if (options.width || options.height) {
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
console.log('this.entity.image = ', this.entity.image);
            }
        }
    }
    
    yespix.copy(options, this, varDefault);
    
    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            from: this,
            fromClass: 'Aspect',
            entity: this.entity,
            properties: options
        }
    );
}

