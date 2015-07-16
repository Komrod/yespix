

function EngineBox2d(options) {
	options = options || {};

	this.world = new Box2D.Dynamics.b2World(
	     new Box2D.Common.Math.b2Vec2(0, 10) // gravity
	  ,  true // allow sleep
	);

	this.scale = options.scale || 100;

	this.fixDef = new Box2D.Dynamics.b2FixtureDef;
	this.fixDef.density = this.defaultDensity = options.density || 1.0;
	this.fixDef.friction = this.defaultFriction = options.friction || 0.5;
	this.fixDef.restitution = this.defaultRestitution = options.restitution || 0.2;
	this.fixDef.isSensor = this.defaultIsSensor = options.isSensor || false;

	this.bodyDef = new Box2D.Dynamics.b2BodyDef;
	this.bodyDef.fixedRotation = this.defaultFixedRotation = options.fixedRotation || false;
	this.bodyDef.linearDamping = this.defaultLinearDamping = options.linearDamping || 0.1;
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
	this.debugDraw.SetFillAlpha(0.3);
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
	this.createFixture(0.5, 0.5, width, height, collision, body);
	return body;
};


EngineBox2d.prototype.createBody = function(x, y, width, height, collision) {
	collision = collision || {};
	this.setBody(collision);

	if (collision.type == 'static') this.bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	else this.bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

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
		this.bodyDef.fixedRotation = this.defaultFixedRotation;
	}
	if (!yespix.isUndefined(collision.linearDamping)) {
		this.bodyDef.linearDamping = collision.linearDamping;
	} else {
		this.bodyDef.linearDamping = this.defaultLinearDamping;
	}
};


EngineBox2d.prototype.createFixture = function(offsetX, offsetY, width, height, collision, body) {
	collision = collision || {};
	this.setFixture(collision);
	this.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
//console.log('createFixture: setAsBox: offsetX = ', offsetX, ', offsetY = ', offsetY);
	this.fixDef.shape.SetAsBox(width / 2 / this.scale, height / 2 / this.scale);
	if (offsetX != 0 || offsetY != 0) {
		this.moveShape(this.fixDef.shape, offsetX / this.scale, offsetY / this.scale);
	}
//console.log(this.fixDef);
	//body.CreateFixture(this.fixDef, 0);
	// SetPosition (new b2Vec2(x,y) )
	//this.fixDef.SetPosition(new Box2D.Common.Math.b2Vec2(relativeX, relativeY));
	//body.SetPosition(new Box2D.Common.Math.b2Vec2(relativeX, relativeY));
	//this.fixDef.shape.SetAsBox(12, 12, new Box2D.Common.Math.b2Vec2(-1000, 1000), 0);
//	body.CreateFixture(this.fixDef, 1);

	var fixture = body.CreateFixture(this.fixDef, 1);
//console.log('createFixture: create fixture: collision = ', collision);

	if (collision.userData) {
//console.log('createFixture: set user data')		;
		//fixture.m_userData = collision.userData;
		fixture.SetUserData(collision.userData);
	}
//console.log('createFixture: GetUserData = ', fixture.GetUserData(), ', fixture = ', fixture);

	return fixture;
};


EngineBox2d.prototype.moveShape = function(shape, x, y) {
	for (var t=0; t<shape.m_vertices.length; t++) {
		shape.m_vertices[t].x += x;
		shape.m_vertices[t].y += y;
	}
//console.log('apres shape = ', shape);
};


EngineBox2d.prototype.setFixture = function(collision) {
	//this.fixDef = new Box2D.Dynamics.b2FixtureDef;
	if (!yespix.isUndefined(collision.restitution)) {
		this.fixDef.restitution = collision.restitution;
	} else {
		this.fixDef.restitution = this.defaultRestitution;
	}
	if (!yespix.isUndefined(collision.isSensor)) {
		this.fixDef.isSensor = collision.isSensor;
	} else {
		this.fixDef.isSensor = this.defaultIsSensor;
	}
	if (!yespix.isUndefined(collision.friction)) {
		this.fixDef.friction = collision.friction;
	} else {
		this.fixDef.friction = this.defaultFriction;
	}
	if (!yespix.isUndefined(collision.density)) {
		this.fixDef.density = collision.density;
	} else {
		this.fixDef.density = this.defaultDensity;
	}
};


EngineBox2d.prototype.createListener = function(beginContact, endContact) {
//console.log('createListener');
	this.listener = new Box2D.Dynamics.b2ContactListener;
	beginContact = beginContact || this.beginContact;
	endContact = endContact || this.endContact;
	this.listener.BeginContact = beginContact;
	this.listener.EndContact = endContact;
	this.world.SetContactListener(this.listener);
	return this.listener;
};


EngineBox2d.prototype.getListener = function() {
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

