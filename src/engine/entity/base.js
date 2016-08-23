

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
            this.tween = new yespix.class.tweenManager(this.tween, this);
        } else {
            this.tween = new yespix.class.tweenManager(false, this);
        }

        this.checkReady();
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
        if (this.tween && this.tween.isReady) {
            this.tween.trigger(event);
        }

        // execute functions linked to the event
        if (this.event && this.event.isReady) {
            this.event.trigger(event);
        }

        // pass it to manager
        if (this.manager) this.manager.trigger(event);

        // if a class switch to ready or notReady state
        if ((event.type == 'ready' || event.type == 'notReady') && event.from !== this) {
            this.checkReady();
        }

    	return true;
    },


    /**
     * Change the state of the entity to ready or not ready
     * @param  {boolean} bool Ready or not
     */
    ready: function(bool) {
        if (bool) {
            this.isReady = true;
            this.trigger(
                {
                    type: 'ready',
                    from: this,
                    fromClass: 'Entity',
                    entity: this.entity,
                    properties: { 
                        isReady: true
                    }
                }
            );
        } else {
            this.isReady = false;
            this.trigger(
                {
                    type: 'notReady',
                    from: this,
                    fromClass: 'Entity',
                    entity: this.entity,
                    properties: { 
                        isReady: false
                    }
                }
            );
        }
    },


    /**
     * Check if the entity and classes are ready and launch an event if the ready state change
     * @return {boolean} True if ready
     */
    checkReady: function() {
        if (!this.isReady) {
            if (this.checkReadyClasses()) {
                this.ready(true);
                return true;
            }
        } else {
            if (!this.checkReadyClasses()) {
                this.ready(false);
                return false;
            }
        }
    },


    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
        if (!this.event.isReady) return false;
        if (!this.tween.isReady) return false;
        return true;
    },


    step: function(time) {
        this.tween.step(time);    
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

