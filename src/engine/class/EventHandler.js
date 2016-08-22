

/**
 * Event handler
 * Handle the list of events
 * @parent  entity
 */


function EventHandler(entity) {
    if (entity) {
        this.entity = entity;
    }

    this.list = {};
    this.index = 0;

    this.ready(true);
}


EventHandler.prototype.ready = function(bool) {
    if (bool) {
        this.isReady = true;
        this.trigger(
            {
                type: 'ready',
                from: this,
                fromClass: 'EventHandler',
                entity: this.entity
            }
        );
    } else {
        this.isReady = false;
        this.trigger(
            {
                type: 'notReady',
                from: this,
                fromClass: 'EventHandler',
                entity: this.entity
            }
        );
    }
};


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


EventHandler.prototype.trigger = function(event, name) {
    
    if (event.from == this) return false;

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
};


EventHandler.prototype.unlink = function(eventName, name) {

    if (!this.list[eventName]) {
        return false;
    }
    if (!name) {
        this.list[eventName] = {};
        return true;
    }

    delete this.list[eventName][name];
    return true;
    // might use null instead, delete is slow
    // this.list[eventName][name] = null;
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


yespix.defineClass('eventHandler', EventHandler);

