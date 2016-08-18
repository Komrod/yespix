

function TweenAnimation(properties, manager) {
    
    properties = properties || {};
    if (manager) {
        this.manager = manager;
        if (manager.entity) this.entity = manager.entity;
    }
    
    this.from = {};
    this.to = {};
    this.state = {};

    this.properties = {};
    this.copyObject(properties, this.properties);

    this.timestamp = 0;
    this.position = 0;
    this.delay = 0;
    this.duration = 0;

    this.defaultEasing = 'linear';
    this.defaultDuration = 1000;

    this.isReady = false;
    this.isRunning = false;

    
    if (this.entity && this.entity.isReady) {
console.log('TweenAnimation: entity READY');
        this.start(properties);
    }
else console.log('TweenAnimation: entity NOT ready');
}


TweenAnimation.prototype.start = function(properties) {

    this.from = {};
    this.to = {};
    this.state = {};

    // @TODO only for objects
    // Init from and to
    this.copyObject(properties.from, this.from);
    this.copyObject(properties.to, this.to);
    this.initFrom(this.from, this.to, this.entity);
/*
    // Init from with default values of entity
    for (varclss in properties.to) {
        if (yespix.isObject(properties.to[clss])) {
            this.to[clss] = {};
            for (prop in properties.to[clss]) {
                this.to[clss][prop] = properties.to[clss][prop];
                if (!this.from[clss]) {
                    this.from[clss] = {};
                }
                if (yespix.isUndefined(this.from[clss][prop])) {
                    this.from[clss][prop] = getEntityValue(clss, prop);
                    if (this.from[clss][prop] === null) {
                        this.from[clss][prop] = properties.to[clss][prop];
                    }
                }
            }
        }
    }
*/
console.log(this);
    return false;

    // Init state
    for (clss in properties.to) {
        if (yespix.isObject(properties.to[clss])) {
            this.to[clss] = {};
            for (prop in properties.to[clss]) {
                this.to[clss][prop] = properties.to[clss][prop];
            }
        }
    }

    //this.

    // Event
    if (this.manager) {
        this.manager.trigger(
            {
                type: 'tween',
                from: this,
                fromClass: 'Tween',
                entity: this.entity,
                properties: properties,
                tween: {
                    from: this.from,
                    to: this.to,
                }
            }
        );
    }
};


TweenAnimation.prototype.copyObject = function(source, dest) {
    for (var name in source) {
        if (yespix.isObject(source[name])) {
            if (yespix.isUndefined(dest[name])) {
                dest[name] = {};
            }
            this.copyObject(source[name], dest[name], false);
        } else {
            if (yespix.isUndefined(dest[name])) {
                dest[name] = source[name];
            }
        }
    }
};


TweenAnimation.prototype.initFrom = function(from, to, entity) {
    for (var name in to) {
        if (yespix.isObject(to[name])) {
            if (yespix.isUndefined(from[name])) {
                from[name] = {};
            }
console.log('relaunch initFrom in '+name);
            if (entity) {
                this.initFrom(from[name], to[name], entity[name]);
            } else {
                this.initFrom(from[name], to[name], false);
            }
        } else {
            if (!entity || yespix.isUndefined(entity[name])) {
console.log('deleting to['+name+']');
                delete(to[name]);
            } else {
                from[name] = entity[name];
            }
        }
    }

    // @TODO delete empty objects in from
    
};



TweenManager.prototype.trigger = function(event) {
console.log('trigger : event= ', event);
    if (!this.isReady && !this.isRunning) {

    }
};


/*
TweenAnimation.prototype.getEntityValue = function(clss, property) {
    if (!this.entity || !this.entity[clss] || yespix.isUndefined(this.entity[clss][property])) {
        return null;
    }
    return this.entity[clss][property];
};

TweenAnimation.prototype.getDefaultByType = function(value) {
    if (yespix.isInt(value)) {
        return 0;
    }
    return null;
};



TweenAnimation.prototype.getState = function() {
    return this.state;
};
*/

yespix.defineClass('tweenAnimation', TweenAnimation);