

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


TweenManager.prototype.step = function(time) {
    for (var t=0; t<this.list.length; t++) {
        this.list[t].step(time);
    }
    for (var t=0; t<this.list.length; t++) {
        if (this.list[t].position >= 1) {
            if (this.entity) {
                this.entity.trigger(
                    {
                        type: 'destroy',
                        from: this.list[t],
                        fromClass: 'Tween',
                        entity: this.entity,
                        properties: {}
                    }
                );
                this.list[t].destroy();
            }
            this.list.splice(t, 1);
            t--;
        }
    }
};


yespix.defineClass('tweenManager', TweenManager);

