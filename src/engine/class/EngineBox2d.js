

function EngineBox2d(options) {
	options = options || {};

	this.world = new Box2D.Dynamics.b2World(
	     new Box2D.Common.Math.b2Vec2(0, 20) // gravity
	  ,  true // allow sleep
	);

	this.scale = options.scale || 10;

	this.fixDef = new Box2D.Dynamics.b2FixtureDef;
	this.fixDef.density = this.defaultDensity = options.density || 1.0;
	this.fixDef.friction = this.defaultFriction = options.friction || 0.5;
	this.fixDef.restitution = this.defaultRestitution = options.restitution || 0.2;
	this.fixDef.isSensor = this.defaultIsSensor = options.isSensor || false;

	this.bodyDef = new Box2D.Dynamics.b2BodyDef;
	this.bodyDef.fixedRotation = this.defaultFixedRotation = options.fixedRotation || false;
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


EngineBox2d.prototype.create = function(parameters) {
console.log('EngineBox2d:create: parameters.shape = ', parameters.shape);
	if (parameters.shape == 'rect') {
console.log('EngineBox2d:create: ok');
		var position = parameters.getPosition();
		var size = parameters.getSize();
console.log('EngineBox2d:create: position = ', position, ', size = ', size);
		
		return this.createRect(position.x, position.y, size.width, size.height, false, parameters);
	}
};


EngineBox2d.prototype.createRect = function(x, y, width, height, static, parameters) {

	var body = this.createBody(x, y, width, height, static, parameters);
	this.createFixture(0.5, 0.5, width, height, parameters, body);
	return body;
	/*
	static = static || false;
	this.setToDefault();

	if (static) this.bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	else this.bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;
	
	this.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape;
	this.fixDef.shape.SetAsBox(width / 2 / this.scale, height / 2 / this.scale);
	this.bodyDef.position.x = x / this.scale + width / 2 / this.scale;
	this.bodyDef.position.y = y / this.scale + height / 2 / this.scale;

	if (options) {
		this.set(options);
	}

	if (object) {
		return object.GetBody().CreateFixture(this.fixDef);
	} else {
		return this.world.CreateBody(this.bodyDef).CreateFixture(this.fixDef);
	}
	*/

};


EngineBox2d.prototype.createBody = function(x, y, width, height, static, parameters) {
	parameters = parameters || {};
	this.setBody(parameters);

	if (static) this.bodyDef.type = Box2D.Dynamics.b2Body.b2_staticBody;
	else this.bodyDef.type = Box2D.Dynamics.b2Body.b2_dynamicBody;

	this.bodyDef.position.x = x / this.scale + width / 2 / this.scale;
	this.bodyDef.position.y = y / this.scale + height / 2 / this.scale;

	return this.world.CreateBody(this.bodyDef);
};


EngineBox2d.prototype.setBody = function(parameters) {
	
	if (!yespix.isUndefined(parameters.fixedRotation)) {
		this.bodyDef.fixedRotation = parameters.fixedRotation;
	} else {
		this.bodyDef.fixedRotation = this.defaultFixedRotation;
	}
};


EngineBox2d.prototype.createFixture = function(offsetX, offsetY, width, height, parameters, body) {
	parameters = parameters || {};
	this.setFixture(parameters);
	this.fixDef.shape = new Box2D.Collision.Shapes.b2PolygonShape();
console.log('createFixture: setAsBox: offsetX = ', offsetX, ', offsetY = ', offsetY);
	this.fixDef.shape.SetAsBox(width / 2 / this.scale, height / 2 / this.scale);
	if (offsetX != 0 || offsetY != 0) {
		this.moveShape(this.fixDef.shape, offsetX / this.scale, offsetY / this.scale);
	}
console.log(this.fixDef);
	//body.CreateFixture(this.fixDef, 0);
	// SetPosition (new b2Vec2(x,y) )
	//this.fixDef.SetPosition(new Box2D.Common.Math.b2Vec2(relativeX, relativeY));
	//body.SetPosition(new Box2D.Common.Math.b2Vec2(relativeX, relativeY));
	//this.fixDef.shape.SetAsBox(12, 12, new Box2D.Common.Math.b2Vec2(-1000, 1000), 0);
//	body.CreateFixture(this.fixDef, 1);

	return body.CreateFixture(this.fixDef, 1);
};


EngineBox2d.prototype.moveShape = function(shape, x, y) {
	for (var t=0; t<shape.m_vertices.length; t++) {
		shape.m_vertices[t].x += x;
		shape.m_vertices[t].y += y;
	}
console.log('apres shape = ', shape);
};

EngineBox2d.prototype.setFixture = function(parameters) {
	this.fixDef = new Box2D.Dynamics.b2FixtureDef;
	if (!yespix.isUndefined(parameters.restitution)) {
		this.fixDef.restitution = parameters.restitution;
	} else {
		this.fixDef.restitution = this.defaultRestitution;
	}
	if (!yespix.isUndefined(parameters.isSensor)) {
		this.fixDef.isSensor = parameters.isSensor;
	} else {
		this.fixDef.isSensor = this.defaultIsSensor;
	}
	if (!yespix.isUndefined(parameters.friction)) {
		this.fixDef.friction = parameters.friction;
	} else {
		this.fixDef.friction = this.defaultFriction;
	}
	if (!yespix.isUndefined(parameters.density)) {
		this.fixDef.density = parameters.density;
	} else {
		this.fixDef.density = this.defaultDensity;
	}
};


EngineBox2d.prototype.createListener = function(beginContact, endContact) {
	this.listener = new Box2D.Dynamics.b2ContactListener;
	this.listener.BeginContact = beginContact;
	this.listener.EndContact = endContact;
	return this.listener;
};

EngineBox2d.prototype.getListener = function() {
	return this.listener;
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


