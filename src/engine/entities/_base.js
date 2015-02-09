		/**
		 ************************************************************************************************************
		 * @class entity.base
		 */

		yespix.define('base', {

		    /**
		     * Reference to the YESPIX engine (in case you lost it)
		     * @property _yespix
		     * @type {object}
		     */
		    _yespix: yespix,


		    /**
		     * Entity class name initiated on the spawn of the entity
		     * @property _class
		     * @type string
		     */
		    _class: '',

		    /**
		     * Array of ancestor names initiated on the spawn of the entity
		     * @property _ancestors
		     * @type array
		     */
		    _ancestors: [],

		    /**
		     * Reference to the scene of the entity, initiated by the scene entity
		     * @property _scene
		     * @type object
		     */
		    _scene: null,

		    /**
		     * Unique integer of the entity instance
		     * @property _id
		     * @type integer
		     */
		    _id: 1,

		    /**
		     * Array of children reference
		     * @property _children
		     * @type array
		     */
		    _children: null,

		    /**
		     * Reference to the parent
		     * @property _parent
		     * @type object
		     */
		    _parent: null,

		    /**
		     * Set True when the entity deletion is in progress
		     * @property _deleting
		     * @type boolean
		     */
		    _deleting: false,

		    /**
		     * Set True if the entity instance was added to the global YESPIX entity list
		     * @property _instanceExists
		     * @type boolean
		     * @default true
		     */
		    _instanceExists: false,

		    /**
		     * Set True if the entity is active
		     * @property isActive
		     * @type boolean
		     * @default true
		     */
		    isActive: true,

		    /**
		     * Set True if the entity is visible
		     * @property isVisible
		     * @type boolean
		     * @default false
		     */
		    isVisible: false,

		    /**
		     * Set True if the entity is global
		     * @property isGlobal
		     * @type boolean
		     * @default false
		     */
		    isGlobal: false,

		    /**
		     * Name of the entity, not unique
		     * @property name
		     * @type string
		     */
		    name: '',

		    /**
		     * Register instance in the engine when spawned
		     */
		    registerInstance: true,

		    /**
		     * Set to True if the entity must be unique (only one instance)
		     * @property isUnique
		     * @type boolean
		     * @default false
		     */
		    isUnique: false,

		    /**
		     *
		     */


		    readyFunctions: [],

		    ///////////////////////////////// Main functions ////////////////////////////////

		    /**
		     * Return the array of assets used for the entity. The original code of the function is called for
		     * the class name of the entity and each ancestor classes
		     */
		    assets: function() {
		        return [];
		    },

		    /**
		     * Initilize the entity object. The original code of the function is called for the class name of
		     * the entity and each ancestor classes
		     */
		    init: function(properties) {
		        this.readyFunctions = [];
		        this.on('spawn', this.checkReadyState);
		        return true;
		    },

		    checkReadyState: function() {
		        for (var t = 0; t < this.readyFunctions.length; t++) {
		            if (!this.readyFunctions[t].apply(this)) {
		                return false;
		            }
		        }
		        this.ready();
		        return true;
		    },

		    ready: function() {
		        // Trigger some events to dispatch the entityReady
			    var event = {
			        entity: this,
			        type: 'entityReady'
			    }

		        this.isReady = true;
		        this.trigger('entityReady', event);

		        yespix.trigger(event.type, event);

			    event = {
			        entity: this,
			        type: 'entityReady:' + this._class
			    }
		        yespix.trigger(event.type, event);
		    },

		    ancestor: function(name) {
		        return yespix.inArray(this._ancestors, name);
		    },

		    typeof: function(name) {
		        if (yespix.isArray(name)) {
		            for (var t = 0; t < name.length; t++)
		                if (this.typeOf(name[t])) return true;
		            return false;
		        }
		        return (this.ancestor(name) || this._class == name);
		    },

		    prop: function(name, value) {
		        if (yespix.isObject(name)) {
		            for (var n in name) {
		                this[n] = name[n];
		            }
		            return this;
		        }
		        this[name] = value;
		        return this;
		    },

		    hasAncestors: function(ancestors)
		    {
				return yespix.hasAncestors(this._class, ancestors);
		    },

		    hasClass: function(_class)
		    {
				return this._class === _class;
		    },

		    /**
		     * Clone an entity
		     */
		    clone: function(properties) {
		        var entity = yespix.clone(this);
		        entity._id = yespix.entityNextId++;
		        if (properties) entity.prop(properties);
		        entity._instances = false;
		        //yespix.dump(yespix.entityInstances);
		        yespix.instanceAdd(entity);
		        //yespix.dump(yespix.entityInstances);
		        return entity;
		    },

		    childAdd: function(entity) {
		        yespix.childAdd(this, entity);
		        return this;
		    },

		    setParent: function(entity) {
		        yespix.childAdd(entity, this);
		        return this;
		    },

		    childRemove: function(entity) {
		        yespix.childRemove(this, entity);
		        return this;
		    },

		    trigger: function(name, e) {
		        yespix.trigger(name, e, this, this);
		        return this;
		    },

		    on: function(name, callback) {
		        yespix.on(name, callback, this, this);
		        return this;
		    },

		    off: function(name, callback) {
		        yespix.off(name, callback, this, this);
		        return this;
		    },

		    listen: function(pname, callback) {
		        return yespix.listen(this, pname, callback);
		        return this;
		    },

		    destroy: function() {
		        this._deleting = true;
		        this.isActive = false;
		        this.isVisible = false;

		        if (this._children) {
		            for (var t = 0; t < this._children.length; t++) {
		                if (this._children[t] && !this._children[t]._deleting) {
		                    //console.log('base :: destroy :: destroying child t='+t);
		                    this._children[t].destroy();
		                }
		            }
		        }
		        this._children = null;

		        yespix.instanceRemove(this);
		        return this;
		    },

			call: function(className, fn, params) {
				if (!yespix.entityClasses[className]) return console.error('entity.call: class "'+className+'" does not exist');
				if (!yespix.entityClasses[className].properties[fn]) return console.error('entity.call: function "'+fn+'" does not exist in class "'+className+'"');
				if (!yespix.isFunction(yespix.entityClasses[className].properties[fn])) return console.error('entity.call: property "'+fn+'" is not a function in class "'+className+'"');

				return yespix.entityClasses[className].properties[fn].apply(this, params)
				//return yespix.call(this, fn, ancestor, params);
				//yespix.fn.call = function(entity, fn, ancestors, params)				
			}
		});
		yespix.entityRootClassname = 'base';
