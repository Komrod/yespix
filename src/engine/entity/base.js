

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
     * Event: some properties of the entity have changed
     */
    event: function(event) {
    	if (this.manager) this.manager.event(event);
    	return true;
    },


    getAssets: function() {
        return [];
    },
    
});

