

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


EngineBox2d.prototype.setToDefault = function() {
	this.fixDef.density = this.defaultDensity;
	this.fixDef.friction = this.defaultFriction;
	this.fixDef.restitution = this.defaultRestitution;
	this.fixDef.isSensor = this.defaultIsSensor;
	this.bodyDef.fixedRotation = this.defaultFixedRotation;
}


EngineBox2d.prototype.set = function(options) {
	if (!yespix.isUndefined(options.fixedRotation)) {
		this.bodyDef.fixedRotation = options.fixedRotation;
	}
	if (!yespix.isUndefined(options.restitution)) {
		this.fixDef.restitution = options.restitution;
		this.fixDef.isSensor = options.isSensor;
		this.fixDef.friction = options.friction;
		this.fixDef.density = options.density;
	}
};


EngineBox2d.prototype.create = function(parameters, body) {
console.log('EngineBox2d:create: parameters.shape = ', parameters.shape);
	if (parameters.shape == 'rect') {
console.log('EngineBox2d:create: ok');
		var position = parameters.getPosition();
		var size = parameters.getSize();
console.log('EngineBox2d:create: position = ', position, ', size = ', size);
		return this.createRect(position.x, position.y, size.width, size.height, false, parameters, body);
	}
};


EngineBox2d.prototype.createRect = function(x, y, width, height, static, options, object) {
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
};


EngineBox2d.prototype.createBody = function(x, y, width, height, static, options, object) {
	
};


EngineBox2d.prototype.createFixture = function(relativeX, relativeY, width, height, static, options, object) {
	
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


