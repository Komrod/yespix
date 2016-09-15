

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

        this.enable(['tween', 'event'], properties);

        this.checkReady();
//console.log(this);        
    },

    
    enable: function(list, properties) {
        var t = 0, length = list.length;
        for (; t<length; t++) {
            switch (list[t]) {
                case 'tween':
                    if (this.tween !== false && !(this.tween instanceof yespix.class.tweenManager)) this.tween = new yespix.class.tweenManager(properties.tween, this);
                    else this.disable(['tween']);
                    break;
                case 'event':
                    if (this.event !== false && !(this.event instanceof yespix.class.eventHandler)) this.event = new yespix.class.eventHandler(this);
                    else this.disable(['event']);
                    break;
            }
        }
    },


    disable: function(list) {
        if (!list) {
            if (this.tween.destroy) this.tween.destroy();
            this.tween = null;
            if (!this.event.destroy) this.event.destroy();
            this.event = null;
        } else {
            var t = 0, length = list.length;
            for (; t<length; t++) {
                switch (list[t]) {
                    case 'tween':
                        if (!this.tween) break;
                        if (this.tween.destroy) this.tween.destroy();
                        this.tween = null;
                        break;
                    case 'event':
                        if (!this.event) break;
                        if (!this.event.destroy) this.event.destroy();
                        this.event = null;
                        break;
                }
            }
        }
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


    when: function(eventName, fct, name){
        if (!this.event) {
            this.enable(['event']);
        }
        if (this.event) {
            return this.event.when(eventName, fct, name);
        }
        return false;
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
        // @TODO not used right now
        //if (this.manager) this.manager.trigger(event);

        // if a class switch to ready or notReady state
        if ((event.type == 'ready' || event.type == 'notReady') && event.from !== this) {
            // try to change the ready state of the entity
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
                    entity: this.entity
                }
            );
        } else {
            this.isReady = false;
            this.trigger(
                {
                    type: 'notReady',
                    from: this,
                    fromClass: 'Entity',
                    entity: this.entity
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
        // @TODO event not necessarily ready
        //if (this.event && !this.event.isReady) return false;
        if (this.tween && !this.tween.isReady) return false;
        return true;
    },


    step: function(time) {
        if (this.tween && this.tween.step) {
            this.tween.step(time);
        }
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

