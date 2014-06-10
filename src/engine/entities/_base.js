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
		     * Reference to the scene of the entity initiated by the scene entity
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


		    ///////////////////////////////// Main functions ////////////////////////////////

		    /**
		     * Return the array of assets used for the entity. The original code of the function is called for the class name of the entity and each ancestor classes
		     */
		    assets: function() {
		        return [];
		    },

		    /**
		     * Initilize the entity object. The original code of the function is called for the class name of the entity and each ancestor classes
		     */
		    init: function(properties) {
		        return true;
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

		    /**
		     * Clone an entity
		     */
		    clone: function(properties) {
		        var entity = yespix.clone(this);
		        entity._id = yespix.entityNextId++;
		        if (properties) entity.prop(properties);
		        entity._instances = null;
		        yespix.dump(yespix.entityInstances);
		        yespix.instanceAdd(entity);
		        yespix.dump(yespix.entityInstances);
		        return entity;
		    },

		    attach: function(entity) {
		        yespix.attach(this, entity);
		        return this;
		    },

		    detach: function(entity) {
		        yespix.detach(this, entity);
		        return this;
		    },

		    trigger: function(name, e) {
		        yespix.trigger(name, e, this);
		        return this;
		    },

		    on: function(name, callback) {
		        yespix.on(name, callback, this);
		        return this;
		    },

		    off: function(name, callback) {
		        yespix.off(name, callback, this);
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
		                if (this._children[t] && !this._children[t].deleting) {
		                    this._children[t].destroy();
		                }
		            }
		        }

		        yespix.instanceRemove(this);
		        return this;
		    }

		});
		yespix.entityRootClassname = 'base';
