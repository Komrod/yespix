

function Player2w(properties, entity) {
    properties = properties || {};
    if (entity) this.entity = entity;

    var varDefault = {
        name: 'player'
    };

    this.entityTrigger('create');
    this.ready(true);

}


Player2w.prototype.set = function(properties, varDefault) {
    yespix.copy(properties, this, varDefault);
    this.isChanged = true;
    this.entityTrigger('change', properties);
};


Player2w.prototype.trigger = function(event) {
    if (event.from == this) return false;

    if (event.type == 'ready' && event.fromClass == 'Image') {
        this.getSpritesReady();
        return true;
    }
    return true;
};


Player2w.prototype.entityTrigger = function(type, properties) {
    if (this.entity) {
        properties = properties || {};
        this.entity.trigger(
            {
                type: type,
                entity: this.entity,
                from: this,
                fromClass: 'Player2w',
                properties: properties
            }
        );
    }
};    


Player2w.prototype.ready = function(bool) {
    if (bool) {
        this.isReady = true;
        this.entityTrigger('ready');
    } else {
        this.isReady = false;
        this.entityTrigger('notReady');
    }
};


Player2w.prototype.step = function(time) {
    if (this.entity.input.gamepadButton('left')) {
console.log('gamepadButton left');        
    }
    if (this.entity.input.key('left')) {
console.log('keyButton left');        
    }
};


Player2w.prototype.destroy = function() {
};


yespix.defineClass('player2w', Player2w);

