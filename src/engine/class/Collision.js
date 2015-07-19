

function Collision(options, entity) {

    options = options || {};
    
    if (options.engine) {
        this.setEngine(options.engine);
    }

    if (entity) {
        this.entity = entity;
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
	    type: 'dynamic', // "static" / "dynamic" /  "kinetic" @TODO
        shape: 'rect', // "rect"

        density: 1.0,
        friction: 0.2,
        restitution: 0.0,
        linearDamping: 0.2,

        isSensor: false,
        fixedRotation: false,
        isBullet: false,
    };

    this.set(options, varDefault);
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

    if (this.entity.actor) {
        this.body = this.entity.actor.createPhysics(this);
    } else {
        this.body = this.engine.create(this);
    }
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


Collision.prototype.impulse = function(degrees, power, linear) {
    linear = linear || false;
    if (linear) {
        this.body.ApplyLinearImpulse(new Box2D.Common.Math.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.body.GetWorldCenter());
    } else {
        this.body.ApplyImpulse(new Box2D.Common.Math.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.body.GetWorldCenter());
    }
};


Collision.prototype.force = function(degrees, power, linear) {
    linear = linear || false;
    if (linear) {
        this.body.ApplyLinearForce(new Box2D.Common.Math.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.body.GetWorldCenter());
    } else {
        this.body.ApplyForce(new Box2D.Common.Math.b2Vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.body.GetWorldCenter());
    }
};


Collision.prototype.applyPhysics = function() {
    if (!this.body) {
        return false;
    }
    var position = this.body.GetPosition();
    var size = this.getSize();
    var angle = this.body.GetAngle();
    var degree = yespix.toDegree(angle);
    this.entity.set({
        position: {
            x: (position.x - size.width / 2 / this.engine.scale) * this.engine.scale - this.offsetX,
            y: (position.y - size.height / 2 / this.engine.scale) * this.engine.scale - this.offsetY,
            rotation: degree
        }
    });
    return true;
}


Collision.prototype.collisionBeginContact = function(contact, myFixture, otherBody, otherFixture) {
    if (this.entity.actor) {
        this.entity.actor.actorBeginContact(contact, myFixture, otherBody, otherFixture);
    }
};

Collision.prototype.collisionEndContact = function(contact, myFixture, otherBody, otherFixture) {
    if (this.entity.actor) {
        this.entity.actor.actorEndContact(contact, myFixture, otherBody, otherFixture);
    }
};

Collision.prototype.collisionPreSolve = function(contact, myFixture, otherBody, otherFixture, old) {
    if (this.entity.actor) {
        this.entity.actor.actorPreSolve(contact, myFixture, otherBody, otherFixture, old);
    }
};

Collision.prototype.collisionPostSolve = function(contact, myFixture, otherBody, otherFixture, impact) {
    if (this.entity.actor) {
        this.entity.actor.actorPostSolve(contact, myFixture, otherBody, otherFixture, impact);
    }
};


Collision.prototype.setFriction = function(friction, fixture) {
    if (!fixture) {
        var fixture = this.body.GetFixtureList();
        while (fixture) {
            fixture.SetFriction(friction);
            fixture = fixture.m_next;
        }
    } else {
        fixture.SetFriction(friction);
    }
};


Collision.prototype.setDensity = function(density, fixture) {
    if (!fixture) {
        var fixture = this.body.GetFixtureList();
        while (fixture) {
            fixture.SetDensity(density);
            fixture = fixture.m_next;
        }
    } else {
        fixture.SetDensity(density);
    }
    this.body.ResetMassData();
};


Collision.prototype.getLinearVelocity = function() {
    return this.body.GetLinearVelocity();
};

Collision.prototype.setLinearVelocity = function(vel) {
    return this.body.SetLinearVelocity(vel);
};
