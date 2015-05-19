		
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

		    /**
		     * Event: some properties of the entity have changed
		     */
		    event: function(event) {
		    	return true;
		    },

		});
