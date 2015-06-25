

/**
 * Handle liste of elements, specifically DOM elements that can be retrieved by name or index.
 * @param {object} params  Parameters in an object
 * @param {object} manager Manager object
 */
function ElementList(params, manager) {
    params = params || {};
    if (manager) this.manager = manager;

    var varDefault = {
        isLoading: false,
        isReady: false,
        hasError: false,
        events: ['change', 'load', 'play', 'canPlay', 'pause', 'error'],
    };

    this.set(params, varDefault);

    this.list = {};
    this.selected = null;
    this.selectedIndex = null;
    this.selectedNext = 0;
    this.nextIndex = 0;
}


/**
 * Set attributes of an element or all elements. Call manager.event with type "changeElement" each time an element is changed
 * @event changeElement
 * @return {boolean} True on success
 */
ElementList.prototype.set = function(params, index) {
    if (!params) {
        return false;
    }

    if (yespix.isUndefined(index)) {
        for (var n in this.list) {
            this.set(params, n);
        }
        return true;
    }

    if (this.list[index]) {
        yespix.copy(params, this.list[index]);
        this.isChanged = true;
        if (this.manager) {
            this.manager.event(
                {
                    type: 'changeElement',
                    from: this,
                    fromClass: 'ElementList',
                    properties: params,
                    manager: manager,
                    element: this.list[index]
                }
            );
        }
        return true;
    }
    return false;
};


/**
 * Set an element as selected
 * @param  {integer|string} index Name or index of the element
 * @return {[type]}       [description]
 */
ElementList.prototype.select = function(index) {
    if (this.list[index]) {
        this.selectedIndex = index;
        this.selected = this.list[index];
        return this;
    }
    return this;
};

/**
 * Get the element at index or get the selected element
 * @param  {int} index Index
 * @return {object} The element
 */
ElementList.prototype.get = function(index) {
    if (yespix.isUndefined(index)) {
        if (this.selected) {
            return this.selected;
        }
        return null;
    } else {
        if (this.list[index]) {
            return this.list[index];
        }
        return null;
    }
};


/**
 * Add an element at an index in the list. 
 * @param {int|string} params Index as integer or string
 * @param {int|string} index Optional, index of the element as integer or string
 */
ElementList.prototype.add = function(element, index) {
    index = index || this.nextIndex;

    if (this.list[index]) {
        this.remove(index);
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



