

function Collision(options, entity) {

    options = options || {};
    
    if (options.physics) {
        this.setPhysics(options.physics);
    }

    if (entity) {
        this.entity = entity;
        if (!options.physics) {
            if (entity.physics) {
                this.setEngine(entity.physics);
            } else if (entity.manager && entity.manager.physics) {
                this.setEngine(entity.manager.physics);
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
    if (this.physics) {
        this.create();
        this.isReady = true;
    }
}


Collision.prototype.setPhysics = function(physics) {
    this.physics = physics;
};


Collision.prototype.set = function(options, varDefault) {
    yespix.copy(options, this, varDefault);

    if (this.body) {

    }

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
    if (!this.physics) {
        return false;
    }

    if (this.body) {
        // TODO delete previous body
    }

    if (this.entity.actor) {
        this.body = this.entity.actor.createPhysics(this);
    } else {
        this.body = this.physics.create(this);
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
        this.physics.applyLinearImpulse(this.body, degrees, power);
    } else {
        this.physics.applyImpulse(this.body, degrees, power);
    }
};


Collision.prototype.force = function(degrees, power, linear) {
    linear = linear || false;
    if (linear) {
        this.physics.applyLinearForce(this.body, degrees, power);
    } else {
        this.physics.applyForce(this.body, degrees, power);
    }
};


Collision.prototype.applyPhysics = function() {
    if (!this.body) {
        return false;
    }
    var position = this.physics.getPosition(this.body);
    var size = this.getSize();
    var degree = this.physics.getAngleDegree(this.body);
    this.entity.set({
        position: {
            x: (position.x - size.width / 2 / this.physics.scale) * this.physics.scale - this.offsetX,
            y: (position.y - size.height / 2 / this.physics.scale) * this.physics.scale - this.offsetY,
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
        this.entity.actor.actorPostSolve(contact, myFixture, otherBody, otherFixture, impact)
    }
};


Collision.prototype.setFriction = function(friction, fixture) {

    return this.physics.setFriction(this.body, friction, fixture);
    /*
    if (!fixture) {
        var fixture = this.body.GetFixtureList();
        while (fixture) {
            fixture.SetFriction(friction);
            fixture = fixture.m_next;
        }
    } else {
        fixture.SetFriction(friction);
    }
    */
};


Collision.prototype.setDensity = function(density, fixture) {
    return this.physics.setDensity(this.body, density, fixture);
    /*
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
    */
};


Collision.prototype.getLinearVelocity = function() {
    return this.physics.getLinearVelocity(this.body);
};

Collision.prototype.setLinearVelocity = function(vel) {
    return this.physics.setLinearVelocity(this.body, vel);
};

Collision.prototype.getTouchList = function(fixture) {
    return this.physics.getTouchList(this.body, fixture);
};

Collision.prototype.setUserData = function(data, fixture) {
    if (!fixture) {
        return this.physics.setUserData(this.body, object);
    } else {
        return this.physics.setUserData(fixture, object);
    }
};

Collision.prototype.getUserData = function(fixture) {
    return this.physics.getUserData(fixture);
};

