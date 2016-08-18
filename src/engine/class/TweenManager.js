

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


TweenManager.prototype.trigger = function(event) {
    if (event.from == this) return false;

    for (var t=0; t<this.list.length; t++) {
        this.list[t].trigger(event);
    }
};


yespix.defineClass('tweenManager', TweenManager);

