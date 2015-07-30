

function EngineBox2d(options) {
	options = options || {};

	var varDefault = {
		gravity: 20,
		allowSleep: true,
		scale: 30,
		fixedRotation: false,
		linearDamping: 0.1,
		isBullet: false,
		density: 1.0,
		friction: 0.2,
		restitution: 0.2,
		isSensor: false
	};

	yespix.copy(options, this, varDefault);

	this.world = new Box2D.Dynamics.b2World(new Box2D.Common.Math.b2Vec2(0, this.gravity), this.allowSleep);

	this.bodyDef = new Box2D.Dynamics.b2BodyDef;
	this.bodyDef.fixedRotation = this.fixedRotation; 
	this.bodyDef.linearDamping = this.linearDamping;
	this.bodyDef.isBullet = this.isBullet;

	this.fixDef = new Box2D.Dynamics.b2FixtureDef;
	this.fixDef.density = this.density;
	this.fixDef.friction = this.friction;
	this.fixDef.restitution = this.restitution;
	this.fixDef.isSensor = this.isSensor;

}


EngineBox2d.prototype.setManager = function(manager) {
    this.manager = manager;
    if (manager.canvas) {
    	this.canvas = manager.canvas;
    }
    if (manager.context) {
    	this.context = manager.context;
    }
    this.initDebug();
};


EngineBox2d.prototype.initDebug = function() {
	// setup debug draw
	this.debugDraw = new Box2D.Dynamics.b2DebugDraw();
	this.debugDraw.SetSprite(this.context);
	this.debugDraw.SetDrawScale(this.scale);
	this.debugDraw.SetFillAlpha(0.1);
	this.debugDraw.SetLineThickness(1.0);
	this.debugDraw.SetFlags(Box2D.Dynamics.b2DebugDraw.e_shapeBit | Box2D.Dynamics.b2DebugDraw.e_jointBit);
	this.world.SetDebugDraw(this.debugDraw);
};


EngineBox2d.prototype.create = function(collision) {
	if (collision.shape == 'rect') {
		var position = collision.getPosition();
		var size = collision.getSize();
		return this.createRect(position.x, position.y, size.width, size.height, collision);
	}
};


EngineBox2d.prototype.createRect = function(x, y, width, height, collision) {
	var body = this.createBody(x, y, width, height, collision);
	this.createFixture(0, 0, width, height, collision, body);
	return body;
};


EngineBox2d.prototype.createBody = function(x, y, width, height, collision) {
	collision = collision || {};
	this.setBody(collision);

	if (collision.type == 'static') {
		this.bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	} else if (collision.type == 'kinematic') {
		this.bodyDef.type = Box2D.Dynamics.b2Body.b2_kinematicBody;
	} else {
		this.bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	}

	this.bodyDef.position.x = x / this.scale + width / 2 / this.scale;
	this.bodyDef.position.y = y / this.scale + height / 2 / this.scale;

	var body = this.world.CreateBody(this.bodyDef);

	if (collision.entity) {
		body.SetUserData({collision: collision, entity: collision.entity});
	}

	return body;
};


EngineBox2d.prototype.setBody = function(collision) {
	
	if (!yespix.isUndefined(collision.fixedRotation)) {
		this.bodyDef.fixedRotation = collision.fixedRotation;
	} else {
		this.bodyDef.fixedRotation = this.fixedRotation;
	}
	if (!yespix.isUndefined(collision.linearDamping)) {
		this.bodyDef.linearDamping = collision.linearDamping;
	} else {
		this.bodyDef.linearDamping = this.linearDamping;
	}
	if (!yespix.isUndefined(collision.isBullet)) {
		this.bodyDef.isBullet = collision.isBullet;
	} else {
		this.bodyDef.isBullet = this.isBullet;
	}
};


EngineBox2d.prototype.createFixture = function(offsetX, offsetY, width, height, collision, body) {
	collision = collision || {};
	this.setFixture(collision);
	this.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
	this.fixDef.shape.SetAsBox(width / 2 / this.scale, height / 2 / this.scale);
	if (offsetX != 0 || offsetY != 0) {
		this.moveShape(this.fixDef.shape, offsetX / this.scale, offsetY / this.scale);
	}

	var fixture = body.CreateFixture(this.fixDef, 1);

	if (collision.userData) {
		fixture.SetUserData(collision.userData);
	}

	return fixture;
};


EngineBox2d.prototype.moveShape = function(shape, x, y) {
	for (var t=0; t<shape.m_vertices.length; t++) {
		shape.m_vertices[t].x += x;
		shape.m_vertices[t].y += y;
	}
};


EngineBox2d.prototype.setFixture = function(collision) {
	//this.fixDef = new Box2D.Dynamics.b2FixtureDef;
	if (!yespix.isUndefined(collision.restitution)) {
		this.fixDef.restitution = collision.restitution;
	} else {
		this.fixDef.restitution = this.restitution;
	}
	if (!yespix.isUndefined(collision.isSensor)) {
		this.fixDef.isSensor = collision.isSensor;
	} else {
		this.fixDef.isSensor = this.isSensor;
	}
	if (!yespix.isUndefined(collision.friction)) {
		this.fixDef.friction = collision.friction;
	} else {
		this.fixDef.friction = this.friction;
	}
	if (!yespix.isUndefined(collision.density)) {
		this.fixDef.density = collision.density;
	} else {
		this.fixDef.density = this.density;
	}
};


EngineBox2d.prototype.createListener = function(beginContact, endContact, preSolve, postSolve) {
	this.listener = new Box2D.Dynamics.b2ContactListener;
	
	beginContact = beginContact || this.beginContact;
	endContact = endContact || this.endContact;
	preSolve = preSolve || this.preSolve;
	postSolve = postSolve || this.postSolve;

	this.listener.BeginContact = beginContact;
	this.listener.EndContact = endContact;
	this.listener.PreSolve = preSolve;
	this.listener.PostSolve = postSolve;

	this.world.SetContactListener(this.listener);
	return this.listener;
};


EngineBox2d.prototype.getListener = function() {
    if (!this.listener) {
        this.createListener();
    }
	return this.listener;
};


EngineBox2d.prototype.removetListener = function() {
	this.listener.BeginContact = null;
	this.listener.EndContact = null;
	this.listener = null;
};


EngineBox2d.prototype.createCircle = function() {
	/*bodyDef.type = b2Body.b2_dynamicBody;
	fixDef.shape = new b2CircleShape(
	Math.random() * 0.5 + 0.1 //radius
	);
	bodyDef.position.x = Math.random() * 25;
	bodyDef.position.y = Math.random() * 10;
	world.CreateBody(bodyDef).CreateFixture(fixDef);*/
};


EngineBox2d.prototype.beginContact = function(contact) {
	var data = null;
	data = contact.GetFixtureA().GetBody().GetUserData();
	if (data && data.entity && data.entity.collision) {
		data.entity.collision.collisionBeginContact(contact, contact.GetFixtureA(), contact.GetFixtureB().GetBody(), contact.GetFixtureB());
	}
	data = contact.GetFixtureB().GetBody().GetUserData();
	if (data && data.entity && data.entity.collision) {
		data.entity.collision.collisionBeginContact(contact, contact.GetFixtureA(), contact.GetFixtureB().GetBody(), contact.GetFixtureB());
	}
};


EngineBox2d.prototype.endContact = function(contact) {
	var data = null;
	data = contact.GetFixtureA().GetBody().GetUserData();
	if (data && data.entity && data.entity.collision) {
		data.entity.collision.collisionEndContact(contact, contact.GetFixtureA(), contact.GetFixtureB().GetBody(), contact.GetFixtureB());
	}
	data = contact.GetFixtureB().GetBody().GetUserData();
	if (data && data.entity && data.entity.collision) {
		data.entity.collision.collisionEndContact(contact, contact.GetFixtureB(), contact.GetFixtureA().GetBody(), contact.GetFixtureA());
	}
};


EngineBox2d.prototype.preSolve = function(contact, old) {
	var data = null;
	data = contact.GetFixtureA().GetBody().GetUserData();
	if (data && data.entity && data.entity.collision) {
		data.entity.collision.collisionPreSolve(contact, contact.GetFixtureA(), contact.GetFixtureB().GetBody(), contact.GetFixtureB(), old);
	}
	data = contact.GetFixtureB().GetBody().GetUserData();
	if (data && data.entity && data.entity.collision) {
		data.entity.collision.collisionPreSolve(contact, contact.GetFixtureA(), contact.GetFixtureB().GetBody(), contact.GetFixtureB(), old);
	}
};


EngineBox2d.prototype.postSolve = function(contact, impulse) {
	var data = null;
	data = contact.GetFixtureA().GetBody().GetUserData();
	if (data && data.entity && data.entity.collision) {
		data.entity.collision.collisionPostSolve(contact, contact.GetFixtureA(), contact.GetFixtureB().GetBody(), contact.GetFixtureB(), impulse);
	}
	data = contact.GetFixtureB().GetBody().GetUserData();
	if (data && data.entity && data.entity.collision) {
		data.entity.collision.collisionPostSolve(contact, contact.GetFixtureB(), contact.GetFixtureA().GetBody(), contact.GetFixtureA(), impulse);
	}
};


EngineBox2d.prototype.setFriction = function(body, friction, fixture) {
    if (!fixture) {
        var fixture = body.GetFixtureList();
        while (fixture) {
            fixture.SetFriction(friction);
            fixture = fixture.m_next;
        }
    } else {
        fixture.SetFriction(friction);
    }
    return true;
};


EngineBox2d.prototype.setDensity = function(body, density, fixture) {
    if (!fixture) {
        var fixture = body.GetFixtureList();
        while (fixture) {
            fixture.SetDensity(density);
            fixture = fixture.m_next;
        }
    } else {
        fixture.SetDensity(density);
    }
    body.ResetMassData();
    return true;
};


EngineBox2d.prototype.getLinearVelocity = function(body) {
    return body.GetLinearVelocity();
};


EngineBox2d.prototype.setLinearVelocity = function(body, vel) {
    return body.SetLinearVelocity(vel);
};


EngineBox2d.prototype.vec2 = function(x, y) {
	return new Box2D.Common.Math.b2Vec2(x, y);
};


EngineBox2d.prototype.applyLinearImpulse = function(body, degrees, power) {
	return body.ApplyLinearImpulse(this.vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.getCenter(body));
};


EngineBox2d.prototype.applyImpulse = function(body, degrees, power) {
	return body.ApplyImpulse(this.vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.getCenter(body));
};


EngineBox2d.prototype.applyLinearForce = function(body, degrees, power) {
	return body.ApplyLinearForce(this.vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.getCenter(body));
};


EngineBox2d.prototype.applyForce = function(body, degrees, power) {
	return body.ApplyForce(this.vec2(Math.cos(degrees * (Math.PI / 180)) * power, Math.sin(degrees * (Math.PI / 180)) * power), this.getCenter(body));
};


EngineBox2d.prototype.getCenter = function(body) {
	return body.GetWorldCenter();
};


EngineBox2d.prototype.getPosition = function(body) {
	return body.GetPosition();
};


EngineBox2d.prototype.getAngleDegree = function(body) {
    return yespix.radianToDegree(body.GetAngle());
};


EngineBox2d.prototype.getAngleRad = function(body) {
    return body.GetAngle();
};


EngineBox2d.prototype.getTouchList = function(body, fixture) {
    var edge = fixture.GetBody().GetContactList();
    var list = new Array();
    
    while (edge) {
        if (edge.contact.IsTouching()) {
        	if (!fixture) {
	        	if (edge.contact.GetFixtureA().GetBody() == body) {
	        		list.push({contact: edge.contact, body: edge.contact.GetFixtureB().GetBody(), fixture: edge.contact.GetFixtureB()});
	        	} else if (edge.contact.GetFixtureB().GetBody() == body) {
	        		list.push({contact: edge.contact, body: edge.contact.GetFixtureA().GetBody(), fixture: edge.contact.GetFixtureA()});
	            }
        	} else if (edge.contact.GetFixtureA() == fixture) {
        		list.push({contact: edge.contact, body: edge.contact.GetFixtureB().GetBody(), fixture: edge.contact.GetFixtureB()});
        	} else if (edge.contact.GetFixtureB() == fixture) {
        		list.push({contact: edge.contact, body: edge.contact.GetFixtureA().GetBody(), fixture: edge.contact.GetFixtureA()});
            }
        }
        edge = edge.next;
    }

    return list;
};


EngineBox2d.prototype.getUserData = function(object) {
    object = object || this.body;
    if (object.GetUserData) {
    	return object.GetUserData();
    } else {
    	return object.userData;
    }
};


EngineBox2d.prototype.setUserData = function(data, object) {
    object = object || this.body;
	if (object.SetUserData) {
		return object.SetUserData(data);
	} else {
    	object.userData = data;
    	return true;
   	}
};

