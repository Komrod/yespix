

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

    this.time = 0;
    this.position = 0;
    this.factor = 0;
    this.duration = 0;
    this.easing = 'linear';

    this.defaultEasing = 'linear';
    this.defaultDuration = 1000;
    this.defaultDelay = 0;

    this.isReady = false;
    
    if (this.entity && this.entity.isReady) {
        this.start(properties);
    }
}


TweenAnimation.prototype.start = function(properties) {
    this.from = {};
    this.to = {};
    this.state = {};
    this.time = 0;
    this.position = 0;
    this.duration = this.properties.duration || this.defaultDuration;
    this.easing = this.properties.easing || this.defaultEasing;
    if (!yespix.easing[this.easing]) {
        this.easing = this.defaultEasing;
    }


    // Init from and to
    this.copyObject(properties.from, this.from);
    this.copyObject(properties.to, this.to);
    this.initFrom(this.from, this.to, this.entity);

    this.cleanObject(this.from);
    this.cleanObject(this.to);

    this.copyObject(this.from, this.state);

    this.isReady = true;

    if (this.entity) {
        this.entity.set(this.state);
    }

    // Event
    if (this.manager) {
        this.manager.trigger(
            {
                type: 'ready',
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
    } else if (this.entity) {
        this.entity.trigger(
            {
                type: 'ready',
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
console.log(this);
    return false;
};


TweenAnimation.prototype.destroy = function() {
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


TweenAnimation.prototype.cleanObject = function(obj) {
    var count = 0;
    for (var name in obj) {
        if (yespix.isObject(obj[name])) {
            if (!this.cleanObject(obj[name])) {
                delete(obj[name]);
            } else {
                count++;
            }
        } else {
            count++;
        }
    }
    return count > 0;
};


TweenAnimation.prototype.initFrom = function(from, to, entity) {
    for (var name in to) {
        if (yespix.isObject(to[name])) {
            if (yespix.isUndefined(from[name])) {
                from[name] = {};
            }
            if (entity) {
                this.initFrom(from[name], to[name], entity[name]);
            } else {
                this.initFrom(from[name], to[name], false);
            }
        } else {
            if (yespix.isUndefined(from[name])) {
                if (!entity || yespix.isUndefined(entity[name])) {
                    delete(to[name]);
                } else {
                    from[name] = entity[name];
                }
            }
        }
    }
};


/**
 * Animate an object with factor
 */
TweenAnimation.prototype.animateObject = function(from, to, dest, factor) {
    if (!from || !to || !dest) {
        return false;
    }
    for (var name in from) {
        if (yespix.isObject(from[name])) {
            this.animateObject(from[name], to[name], dest[name], factor);
        } else {
            dest[name] = this.animateValue(from[name], to[name], factor);
        }
    }
};


TweenAnimation.prototype.animateValue = function(from, to, factor) {
//console.log('animateValue', from, to, factor);
    if (!yespix.isString(from)) {
        var value = from + (to - from) * factor;
//console.log('return calc '+value);
        return value;
    }
    // @TODO animate hex color
//console.log('return to '+value);
    return to;
};


TweenAnimation.prototype.trigger = function(event) {
    if (event.from == this) return false;

    if (!this.isReady) {
        if (this.entity && this.entity.isReady) {
            this.start(this.properties);
        }
    }
};


TweenAnimation.prototype.step = function(time) {
    this.time += time;
    if (this.time > this.duration) this.time = this.duration;
    
    if (this.duration > 0) {
        this.position = this.time / this.duration;
    } else {
        this.position = 1.0;
        this.time = 0;
    }

    this.factor = yespix.easing[this.easing](this.position);
    
//console.log(this); aze;
//console.log(this.position); aze;
    if (this.position == 1) {
        this.copyObject(this.to, this.state);
    } else if (this.position == 0) {
        this.copyObject(this.from, this.state)
    } else {
        this.animateObject(this.from, this.to, this.state, this.factor);
    }
if (this.position<1) { console.log(this.position); console.log(this.state); }

    if (this.entity) {
        this.entity.set(this.state);
    }
};


yespix.defineClass('tweenAnimation', TweenAnimation);

