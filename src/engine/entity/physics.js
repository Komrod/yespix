

/*
function Collision(options, entity) {

    options = options || {};
    
    if (options.engine) {
        this.setEngine(options.engine);
    }

    if (entity) {
        this.entity = entity;
//console.log('Collision: entity = ', entity);
        if (!options.engine) {
            if (entity.engine) {
                this.setEngine(entity.engine);
            } else if (entity.manager && entity.manager.engine) {
                this.setEngine(entity.manager.engine);
            }
        }
    }
    var varDefault = {
        offsetX: 0,
        offsetY: 0,
        width: 0,
        height: 0,
        type: 'dynamic', // "static" / "dynamic"
        shape: 'rect', // "rect"
        fixedRotation: false,
        restitution: 0.2
    };

    this.set(options, varDefault);
//console.log('Collision:this.engine = ', this.engine);
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
//console.log('collision:create: this = ', this);
    if (!this.engine) {
        return false;
    }

    if (this.object) {
        // TODO delete the object
    }

    this.object = this.engine.create(this);
};


Collision.prototype.getPosition = function() {
    return {
        x: this.entity.position.x + this.offsetX,
        y: this.entity.position.y + this.offsetY
    };        
};


Collision.prototype.getSize = function() {
    return {
        width: this.width || this.entity.aspect.width,
        height: this.height || this.entity.aspect.height
    };        
}


Collision.prototype.applyPhysics = function() {
    if (!this.object) {
        return false;
    }
    var position = this.object.GetBody().GetPosition();
    var size = this.getSize();
    var angle = this.object.GetBody().GetAngle();
    var degree = yespix.toDegree(angle);
//console.log('angle = '+angle+', degree = '+degree);
    this.entity.set({
        position: {
            x: (position.x - size.width / 2 / this.engine.scale) * this.engine.scale - this.offsetX,
            y: (position.y - size.height / 2 / this.engine.scale) * this.engine.scale - this.offsetY,
            rotation: degree
        }
    });
    return true;
}

*/
yespix.define('physics', {


    init: function(options, entity) {
        options = options || {};
        if (entity) this.entity = entity;

        var varDefault = {
            isAttacking: false,
            isFalling: false,
            isJumping: false,
            isOnGround: false,
            isIdle: true,

            shield: 0,
            life: 100,
            power: 100,
            stamina: 100,
            level: 1

        };

        this.set(options, varDefault);
    },


    set: function(properties, varDefault) {
        yespix.copy(properties, this, varDefault);

        this.entity.event(
            {
                type: 'change',
                from: this,
                fromClass: 'actor',
                entity: this.entity,
                properties: properties
            }
        );

    },


    event: function(event) {
        if (this.entity) this.entity.event(event);
        return true;
    },


    prepare: function() {
console.log('actor: ok');

    },


});
