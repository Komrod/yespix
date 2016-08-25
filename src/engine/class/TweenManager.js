

function TweenManager(properties, entity) {
    if (entity) this.entity = entity;

    this.list = [];

    if (properties) {
        this.add(properties);
    }

    this.isReady = true;
}


TweenManager.prototype.add = function(properties) {
    if (yespix.isArray(properties)) {
        for (var t = 0; t<properties.length; t++) {
            this.add(properties[t]);
        }
        return true;
    }
    var tween = new yespix.class.tweenAnimation(properties, this);
    this.list.push(tween);
//console.log('add tween animation '+this.list.length);    

    return tween;

};


TweenManager.prototype.clear = function() {
    this.list = [];
};


TweenManager.prototype.stopProperties = function(properties) {
    for (var t=0; t<this.list.length; t++) {
        if (this.list[t].isRunning) {
            this.list[t].stopProperties(properties);
        }
    }
};


TweenManager.prototype.trigger = function(event) {
    if (event.from == this) return false;
    for (var t=0; t<this.list.length; t++) {
        this.list[t].trigger(event);
    }

};


TweenManager.prototype.combine = function() {
    if (this.list.length == 0) {
        return false;
    }

    if (this.list.length == 1) {
        this.state = this.list[0].state;
        return this.state;
    }
    this.state = {};

    for (var t=0; t<this.list.length; t++) {
        this.combineObject(this.list[t].state, this.state);
    }

    return this.state;
};


TweenManager.prototype.combineObject = function(source, dest) {
    for (var name in source) {
        if (yespix.isObject(source[name])) {
            if (yespix.isUndefined(dest[name])) {
                dest[name] = {};
            }
            this.combineObject(source[name], dest[name]);
        } else {
            if (yespix.isUndefined(dest[name])) {
                dest[name] = source[name];
            }
        }
    }
};


TweenManager.prototype.step = function(time) {
    if (this.list.length > 0) {
        for (var t=0; t<this.list.length; t++) {
            this.list[t].step(time);
        }
        this.combine();
//console.log('combine', this.state);        
        this.entity.set(this.state);

        for (var t=0; t<this.list.length; t++) {
            if (this.list[t].isDeleted) {
                this.list.splice(t, 1);
                t--;
            }
        }
    }
};


yespix.defineClass('tweenManager', TweenManager);

