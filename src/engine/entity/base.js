

/**
 ************************************************************************************************************
 * @class entity.base
 */


yespix.define('base', {

    
    ///////////////////////////////// Main functions ////////////////////////////////

    
    /**
     * Return the array of assets used for the entity.
     */
    assets: function() {
        return [];
    },

    
    /**
     * Initilize the entity object. The original code of the function is called for the class name of
     * the entity and each ancestor classes
     */
    init: function(options) {
        options = options || {};
	    yespix.copy(options, this);
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

