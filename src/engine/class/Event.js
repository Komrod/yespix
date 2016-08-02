

/**
 * Handle events and propagate events to entity
 * @param {object} params  Parameters in an object
 * @param {object} entity Entity object
 */
function EventHandler(entity) {
    if (entity) {
        this.entity = entity;
    }

    this.list = {};
    this.index = 0;
}


/**
 * Get the list
 * @param  {int} index Index
 * @return {object} The element
 */
EventHandler.prototype.getList = function(eventName) {
    if (this.list[eventName]) {
        return this.list[eventName];
    }
    return false;
};


/**
 * Link a function to an event in the list, chainable
 * @param {int|string} params Index as integer or string
 * @param {int|string} index Optional, index of the element as integer or string
 */
EventHandler.prototype.link = function(eventName, fct, name) {

    if (!this.list[eventName]) {
        this.list[eventName] = {};
    }

    if (!name) {
        name = this.index+'';
        this.index++;
        while (this.list[eventName][name]) {
            name = this.index+'';
            this.index++;
        }
    } else  {
        name = name + '';
    }

    this.list[eventName][name] = fct;

    return name;
};


EventHandler.prototype.create = function(type) {
    var event = {
        propagation: true,
        time: new Date().getTime(),
        type: type
    };

    if (this.parent) {
        event.parent = this.parent;
    }

    return event;
};


EventHandler.prototype.trigger = function(event, name) {
    
    if (!event || !event.type) {
        return false;
    }

    if (this.list[event.type]) {
        if (name) {
            if (this.list[event.type][name]) {
                this.list[event.type][name](event);
            }
        } else {
            for (var n in this.list[event.type]) {
                this.list[event.type][n](event);
            }
        }

    }

    // propagation to entity
    if (event.propagation && this.entity && this.entity.manager && this.entity.manager.event) {
            this.parent.entity.event(event);
        }
    }
};


EventHandler.prototype.unlink = function(eventName, name) {

    if (!this.list[eventName] || !name) {
        this.list[eventName] = {};
        return true;
    }

    delete this.list[eventName][name];
    // might use null instead
    //this.list[eventName][name] = null;
};


EventHandler.prototype.clear = function() {

    for (var eventName in this.list) {
        for (var name in this.list[eventName]) {
            delete this.list[eventName][name];
        }
        delete this.list[eventName];
    }
    delete this.list;
};



yespix.defineClass('event', Event);
