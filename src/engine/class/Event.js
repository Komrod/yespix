

/**
 * Handle events and transmit events to parent
 * @param {object} params  Parameters in an object
 * @param {object} parent Parent object
 */
function Event(params, parent) {
    params = params || {};
    
    if (parent) {
        this.parent = parent;
    }

    var varDefault = {
    };

    this.set(params, varDefault);

    this.list = {};
}


/**
 * Get the element at index or get the selected element
 * @param  {int} index Index
 * @return {object} The element
 */
Event.prototype.getList = function(eventName, name) {
    if (this.list[name]) {
        return this.list[name];
    }
    return {};
};


/**
 * Add an element at an index in the list. 
 * @param {int|string} params Index as integer or string
 * @param {int|string} index Optional, index of the element as integer or string
 */
ElementList.prototype.add = function(eventName, function, name) {


    if (this.list[eventName]) {
        this.list[eventName] = [];
    }
    
    element.index = index;
    element.hasError = false;
    element.isReady = false;
    element.isLoading = false;
    element.manager = this;

    this.list[index] = element;
    this.nextIndex++;
    
    if (element.addEventListener) {
        for (var t=0; t<this.events.length; t++) {
            element.addEventListener(this.events[t], this.event, true);
        }
    }

    if (this.selected === null) {
        this.selected = element;
        this.selectedIndex = index;
    }
    return this;
};

ElementList.prototype.trigger = function(event) {
};

ElementList.prototype.event = function(event) {
    if (this.target && this.target.manager && this.target.manager.manager) {
        this.manager.manager.event(event.type, event);
    }
};


ElementList.prototype.remove = function(index) {
    if (!this.list[index]) return this;

    var element = this.list[index];
    if (this.selected == element) {
        this.selected = null;
        this.selectedIndex = null;
    }
    
    for (var t=0; t<this.events.length; t++) {
        element.removeEventListener(this.events[t], this.event, true);
    }

    this.list[index].manager = null;
    this.list[index] = null;
    delete(this.list[index]);
    return this;
};



yespix.defineClass('elementList', ElementList);