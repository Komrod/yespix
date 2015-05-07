		/**
		 ************************************************************************************************************
		 * @class entity.base
		 */

		yespix.define('base', {

		    ///////////////////////////////// Main functions ////////////////////////////////

		    options: null,

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
		        this.options = options || {};
		        return true;
		    },

		});
