

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
        this.create(properties);
    }
}


TweenAnimation.prototype.create = function(properties) {
    this.from = {};
    this.to = {};
    this.state = {};
    this.time = 0;
    this.position = 0;
    this.duration = this.properties.duration || this.defaultDuration;
    this.easing = this.properties.easing || this.defaultEasing;
    this.delay = this.properties.delay || this.defaultDelay;

    if (this.delay<0) {
        this.delay = 0;
    }
    if (!yespix.easing[this.easing]) {
        this.easing = this.defaultEasing;
    }

    this.isReady = true;
    this.isRunning = false;

    if (this.delay<=0) {
        this.start();
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
    return true;
};


TweenAnimation.prototype.start = function() {
    this.isRunning = false;

    // Init from and to
    this.copyObject(this.properties.from, this.from);
    this.copyObject(this.properties.to, this.to);
    this.initFrom(this.from, this.to, this.entity);

    this.cleanObject(this.from);
    this.cleanObject(this.to);
    this.copyObject(this.from, this.state);

    if (this.entity) {
        this.entity.set(this.state);
    }

    if (this.manager) {
        this.manager.stopProperties(this.from);
    }
    this.isRunning = true;
};


TweenAnimation.prototype.stopProperties = function(properties) {
//console.log('stopProperties', properties);
    if (this.deleteProperties(properties, this.from, this.to, this.state)) {
        this.cleanObject(this.from);
        this.cleanObject(this.to);
        this.cleanObject(this.state);
    }
};


TweenAnimation.prototype.deleteProperties = function(properties, from, to, state) {
    var deleted = false;
    if (yespix.isUndefined(from) || yespix.isUndefined(to)) {
        return false;
    }
    for (var name in properties) {
        if (!yespix.isUndefined(from[name])) {
            if (yespix.isObject(properties[name])) {
                if (!state) {
                    deleted = deleted || this.deleteProperties(properties[name], from[name], to[name], false);
                } else {
                    deleted = deleted || this.deleteProperties(properties[name], from[name], to[name], state[name]);
                }
            } else {
                delete(from[name]);
                delete(to[name]);
                if (state) {
                    delete(state[name]);
                }
                deleted = true;
            }
        }
    }
    return deleted;
};


TweenAnimation.prototype.destroy = function() {
/*
    this.from = {};
    this.to = {};
    this.state = {};
    this.manager = null;
    this.entity = null;
    this.isRunning = false;
*/
};


TweenAnimation.prototype.copyObject = function(source, dest) {
    for (var name in source) {
        if (yespix.isObject(source[name])) {
            if (yespix.isUndefined(dest[name])) {
                dest[name] = {};
            }
            this.copyObject(source[name], dest[name]);
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
            if (yespix.isString(obj[name])) {
                if (yespix.isHexShort(obj[name])) {
                    obj[name]= yespix.normalizeHex(obj[name]);
                }
            }
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
    if (!yespix.isString(from)) {
        var value = from + (to - from) * factor;
        return value;
    }

    if (yespix.isString(from) && yespix.isHex(from) && yespix.isString(to) && yespix.isHex(to)) {
        from = yespix.hexToRgb(from);
        to = yespix.hexToRgb(to);
        return yespix.rgbToHex({
            r: Math.round(from.r + (to.r - from.r) * factor),
            g: Math.round(from.g + (to.g - from.g) * factor),
            b: Math.round(from.b + (to.b - from.b) * factor)
        });
    }    
    return to;
};



TweenAnimation.prototype.trigger = function(event) {
    if (event.from == this) return false;

    if (!this.isReady) {
        if (this.entity && this.entity.isReady) {
            this.create(this.properties);
        }
    }
};


TweenAnimation.prototype.step = function(time) {
    this.time += time;
    if (this.time > this.duration + this.delay) this.time = this.duration + this.delay;
    
    if (this.delay > 0 && this.time < this.delay) {
        this.position = 0;
        return false;
    }

    if (this.isRunning == false) {
        this.start();
    }
    if (this.duration > 0) {
        this.position = (this.time - this.delay) / this.duration;
    } else {
        this.position = 1.0;
        this.time = this.delay;
    }

    this.factor = yespix.easing[this.easing](this.position);
    
    if (this.position == 1) {
        this.copyObject(this.to, this.state);
    } else if (this.position == 0) {
        this.copyObject(this.from, this.state)
    } else {
        this.animateObject(this.from, this.to, this.state, this.factor);
    }
    if (this.entity) {
        this.entity.set(this.state);
    }
/*
var temp = {};
this.copyObject(this.state, temp)
console.log('set to state = ', temp);
*/
};


yespix.defineClass('tweenAnimation', TweenAnimation);

