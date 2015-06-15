

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
        tag: '',
        propDefault: {},
    };

    this.set(params, varDefault);
    this.list = {};
    this.selected = null;
    this.nextIndex = 0;
    this.isChanged = true;
}


/**
 * Set parameter of the Element List object. Call manager.event with type "change"
 * @param {object} params     Parameters
 * @param {object} varDefault Default parameters
 * @event change
 */
ElementList.prototype.set = function(params, varDefault) {
    yespix.copy(params, this, varDefault);
    this.isChanged = true;
    if (this.manager && this.manager.event) {
        this.manager.event(
            {
                type: 'change',
                from: this,
                fromClass: 'ElementList',
                properties: params,
                entity: entity,

            }
        );
    }
};


/**
 * Set attributes of an element or all elements. Call manager.event with type "changeElement" each time an element is changed
 * @event changeElement
 * @return {boolean} True on success
 */
ElementList.prototype.setProp = function(params, index) {
    if (!params) {
        return false;
    }

    if (yespix.isUndefined(index)) {
        for (var n in this.list) {
            this.setProp(params, n);
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


ElementList.prototype.get = function(index) {
    if (this.selected) {
        return this.selected;
    }
    return null;
};


/**
 * Add an element at an index in the list. 
 * @param {int|string} params Index as integer or string
 * @param {int|string} index Optional, index of the element as integer or string
 */
ElementList.prototype.add = function(params, index) {
    index = index || this.nextIndex;

    if (this.list[index]) {
        this.remove(index);
    }

    var element = null;
    if (this.tag != '') {
        element = document.createElement(this.tag);
    } else {
        element = {};
    }
    
    element.index = index;
    element.hasError = false;
    element.isReady = false;
    element.isLoading = true;
    element.manager = this;

    this.list[index] = element;
    this.nextIndex++;

    element.addEventListener("load", this.event, true);
    element.addEventListener("play", this.event, true);
    element.addEventListener("canplay", this.event, true);
    element.addEventListener("pause", this.event, true);
    element.addEventListener("error", this.event, true);

    this.setProp(params, index);

    if (element.isLoading && element.src && element.load) {
        element.load();
    }
    
    if (!element.load && !element.addEventListener){
        element.isReady = true;
        element.isLoading = false;
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
    
    element.removeEventListener("load", this.event, true);
    element.removeEventListener("play", this.event, true);
    element.removeEventListener("canplay", this.event, true);
    element.removeEventListener("pause", this.event, true);
    element.removeEventListener("error", this.event, true);

    this.list[index].manager = null;
    this.list[index] = null;
    delete(this.list[index]);
    return this;
};



