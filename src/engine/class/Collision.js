

function Collision(options, entity) {

    options = options || {};
    if (entity) {
        this.entity = entity;
console.log('Collision: entity = ', entity);
        if (options.engine) {
            this.setEngine(options.engine);
        } else if (entity.engine) {
            this.setEngine(entity.engine);
        } else if (entity.manager && entity.manager.engine) {
            this.setEngine(entity.manager.engine);
        }
    }
    var varDefault = {
        x: 0,
        y: 0,
        width: 0,
        height: 0,
	    type: 'dynamic', // "static" / "dynamic"
        shape: 'rect', // "rect"
	    fixedRotation: false,
        restitution: 0.2
    };

    this.set(options, varDefault);
console.log('Collision:this.engine = ', this.engine);
    if (this.engine) {
        this.create();
    }
}


Collision.prototype.setEngine = function(engine) {
    this.engine = engine;
};


Collision.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);

    this.isChanged = true;
    this.entity.event(
        {
            type: 'change',
            entity: this.entity,
            from: this,
            fromClass: 'Collision',
            properties: options
        }
    );
};


Collision.prototype.create = function() {
console.log('collision:create: this = ', this);
    if (!this.engine || this.width == 0 || this.height == 0) {
        return false;
    }

    if (this.object) {
        // TODO delete the object
    }

    this.engine.create(this);
};


Collision.prototype.applyPosition = function() {
    
};


