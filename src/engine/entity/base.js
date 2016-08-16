

/**
 ************************************************************************************************************
 * @class entity.base
 */


yespix.defineEntity('base', {

    
    ///////////////////////////////// Main functions ////////////////////////////////

    
    /**
     * Initilize the entity object. The original code of the function is called for the class name of
     * the entity and each ancestor classes
     */
    init: function(properties) {
        properties = properties || {};
	    yespix.copy(properties, this);
        
        if (this.manager) {
            this.manager.add(this);
        }

        this.event = new yespix.class.eventHandler();

        if (this.tween) {
            this.tween = new yespix.class.tween(this.tween, this);
        }

        return true;
    },

    
    set: function(properties) {
    	for (n in properties) {
    		if (yespix.isObject(this[n]) && yespix.isObject(properties[n])) {
    			if (yespix.isFunction(this[n].set)) {
					this[n].set(properties[n]);
    			} else {
    				yespix.copy(properties[n], this[n]);
    			}
    		} else {
    			this[n] = properties[n];
    		}
    	}
    },


    /**
     * Trigger an event and pass it to the event handler
     */
    trigger: function(event) {
        // execute functions linked to the event
        if (this.event) this.event.trigger(event);

        // pass it to manager
        if (this.manager) this.manager.trigger(event);
    	return true;
    },


    getAssets: function() {
        return [];
    },
    
    destroy: function() {
        if (this.manager) {
            this.manager.remove(this);
        }
    }
});

