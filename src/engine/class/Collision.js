

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
        density: 1.0,
        friction: 0.9,
        restitution: 0.05,
        isSensor: false,
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

    if (this.body) {
        // TODO delete previous body
    }

    this.body = this.engine.create(this);
    this.createGroundDetection();
};


Collision.prototype.createGroundDetection = function() {
console.log('createGroundDetection');
    var size = this.getSize();
    return this.engine.createFixture(0, 72, 110, 5, {isSensor: true}, this.body);
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


Collision.prototype.impulse = function(degrees, power) {

    this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.body.GetWorldCenter());
};


Collision.prototype.force = function(degrees, power) {
    this.body.ApplyForce(new Box2D.Common.Math.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.body.GetWorldCenter());
};


Collision.prototype.applyPhysics = function() {
    if (!this.body) {
        return false;
    }
    var position = this.body.GetPosition();
    var size = this.getSize();
    var angle = this.body.GetAngle();
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
