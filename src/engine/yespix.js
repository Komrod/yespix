/*! yespix - v0.1.0 - 2014-06-03 */
(function(undefined) {

    /**
     * Credit:
     * Komrod
     *
     * Special Thanks:
     * Louis Stowasser for inspirational CraftyJS
     * Contributors of StackOverflow
     *
     */

    /**
     * @class yespix
     */

    /**
     * YESPIX contructor. Handles the engine initialisation with options and trigger the "ready" event
     */
    function yespix(options) {
        if (!(this instanceof yespix)) return new yespix(options);
        this.init(options);
        this.trigger('ready');
    }

    /**
     * YESPIX prototype
     */
    yespix.fn = yespix.prototype;


    /**
     ************************************************************************************************************
     ************************************************************************************************************
     * Bunch
     *
     */

    // bunch init
    Bunch = function(list) {
        // if (list) console.log('Bunch :: list = '+list+', length = '+list.length+', instanceOf Bunch = '+(this instanceof Bunch));
        //else console.log('Bunch :: list = '+list+', length = -');
        //console.log('Bunch :: instanceOf Bunch = '+(this instanceof Bunch));
        if (!(this instanceof Bunch)) return new Bunch(list);
        this.__bunch_init.apply(this, arguments);
    };

    Bunch.prototype = [];

    Bunch.prototype.unique = function() {
        for (var t = 0; t < this.length; t++) {
            for (var u = t + 1; u < this.length; u++) {
                if (this[t] === this[u]) {
                    //console.log('Bunch.unique :: splice an element');
                    this.splice(u--, 1);
                }
            }
        }
    };

    /*
	Bunch.prototype.concat = function()
	{
		// @todo
	};
	*/

    Bunch.prototype.__bunch_init = function(list) {
        // if (list) console.log('Bunch.init :: list = '+list+', length = '+list.length);
        // else console.log('Bunch.init :: list = '+list+', length = -');

        if (list && list.length > 0) {
            for (var t = 0; t < list.length; t++) this.push(list[t]);
            this.unique();
        }
    };

    Bunch.prototype.__bunch_each = function(fn) {
        /*		if (fn)
		{
			var args = [].slice.call(arguments);
			args.shift();
			for (var t=0; t<this.length; t++)
			{
				if (this[t] && this[t][fn])
				{
					this[t][fn].apply(this[t], args);
				}
			}
		}*/
    };

    Bunch.prototype.array = function() {
        var result = [];
        for (var t = 0; t < this.length; t++) result.push(this[t]);
        return result;
    };

    /**
     ************************************************************************************************************
     * CHILDREN
     */

    /**
     * @todo  moving rotating the parent will affect the children
     * @param {entity} parent The parent
     * @param {entity|array} child An entity to attached or an array of entities
     * @example attach(entity1, entity2) attaches entity2 to entity1
     * @example attach(entity1, [entity2, entity3 ...]) attaches multiple entities to entity1
     */
    yespix.fn.attach = function(parent, child) {
        // multiple children
        if (this.isArray(child)) {
            for (var t = 0; t < child.length; t++) this.attach(parent, child[t]);
            return this;
        }

        // try to attach an entity already attached to the parent
        if (child._parent == parent) return null;

        // attach
        if (!parent._children) parent._children = [child];
        else parent._children.push(child);

        if (child._parent) this.detach(child._parent, child);
        child._parent = parent;
        return this;
    };

    yespix.fn.detach = function(parent, child) {
        var t;

        // detach everything 
        if (!child) {
            if (parent._children) {
                for (t = 0; t < parent._children.length; t++) parent._children[t]._parent = null;
                parent._children = null;
            }
            return this;
        }

        // detach all the children
        if (this.isArray(child)) {
            for (t = 0; t < child.length; t++) this.detach(parent, child[t]);
            return this;
        }

        // try to detach an entity already detached
        if (child._parent != parent) return null;

        // detach one child
        child._parent = null;
        for (t = 0; t < parent._children.length; t++)
            if (parent._children[t] == child) {
                parent._children.splice(t, 1);
                break;
            }
        return this;
    };

    /*******************************************************************************************************************************
     ********************************************************************************************************************************
     * Collision detection
     */

    /**
     * clear the collision map
     */
    yespix.fn.collisionClear = function() {
        this.data.collisionMap = [];
    };

    /**
     * Change the cell size of the collision map and clear the collision map
     * @param  {Number} size Cell size in pixels
     */
    yespix.fn.collisionCellSize = function(size) {
        if (size < 1) size = 32;
        this.collisionSize = size;
        this.collisionClear();
    };

    /**
     * Returns an array of cell objects that matches with the collision map of the entity
     */
    yespix.fn.collisionCell = function(x, y, type) {
        if (type == 'canvas') {
            var x = Math.floor(x / this.collisionSize);
            var y = Math.floor(y / this.collisionSize);
        }

        var line = this.data.collisionMap[x];
        if (!line) line = this.data.collisionMap[x] = [];
        if (!line[y]) line[y] = [];
        return line[y];
    };


    /**
     * Add the entity in the collision map according to the collision box
     * @todo shouldnt always be a box (cirle, elipse ...)
     * @todo multiple box for an entity
     */
    yespix.fn.collisionOccupy = function(entity) {
        var box = entity.collisionBox();
        if (box.width <= 0 || box.height <= 0) return;

        var cellX = minCellX = Math.floor(box.x / this.collisionSize);
        var cellY = minCellY = Math.floor(box.y / this.collisionSize);
        var maxCellX = Math.floor((box.x + box.width) / this.collisionSize);
        var maxCellY = Math.floor((box.y + box.height) / this.collisionSize);
        //if (this.key(' ')) this.dump(box, 'collisionOccupy :: box for entity "' + entity.name + '"');
        //if (this.key(' ')) console.log('collisionOccupy :: minCellX = ' + minCellX + ', minCellY = ' + minCellY + ', maxCellX = ' + maxCellX + ', maxCellY = ' + maxCellY);

        while (cellX <= maxCellX) {
            cellY = minCellY;
            while (cellY <= maxCellY) {
                //if (this.key(' ')) console.log('collisionOccupy :: cellX = ' + cellX + ', cellY = ' + cellY);
                this.collisionAdd(entity, cellX, cellY);
                cellY++;
            }
            cellX++;
        }
    };

    yespix.fn.collisionAdd = function(entity, x, y, type) {
        if (type == 'canvas') {
            var x = Math.floor(x / this.collisionSize);
            var y = Math.floor(y / this.collisionSize);
        }

        var line = this.data.collisionMap[x];
        if (!line) {
            line = this.data.collisionMap[x] = [];
            line[y] = [entity];
            //if (this.key(' ')) console.log('collisionAdd :: new line');
            //if (this.key(' ')) console.log('collisionAdd :: final entity count 1');
            return true;
        }
        if (!line[y]) {
            line[y] = [];
            if (this.key(' ')) console.log('collisionAdd :: new column, final entity count 1');
        }
        line[y].push(entity);
        if (this.key(' ')) console.log('collisionAdd :: before unique count ' + line[y].length);
        this.unique(line[y]);
        if (this.key(' ')) console.log('collisionAdd :: final entity count ' + line[y].length);
        return true;
    };

    yespix.fn.collisionCheck = function(entity1, entity2) {
        var box1 = entity1.collisionBox();
        var box2 = entity2.collisionBox();

        // check if box1 is left of box2
        if (box1.x + box1.width - 1 < box2.x) return false;

        // check if box1 is right of box2
        if (box1.x + 1 > box2.x + box2.width) return false;

        // check if box1 is above box2
        if (box1.y + box1.height - 1 < box2.y) return false;

        // check if box1 is under box2
        if (box1.y + 1 > box2.y + box2.height) return false;

        // else box1 intersects box2
        return true;
    };

    yespix.fn.collisionTouch = function(entity1, entity2, pixel) {
        if (this.isUndefined(pixel)) pixel = 1;
        var box1 = entity1.collisionBox();
        var box2 = entity2.collisionBox();
        this.dump(box1, 'box1');
        this.dump(box2, 'box2');
        // check if box1 is left of box2
        if (box1.x + box1.width > box2.x - pixel && box1.x + box1.width < box2.x + pixel) return true;

        // check if box1 is right of box2
        if (box1.x > box2.x + box2.width - pixel && box1.x < box2.x + box2.width + pixel) return true;

        // check if box1 is above box2
        if (box1.y + box1.height > box2.y - pixel && box1.y + box1.height < box2.y + pixel) return true;

        // check if box1 is under box2
        if (box1.y > box2.y + box2.height - pixel && box1.y < box2.y + box2.height + pixel) return true;

        // else box1 intersects box2
        return false;
    };

    yespix.fn.collisionInside = function(entity1, entity2) {
        var box1 = entity1.collisionBox();
        var box2 = entity2.collisionBox();

        // check if box1 is inside of box2
        if (box2.x <= box1.x && box2.x + box2.width >= box1.x + box1.width && box2.y <= box1.y && box2.y + box2.height >= box1.y + box1.height) return true;
        return false;
    };

    yespix.fn.collision = function(entity) {
        //if (this.key(' ')) console.log('check collision for entity "' + entity.name + '"');
        var entities = []; // store checked entities to check for collision only once

        var box = entity.collisionBox();
        if (box.width <= 0 || box.height <= 0) {
            //if (this.key(' ')) console.log('no collision box');
            return;
        }
        var cellX = minCellX = Math.floor(box.x / this.collisionSize);
        var cellY = minCellY = Math.floor(box.y / this.collisionSize);
        var maxCellX = Math.floor((box.x + box.width) / this.collisionSize);
        var maxCellY = Math.floor((box.y + box.height) / this.collisionSize);

        //if (this.key(' ')) console.log('minCellX = ' + minCellX + ', minCellY = ' + minCellY + ', maxCellX = ' + maxCellX + ', maxCellY = ' + maxCellY);
        while (cellX <= maxCellX) {
            //if (this.key(' ')) console.log('cellX = ' + cellX);
            cellY = minCellY;
            while (cellY <= maxCellY) {
                //if (this.key(' ')) console.log('cellY = ' + cellY);
                var cell = this.collisionCell(cellX, cellY);
                //if (this.key(' ')) console.log(cell.length + ' entities in cell ' + cellX + ', ' + cellY);
                for (var t = 0; t < cell.length; t++) {
                    if (cell[t] !== entity && !this.inArray(entities, cell[t])) {
                        //if (this.key(' ')) console.log('collision t=' + t + ', cw = ' + entity.collisionWith(cell[t]) + ', cc = ' + this.collisionCheck(entity, cell[t]));
                        if (entity.collisionWith(cell[t]) && this.collisionCheck(entity, cell[t])) {
                            //console.log('trigger collide on entity "' + entity.name + '"');
                            entity.trigger('collide', {
                                entity: cell[t]
                            });
                        }
                    }
                    entities.push(cell[t]);
                }
                cellY++;
            }
            cellX++;
        }

    };

    /**
     ************************************************************************************************************
     ************************************************************************************************************
     * ENTITIES
     */

    yespix.fn.entityRootClassname = '';

    /**
     * Stores some informations about the entity classes
     * @type {Object}
     */
    yespix.fn.entityClasses = {};

    /**
     * Stores list of entity classes waiting for ancestors list creation
     * @type {array}
     */
    yespix.fn.entityAncestorsPending = [];



    /**
     * List of entity instances
     * @type {Object}
     * @example entityInstances[entity._id] refers to the entity with integer id "entity._id"
     * @example entityInstances['.'+classname] refers to an array of entities with the class name "classname"
     * @example entityInstances['/'+classname] refers to an array of entities with an ancestor "classname"
     * @example entityInstances[''] refers to an array of all the entity instances
     */
    yespix.fn.entityInstances = {};

    yespix.fn.entityNextId = 1;
    yespix.fn.entityNextClassId = 1;

    /**
     * Find an entity or multiple entities from the selector, possibly executes a function fn and returns a bunch of
     * entities. The function fn is executed in the context of each entities, meaning that inside the function "this"
     * will refer to the entity. When comparing the selector property to the entity property, the comparision is
     * (selector vs. entity): // @todo
     * - same type 			vs. same type: 		returns True if strictly equals "==="
     * - bool|string type 	vs. array: 			returns True if the selector match one item of the array
     * - regular expression vs. string : 		returns True if the regex matches the string
     * - regular expression vs. array : 		returns True if the regex matches one item of the array
     * - array 				vs. bool|string: 	returns True if one item of the array match the bool or string
     *
     * The entity selector is intentionnally close to the JQuery selector but there is differences. Not working:
     * find('name.class') // ERROR: no space between selector elements
     * find('class#id') // ERROR: no space between selector elements
     * @exemple find('') or find()			// find all the entities
     * @exemple find('test', function() { alert(this._id); }) // find entities with name "test" and show its id
     * @exemple find({}, fn)				// find all the entities and executes "fn" function
     * @example find('test', fn)			// find the entities with name "test"
     * @example find('lady,gaga', fn)		// find the entities with name "lady" OR "gaga"
     * @example find('.image', fn)			// find the entities with class "image"
     * @example find('.sound test', fn)		// find the entities with class "sound" AND name
     * @example find('/image')				// find the entities with a class or an ancestor of "image" // @todo
     * @example find({_ancestors: 'image'})	// find the entities with an ancestor of "image"
     * @example find(4, fn)					// find the entities with the id 4 (number), only one since the id is unique
     * @example find('#4', fn)				// find the entities with the id 4 (number), only one since the id is unique
     * @example find('test, #2, .image', fn) // find the entities with name "test" OR id 2 OR class "image"
     * @exemple find({_name: 'test'}, fn)	// find the entities with name "test"
     * @exemple find({_name: /test/}, fn)	// find the entities with name corresponding to the regex /test/ @todo
     * @exemple find({_name: ['lady', 'gaga']}, fn) // find the entities with name "lady" or "gaga"
     * @return {bunch} YESPIX bunch of entities, an array of entities on which you can call a function on all entities with
     *		bunch.function(args), access the first entity with bunch[0] and access a property with bunch[0].property
     */
    yespix.fn.find = function(selector, fn) {

        if (this.isUndefined(selector)) {
            var result = this.bunch(this.entityInstances['']);
            //console.log('undefined, length = '+result.length);
            if (fn) this.each(result, fn);
            return result;
        }

        // init selector and properties to find
        var properties = {};

        if (this.isString(selector)) {
            // return all entities if the selector is an empty string
            if (selector === '') {
                var result = this.bunch(this.entityInstances['']);
                //console.log('empty "", length = '+result.length);
                if (fn) this.each(result, fn);
                return result;
            }

            // init the properties with the selector
            properties = this.selectorInit(selector);
        } else
        // if selector is the entity._id (integer)
        if (this.isInt(selector)) {
            //console.log('selector is an int, entity = '+this.entityInstances[+selector]);
            // return the entity
            if (this.entityInstances[+selector]) return this.bunch([this.entityInstances[+selector]]);
            return this.bunch();
        } else
        // if the selector is an object, we use it as properties to search for
        if (this.isObject(selector)) {
            // empty properties return all the entities
            if (this.pLength(selector) == 0) {
                var result = this.bunch(this.entityInstances['']);
                //console.log('empty {}, length = '+result.length);
                if (fn) this.each(result, fn);
                return result;
            }
            properties = selector;
        }

        // "selector" is an array of selector strings, each one will be parsed and the results will be merged
        if (this.isArray(properties)) {
            var result = [];
            for (var n in properties) result = result.concat(this.find(properties[n]).array());
            return this.bunch(result);
        }

        // number of properties to match to put the entity in the result
        var propMatch = this.pLength(properties);
        var result = this.bunch();

        var instances = [];

        // if the class property is set, choose the class array to parse
        if (properties['_class'] && properties['_class'] != '') {
            if (this.entityInstances['.' + properties['_class']]) {
                instances = this.entityInstances['.' + properties['_class']];
                if (propMatch == 1) return this.bunch(instances);
            }
            // no class, return empty bunch
            else return this.bunch();
        } else
        // if the ancestor class is set, choose the ancestor array to parse
        // Work only with string ancestor class name, not array of ancestor class names
        if (properties['_ancestors'] && this.isString(properties['_ancestors']) && properties['_ancestors'] != '') {
            if (this.entityInstances['/' + properties['_ancestors']]) {
                instances = this.entityInstances['/' + properties['_ancestors']];
                if (propMatch == 1) return this.bunch(instances);
            }
            // no class, return empty bunch
            else {
                //console.log('return empty bunch');
                return this.bunch();
            }
        }
        // if not, parse the whole list (slow)
        else instances = this.entityInstances[''];

        // console.log('instances length = '+instances.length);
        for (var t = 0; t < instances.length; t++) {
            var count = 0;
            // console.log('find: checking entity ['+t+'] with name "'+instances[t]._name+'"');
            for (var n in properties) {
                // if (instances[t]) console.log('loop :: t='+t+', n='+n+', [t][n]='+instances[t][n]+', prop='+properties[n]);
                // else console.log('loop :: t='+t+', n='+n+', [t][n]=undefined, prop='+properties[n]);
                if (instances[t] !== undefined && instances[t][n] !== undefined && this.selectorCompare(instances[t][n], properties[n])) count++;
                //console.log('property "'+n+'", propMatch = '+propMatch+', count = '+count);
                if (count >= propMatch) {
                    //console.log('find: adding entity to result');
                    result.push(instances[t]);
                }
            }
        }
        // console.log('find: result length = '+result.length);

        if (fn) this.each(result, fn);

        return result;
    };

    yespix.fn.selectorInit = function(selector) {
        // multiple selectors with ','
        if (selector.indexOf(',') != -1) {
            var result = [];
            var selectors = selector.split(',');
            var result = [];
            for (var t in selectors) result.push(this.selectorInit(selectors[t]));
            return result;
        }

        var properties = {};

        // multiple items with ' '
        if (selector.indexOf(' ') != -1) {
            var items = selector.split(' ');
            for (var t in items)
                if (items != '') {
                    if (properties[this.selectorType(items[t])]) console.warn('entity.selectorInit: ambiguous selector item: "' + items[t] + '" defined twice in "' + selector + '"');
                    else properties[this.selectorType(items[t])] = this.selectorValue(items[t]);
                }
        } else // simple selector
        {
            properties[this.selectorType(selector)] = this.selectorValue(selector);
        }
        return properties;
    };

    yespix.fn.selectorCompare = function(entityValue, value) {
        if (this.isString(value)) {
            if (this.isArray(entityValue)) return this.inArray(entityValue, value);
            //if (this.isString(entityValue)) return entityValue === value; 
            return entityValue === value;
        }
        if (this.isArray(value)) {
            if (this.isString(entityValue)) return this.inArray(value, entityValue);
            //if (this.isString(entityValue)) return entityValue === value; 
            return entityValue === value;
        }
        if (this.isRegexp(value)) {
            if (this.isString(entityValue)) return value.test(entityValue);
            return entityValue === value;
        }
        return entityValue === value;
    };

    yespix.fn.selectorType = function(str) {
        if (str[0] == '.') return '_class';
        if (str[0] == '#') return '_id';
        if (str[0] == '/') return '_ancestors';
        return 'name';
    };

    yespix.fn.selectorValue = function(str) {
        if (str[0] == '.') return str.substr(1, str.length);
        if (str[0] == '#') return +str.substr(1, str.length);
        if (str[0] == '/') return str.substr(1, str.length);
        return str;
    };


    /**
     * Convert an array of entities into a bunch of entities. The bunch object is an array of entities on which you can call a function on all entities with
     * bunch.function(args), access the first entity with bunch[0] and access a property with bunch[0].property. The bunch object also have all the
     * array functions and properties such as length, concat ...
     */
    yespix.fn.bunch = function(list) {
        if (!list || list.length == 0)
            return new Bunch();
        return new Bunch(list);
    };


    /**
     *
     * @param  {[type]} object     [description]
     * @param  {[type]} properties [description]
     * @return {[type]}            [description]
     */
    yespix.fn.mixin = function(object, properties) {
        for (fn in properties) {
            {
                object[fn] = properties[fn];
                if (this.isFunction(object[fn])) Bunch.prototype[fn] = function(fn, yespix) {
                    return function() {
                        var args = [].slice.call(arguments);
                        yespix.each(this.array(), fn, args);
                        return this;
                    };
                }(fn, this);
            }
        }
    };


    yespix.fn.ancestors = function(name) {
        //				console.log('ancestors :: name = '+name);
        if (this.entityClasses[name]) {
            var list = [];
            for (var t = 0; t < this.entityClasses[name].ancestors.length; t++) {
                var a = this.entityClasses[name].ancestors[t];
                list = list.concat(this.ancestors(a));
            }
            list.push(name);
            //					console.log('ancestors :: return list length '+list.length);
            return list;
        } else {
            //					console.log('ancestors :: return empty list');
            return [];
        }
    };


    yespix.fn.define = function(name, list, properties) {

        // error if the entity class name already exists
        if (this.entityClasses[name]) {
            console.warn('define :: entity class name "' + name + '" already exists');
            return;
        }

        // init the parameters
        if (typeof list !== 'string') {
            properties = list;
            list = this.entityRootClassname;
        }
        if (typeof properties !== 'object') {
            properties = {};
        }
        if (list == '') list = this.entityRootClassname;

        // split the list into an array
        list = list.split(' ').join(',').split(',');

        // init the entity class
        this.entityClasses[name] = {
            ancestors: [],
            ancestorsReady: false,
            list: list,
            classname: name,
            properties: properties,
        };

        // adding the ancestors
        this.entityFetchAncestors(name);
        this.entityClasses[name].ancestors = this.unique(this.entityClasses[name].ancestors);

        if (!this.isEntityAncestorsPending[name]) {
            if (this.entityAncestorsPending.length > 0) {
                var length = this.entityAncestorsPending.length;
                var count = 0; // number of entity ancestors initiated
                for (var t = 0; t < length; t++) {
                    if (this.entityFetchAncestors(this.entityAncestorsPending[t], 'silent')) count++;
                }
                if (count > 0) {
                    var newList = [];
                    for (var t = 0; t < length; t++) {
                        if (!this.entityClasses[this.entityAncestorsPending[t]].ancestorsReady) newList.push(this.entityAncestorsPending[t]);
                    }
                    this.entityAncestorsPending = newList;
                }
            }
        }

        this.trigger('define', {
            class: this.entityClasses[name]
        });

        return this;
        //console.log('entity.define :: entity class name "'+name+'" added');
        //console.log('entity.define :: ancestors = "'+this.entityClasses[name].ancestors.join(', ')+'"');
        //console.log('----');
    };

    /**
     * @param {string} className The class name of the entity to
     * @param {string} mode Mode: optional, with "pending" mode, entity class with missing ancestor will be placed in the pending list
     */
    yespix.fn.entityFetchAncestors = function(className, mode) {
        if (!this.entityClasses[className]) {
            console.warn('entityFetchAncestors :: entity class name "' + className + '" does not exist');
            return false;
        }

        if (this.entityClasses[className].ancestorsReady) return true;

        mode = mode || 'pending';
        var list = this.entityClasses[className].list;

        for (var t = 0; t < list.length; t++) {
            if (list[t] != '') {
                if (!this.entityClasses[list[t]]) {
                    if (mode == 'pending') {
                        console.warn('entityFetchAncestors :: cannot find the ancestor class name "' + list[t] + '" for class "' + className + '", add as pending entity');
                        this.entityAncestorsPending.push(className);
                        this.entityClasses[className].ancestors = [];
                        this.entityClasses[className].ancestorsReady = false;
                        return false;
                        break;
                    } else {
                        if (mode != 'silent') console.error('entityFetchAncestors :: cannot find the ancestor class name "' + list[t] + '" for entity class "' + className + '"');
                        this.entityClasses[className].ancestorsReady = false;
                        return false;
                    }
                } else if (list[t] == className) {
                    if (mode != 'slient') console.warn('entityFetchAncestors :: entity class cannot add itself to ancestors, skipping');
                } else {
                    this.entityClasses[className].ancestors = this.entityClasses[className].ancestors.concat(this.ancestors(list[t]));
                }
            }
        }
        this.entityClasses[className].ancestorsReady = true;
        return true;
    };

    yespix.fn.isEntityAncestorsPending = function(className) {
        var len = this.entityAncestorsPending.length;
        for (var t = 0; t < len; t++) {
            if (this.entityAncestorsPending[t] == className) return true;
        }
        //console.log('isEntityAncestorsPending :: entity "' + className + '" not pending');

        return false;
    };



    yespix.fn.spawn = function(name, properties) {
        if (properties === true) properties = {};
        else properties = properties || {};

        if (name.indexOf(',') != -1) {
            var list = name;
            if (properties.name && !this.entityClasses[properties.name]) name = properties.name;
            else name = 'tempclass' + this.entityNextClassId++;
            this.define(name, list, properties);
            properties = {};
        }
        if (!this.isDefined(name)) {
            console.warn('spawn :: entity class name "' + name + '" does not exist');
            return null;
        }

        var entity = {};

        // check if the entity was waiting other classes to load
        if (this.isEntityAncestorsPending(name)) {
            console.log('spawn :: entity "' + name + '" is pending. Getting ancestors ...');
            this.entityFetchAncestors(name, 'force');
        } else console.log('spawn :: entity "' + name + '" is NOT pending');

        // mixin with the ancestors
        for (var t = 0; t < this.entityClasses[name].ancestors.length; t++) {
            var c = this.entityClasses[this.entityClasses[name].ancestors[t]];
            if (c) {
                this.mixin(entity, c.properties);
            } else console.warn('spawn :: entity class ancestor "' + this.entityClasses[name].ancestors[t] + '" does not exist for entity class name "' + name + '"')
        }


        // mixin with the class name
        this.mixin(entity, this.entityClasses[name].properties);


        // copy the spawn properties
        for (var fn in properties) {
            entity[fn] = properties[fn];
        }
        entity._class = name;
        entity._ancestors = this.entityClasses[name]['ancestors'];
        entity._id = this.entityNextId++;

        this.instanceAdd(entity);

        // executing the init functions on ancestors
        this.call(entity, 'init', [properties]);
        if (this.isFunction(entity.init)) entity.init(properties);

        if (entity._ancestors.length > 0)
            for (t = 0; t < entity._ancestors.length; t++) this.trigger('spawn:' + entity._ancestors[t], {
                entity: entity
            });

        return entity;
    };


    /**
     *
     * A reference of the entity will be the inserted in:
     * yespix.entityInstances[''] 					at the index entity._instances[''] (integer)
     * yespix.entityInstances[entity._id]	 		at the index entity._id (integer)
     * yespix.entityInstances['.'+entity._class]	at the index entity._instances[entity._class]
     * yespix.entityInstances['/'+ancestorClass]	at the index entity._instances[ancestorClass]
     */
    yespix.fn.instanceAdd = function(entity) {
        // the entity must not be in any instances list because we are overriding his _instances object
        if (entity._instances) this.instanceRemove(entity);
        entity._instances = {};


        // insert reference in the global instances list
        if (this.isUndefined(this.entityInstances['']) || this.entityInstances[''].length == 0) {
            this.entityInstances[''] = [entity];
            entity._instances[''] = 0;
        } else {
            this.entityInstances[''].push(entity);
            entity._instances[''] = this.entityInstances[''].length - 1;
        }

        // insert reference with the entity Id
        this.entityInstances[+entity._id] = entity;

        // insert reference in the class instances list for its own class name
        if (this.isUndefined(this.entityInstances['.' + entity._class]) || this.entityInstances['.' + entity._class].length == 0) {
            this.entityInstances['.' + entity._class] = [entity];
            entity._instances[entity._class] = 0;
        } else {
            this.entityInstances['.' + entity._class].push(entity);
            entity._instances[entity._class] = this.entityInstances['.' + entity._class].length - 1;
        }

        // insert a reference in the ancestor instances list for all its ancestors
        if (entity._ancestors.length > 0)
            for (var t = 0; t < entity._ancestors.length; t++) {
                if (this.isUndefined(this.entityInstances['/' + entity._ancestors[t]]) || this.entityInstances['/' + entity._ancestors[t]].length == 0) {
                    this.entityInstances['/' + entity._ancestors[t]] = [entity];
                    entity._instances[entity._ancestors[t]] = 0;
                } else {
                    console.log('add instance to /' + entity._ancestors[t]);
                    this.entityInstances['/' + entity._ancestors[t]].push(entity);
                    entity._instances[entity._ancestors[t]] = this.entityInstances['/' + entity._ancestors[t]].length - 1;
                }
            }

        // Trigger some events to dispatch the spawn of an entity
        this.trigger('spawn', {
            entity: entity
        });
        this.trigger('spawn:' + entity._class, {
            entity: entity
        });
    };

    yespix.fn.instanceRemove = function(entity) {
        // remove reference from the global instances list
        if (this.entityInstances['']) this.entityInstances[''].splice(entity._instances[''], 1);

        // remove reference with the entity Id
        delete this.entityInstances[+entity._id];

        // remove reference from the class instances list for its own class name
        if (this.entityInstances['.' + entity._class]) this.entityInstances['.' + entity._class].splice(entity._instances[entity._class], 1);

        // insert a reference in the class instances list for all its ancestors
        if (entity._ancestors.length > 0)
            for (var t = 0; t < entity._ancestors.length; t++)
                if (this.entityInstances['/' + entity._ancestors[t]]) this.entityInstances['/' + entity._ancestors[t]].splice(entity._instances[entity._ancestors[t]], 1);

        this.trigger('remove', {
            entity: entity
        });
        this.trigger('remove:' + entity._class, {
            entity: entity
        });
    };

    /**
     * Return True if the entity name have a defined class
     * @function isDefined
     * @param {string} name Name of the entity class
     * @return {boolean} True if the entity classname exists
     */
    yespix.fn.isDefined = function(name) {
        return !!this.entityClasses[name];
    };

    /**
     * Returns True if the entity class possesses all the ancestors
     * @function hasAncestors
     * @param {string} name Name of the entity
     * @param {array|string} ancestors A string of ancestor names separeted by "," or an array
     *
     */
    yespix.fn.hasAncestors = function(classname, ancestors) {
        if (!this.isDefined(name)) return null;
        if (this.isString(ancestors)) ancestors = [ancestors];
        for (var t = 0; t < ancestors.length; t++)
            if (!this.inArray(this.entityClasses[name].ancestors, ancestors[t])) return false;
        return true;
    };

    /**
     * Call some entity class functions on the context of an entity object. e.g.
     * @trigger call
     * @param {object} entity Entity instance
     * @param {string|function} fn Function name in a string or function reference to call // @todo
     * @param {string} classes List of entity classes in a string and separated with ",". By default, the function use the entity ancestors as classes list
     * @param {array} params Parameters of the function call
     * @return {array} Array of objects that gives the detailed results of each function
     * @example call(entity, 'test') // call "test" function on every ancestors of the entity
     * @example call(entity, 'test', [1,2,3]) // call "test" function on every ancestors of the entity with parameters 1, 2 and 3
     * @example call(entity, 'test', 'a, b, c') // call "test" function on ancestors "a", "b" and "c"
     * @example call(entity, 'test', 'a, b', [1, 2]) // call "test" function on ancestors "a" and "b" with parameters 1 and 2
     */
    yespix.fn.call = function(entity, fn, ancestors, params) {
        //console.log('call : entity._class='+entity._class+', fn='+fn+', ancestors='+ancestors);

        if (!this.isDefined(entity._class)) return null;
        if (this.isString(ancestors)) ancestors = ancestors.split(',');
        else if (ancestors && !params) {
            params = ancestors;
            ancestors = [];
        }
        params = params || [];
        ancestors = ancestors || [];

        if (ancestors.length > 0 && !this.hasAncestors(entity._class, ancestors)) return null;
        else if (ancestors.length == 0) ancestors = this.entityClasses[entity._class].ancestors;

        //console.log('ancestors = '+ancestors.join(', '));

        var result = [];
        for (var t = 0; t < ancestors.length; t++) {
            if (this.entityClasses[ancestors[t]] && this.entityClasses[ancestors[t]].properties[fn] && this.isFunction(this.entityClasses[ancestors[t]].properties[fn])) {
                result.push({
                    name: ancestors[t],
                    status: 'called',
                    result: this.entityClasses[ancestors[t]].properties[fn].apply(entity, params),
                    error: '',
                });
            } else {
                var err = '';
                if (!this.entityClasses[ancestors[t]]) err = 'Ancestor entity "' + ancestors[t] + '" does not seem to be defined';
                else if (!this.entityClasses[ancestors[t]].properties[fn]) err = 'Ancestor entity "' + ancestors[t] + '" have no "' + fn + '" function';
                else if (!this.isFunction(this.entityClasses[ancestors[t]].properties[fn])) err = 'Property "' + fn + '" is not a function in ancestor entity "' + ancestors[n] + '"';
                else err = 'Unknown error';
                result.push({
                    name: ancestors[t],
                    status: 'error',
                    result: null,
                    error: err,
                });
            }
        }

        this.trigger('call', {
            entity: entity,
            fn: fn,
            ancestors: ancestors,
            params: params,
            result: result
        });

        return result;
    };

    /**
     ************************************************************************************************************
     ************************************************************************************************************
     * EVENT
     *
     */

    /**
     * Trigger an event of an object. This function look inside the property "_eventList" of the object and
     * iterates the array to trigger each event in the list. All the events are triggered synchronously, so
     * after you called the trigger function, all the events are done.
     * // TODO make an asynchrone option
     * @method trigger
     * @param {string} name Name of the trigger
     * @param {object} e Event object, optional
     * @param {object} obj Object of the event, optional. Default is the YESPIX engin object
     * @example trigger("test") triggers the event "test" of the YESPIX engine
     * @example trigger("ding", {ts: "2013-11-22 11:55:00"}) triggers the event "ding" of the YESPIX engine
     *		and provides an event object with some data
     * @example trigger("tick", entity) triggers the event "tick" of an object "entity"
     * @example trigger("tick", {ts: "2013-11-22 11:55:00"}, entity) triggers the event "tick" of an
     *		object "entity" and provides an event object with some data
     */
    yespix.fn.trigger = function(name, event, obj) {
        // Function can't trigger anything if there is no name
        if (!name) return this;

        // initialize the object
        obj = obj || this;

        // initialise the event
        event = event || {};
        event.type = name;

        // loop inside the list of events stored in the obj._eventList[name]
        if (obj._eventList && obj._eventList[name]) {
            for (var t = 0, length = obj._eventList[name].length; t < length; t++) {
                // The context is needed for the function. By default, the context will be the YESPIX object
                var context = obj._eventList[name][t].context || this;
                obj._eventList[name][t].callback.apply(context, [event]);
            }
        }
        return this;
    };

    /**
     * Bind an event to an object. All the events of an object are store in the property "_eventList" of the object.
     * "_eventList" is a list of objects describing the events.
     * @method on
     * @param {string} name Name of the event
     * @param {function} callback Function to call on the event
     * @param {object} context Optional, context of the callback. Inside the function, "this" will refer to the context
     *		object. Default is YESPIX object
     * @param {object} obj Optional, object to bind with the event. Default is YESPIX object
     * @chainable
     * @example on('enterFrame', fn) call "fn" on the trigger of "enterFrame" of the YESPIX engine
     * @example on('ding', fn, entity) call "fn" on the trigger of "ding" of the YESPIX engine
     */
    yespix.fn.on = function(name, callback, context, obj) {
        // Function can't bind event with no name
        if (!name || !callback) return null;

        // initialize context, by default the YESPIX engine object
        context = context || this;
        obj = obj || context;
        if (!obj._eventList) obj._eventList = {};
        if (!obj._eventList[name]) obj._eventList[name] = [{
            name: name,
            callback: callback,
            context: context
        }];
        else obj._eventList[name].push({
            name: name,
            callback: callback,
            context: context
        });
        return this;
    };


    /**
     * Remove a function from an event or delete an entire event from an object
     * @method off
     * @param {string} name Name of the event
     * @param {function} callback Function to remove from event, optional
     * @param {object} context Context of the callback, optional. Inside the function, "this" will refer to the context
     *		object. Default is the YESPIX engine object.
     * @chainable
     * @example unbind("ding") deletes the event "ding" of the YESPIX engine object
     * @example unbind("ding", entity) deletes the event "ding" of the "entity" object
     * @example unbind("enterFrame", fn) deletes the function "fn" from the event "enterFrame" of the YESPIX engine object
     * @example unbind("tick", fn, entity) removes the function "fn" from the event "tick" of the "entity" object
     */
    yespix.fn.off = function(name, callback, obj) {
        // Function can't unbind event with no name
        if (!name) return null;

        // initialize the argument
        if (this.isObject(callback)) {
            obj = callback;
            callback = null;
        }
        obj = obj || this;
        if (!obj._eventList || !obj._eventList[name]) return this;

        // remove all events
        if (!callback) {
            delete obj._eventList[name];
            return this;
        }
        // remove only events matching with the callback function
        if (obj._eventList[name])
            for (var t = 0, len = obj._eventList[name].length; t < len; t++) {
                if (obj._eventList[name][t] && obj._eventList[name][t].callback == callback) {
                    delete obj._eventList[name][t];
                    obj._eventList[name].splice(t, 1);
                    t--;
                }
            }
        return this;
    };

    /**
     * @method ready
     * Add a function call to the ready event of the YESPIX engine
     * @exemple
     * @todo ready must be triggered by the event system
     * @chainable
     */
    yespix.fn.ready = function(fn, context) {
        if (isReady) fn.call(context, {
            type: "ready"
        });
        else on('ready', fn, context);
        return this;
    };



    /**
     * @method listen
     * Listen to variable change
     * @param {object} obj Objet reference
     * @param {string|aray} pname Property name of the object to listen to
     * @param {function} callback Callback function
     */

    yespix.fn.listen = function(obj, pname, callback) {
        var t;

        // listen to multiple properties
        if (this.isArray(pname)) {
            for (t = 0; t < pname.length; t++) this.listen(obj, pname[t], callback);
            return true;
        }

        // listen to multiple objects
        if (this.isArray(obj)) {
            for (t = 0; t < obj.length; t++) this.listen(obj[t], pname, callback);
            return true;
        }

        //console.log('listen :: obj[pname] = ' + obj[pname]);
        var initValue = obj[pname];
        callback = callback || this.listenTrigger;
        if (Object.defineProperty) {
            //				var value = obj[pname];
            //				console.log('value = '+value);
            obj['__var_callback_' + pname] = callback;

            Object.defineProperty(obj, pname, {
                get: function() {
                    return obj['__var_new_' + pname];
                },
                set: function(value) {
                    obj['__var_old_' + pname] = obj['__var_new_' + pname];
                    obj['__var_new_' + pname] = value;
                    obj['__var_callback_' + pname].call(obj, obj, {
                        target: obj,
                        name: pname,
                        oldValue: obj['__var_old_' + pname],
                        newValue: value,
                    });
                },
            });
        } else if ('__defineSetter__' in obj && '__defineSetter__' in obj) {
            obj._changedCallback = callback;
            obj.__defineGetter__(pname, function() {
                return obj['__var_new_' + pname];
            });
            obj.__defineSetter__(pname, function(value) {
                obj['__var_old_' + pname] = obj['__var_new_' + pname];
                obj['__var_new_' + pname] = value;
                obj['__var_callback_' + pname].call(obj, obj, {
                    target: obj,
                    name: pname,
                    oldValue: obj['__var_old_' + pname],
                    newValue: value,
                });
            });
        } else {
            obj['__var_old_' + pname] = initValue;
            obj['__var_new_' + pname] = initValue;
            obj['__var_callback_' + pname] = callback;
            //console.log('listen :: name = ' + pname + ', value = ' + obj[pname]);
            this.on('enterFrame', function() {
                //console.log('listen :: enterFrame :: name = '+pname+', value = '+this[pname]+', old = '+this['__var_old_'+pname]);
                if (this[pname] != this['__var_new_' + pname]) {
                    this['__var_old_' + pname] = this['__var_new_' + pname];
                    this['__var_new_' + pname] = this[pname];
                    this['__var_callback_' + pname].call(this, this, {
                        target: this,
                        name: pname,
                        oldValue: obj['__var_old_' + pname],
                        newValue: obj['__var_new_' + pname],
                    });
                }
            }, obj, this);

        }
        //console.log('listen :: before set obj[pname] = ' + obj[pname]);
        obj[pname] = initValue;
        //console.log('listen :: after set obj[pname] = ' + obj[pname]);
    };

    yespix.fn.listenTrigger = function(obj, e) {
        obj._changed = true;
        if (!obj._changedList) obj._changedList = {};
        obj._changedList[e.name] = true;
        obj.trigger('change:' + e.name, e);
    };

    /**
     ************************************************************************************************************
     ************************************************************************************************************
     * FILE
     *
     */

    /**
     * @method load
     * Load some files and call "complete" function. Options can also add some other function calls ("error",
     * "progress", "success", "skip") and "once" option. The methods "addjs" and "addcss" both use the "load"
     * method and the same kind of options. If you provide options['complete'], it will overrides the
     * "complete" parameter.
     * For each functions, an event object is returned as follow:
     * 		event['size']: size of the file, if
     * 		event['loaded']: size of the file, if
     * 		event['progress']: size of the file, if
     * 		event['state']: pending / processing / loaded / error
     * 		event['lengthComputable'] : true if the file size is known
     * 		event['stat'] : object that provides the overall informations for all the files requested (size, loaded ...)
     * @param {object} options Options of the file load, optional.
     *		options['complete']: function called on complete, remember that the file can be successfully
     *				downloaded or have an error, look at the event.status or use the "success" and "error" functions
     *		options['success']: function called on success, request returned an "ok" status (code 200)
     *		options['error']: function called on error
     *		options['progress']: function called on progress
     *		options['skip']: function called when a file is skipped
     *		options['ordered']: True if you want to execute the complete and success functions in the specified order the fileList
     *		options['once']: boolean, if file has been already downloaded successfully, the file will be skipped,
     *				default is False. Note that if the file was previously loaded with an error, the function will
     *				try another load process even if options['once'] is true.
     *		options[url]: This is the URL specific options where url is the URL string of the fileList and options[url]
     *				is the new options you want to apply to the url.
     * @example load('folder/file.ext') loads the file
     * @example load(['file1','file2','file3']) loads 'file1', 'file2' and 'file3'
     * @example load(files, complete) loads the files in the array "files" and call the function "complete"
     * @example load(files, options) loads the files and initialize with the options object
     */
    yespix.fn.load = function(fileList, complete, options) {
        // do nothing if no fileList
        if (!fileList) return this;

        // init the fileList
        if (this.isString(fileList)) fileList = [fileList];
        if (this.isObject(complete)) {
            options = complete;
            complete = function() {};
        }

        // init the options
        options = options || {};
        options['complete'] = options['complete'] || complete || function() {};
        options['error'] = options['error'] || function() {};
        options['progress'] = options['progress'] || function() {};
        options['skip'] = options['skip'] || function() {};
        options['success'] = options['success'] || function() {};
        options['once'] = options['once'] || false;
        options['ordered'] = options['ordered'] || false;
        options['entity'] = options['entity'] || yespix;

        var len = fileList.length,
            index = 0,
            stat = {
                loaded: 0,
                progress: 0,
                size: 0,
                allComplete: false,
                allSuccess: false,
                errorCount: 0,
            },
            urlOptions;

        // loop fileList
        for (; index < len; index++) {

            if (!fileList[index]) continue;

            // init url specific options in urlOptions to store it in yespix.data.file[url]
            if (options[fileList[index]]) {
                urlOptions = options[fileList[index]];
                urlOptions = urlOptions || {};
                urlOptions['complete'] = urlOptions['complete'] || options['complete'] || complete || function() {};
                urlOptions['error'] = urlOptions['error'] || options['error'] || function() {};
                urlOptions['progress'] = urlOptions['progress'] || options['progress'] || function() {};
                urlOptions['skip'] = urlOptions['skip'] || options['skip'] || function() {};
                urlOptions['success'] = urlOptions['success'] || options['success'] || function() {};
                urlOptions['once'] = urlOptions['once'] || options['once'] || false;
            } else urlOptions = options;

            // if the file already exists and urlOptions['once'] is set to True
            if (urlOptions['once'] && this.data.file[fileList[index]]) {
                // skip the file
                if (this.options['debug']) console.warn('yespix.load: skip the file "' + fileList[index] + '"');
                urlOptions['skip']({
                    file: this.data.file[fileList[index]],
                    url: fileList[index],
                    type: 'skip',
                    entity: options['entity'],
                });
                continue;
            }

            // Setting new variables in urlOptions
            urlOptions.isLastFile = (index == fileList.length - 1);
            urlOptions.isFirstFile = (index == 0);
            urlOptions.fileList = fileList;

            // stat will store the overall progress of the files load
            urlOptions.stat = stat;


            // init the file object if not found with no state 
            if (!this.data.file[fileList[index]]) {
                this.data.file[fileList[index]] = {
                    loaded: 0,
                    progress: 0,
                    size: 0,
                    done: false,
                    lengthComputable: false,
                    options: [],
                };
            }

            // file will now refer to the current file URL object
            var file = this.data.file[fileList[index]];

            // starting a XMLHttpRequest client only if the file is not currently downloading.
            if (!this.data.file[fileList[index]] // file URL not previously loaded
                || !this.data.file[fileList[index]].state // file URL has no state 
                || this.data.file[fileList[index]].state == 'loaded' // file loaded but options['once'] is false
                || this.data.file[fileList[index]].state == 'error' // file complete with an error
            ) {

                // overriding previous file object
                this.data.file[fileList[index]] = {
                    state: 'pending',
                    loaded: 0,
                    progress: 0,
                    size: 0,
                    done: false,
                    lengthComputable: false,
                    options: [urlOptions],
                    url: fileList[index],
                };

                // start XMLHttpRequest client
                var client = null;

                // create XMLHttpRequest
                if (window.XMLHttpRequest) client = new XMLHttpRequest();
                else if (window.ActiveXObject) {
                    var names = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
                    for (var i in names) {
                        try {
                            client = new ActiveXObject(names[i]);
                            break;
                        } catch (e) {}
                    }
                    // cancel load, nothing will work
                    if (!client) {
                        console.error("yespix.load: the browser does not support XMLHTTPRequest");
                        return null;
                    }
                }

                // add a reference to the yespix object in the XMLHttpRequest client
                client.yespix = this;

                // add URL to the XMLHttpRequest client
                client.url = fileList[index];
                client.file = this.data.file[fileList[index]];

                /**
                 * Extract data from the event and process the progress for the file and the overall progress for
                 * all the files in fileList array
                 * @param {object} e The event object where e.url is the URL of the file loading
                 */
                function progress(e) {
                    var file = client.file;
                    e.file = file;

                    // check if the file is already finished and do not call progress anymore
                    if (file.done) {
                        e.size = file.size;
                        e.totalSize = file.size;
                        e.loaded = file.loaded;
                        e.progress = file.progress;
                        return;
                    }


                    if (!file.lengthComputable && !e.lengthComputable) {
                        // the file did not start download and we dont know its size
                        file.state = 'pending';
                        file.loaded = 0;
                        file.progress = 0;
                        file.size = 0;
                        file.lengthComputable = false;
                    } else {
                        // process progress for the file
                        file.lengthComputable = true;
                        if (file.loaded < e.loaded) file.loaded = e.loaded;
                        if (file.size < e.totalSize) file.size = e.totalSize;
                        if (file.size > 0) file.progress = parseInt(file.loaded / file.size * 10000) / 100;
                        else file.progress = 100;
                        if (file.progress > 100) file.progress = 100;
                        if (file.progress == 100) file.state = 'loaded';
                        else file.state = 'processing';
                    }

                    var newEvent = {
                        size: file.size,
                        loaded: file.loaded,
                        progress: file.progress,
                        lengthComputable: file.lengthComputable,
                        state: file.state,
                        url: file.url,
                        file: file,
                        entity: options['entity'],
                    };
                    console.log('file.options.entity: ' + file.options.entity);

                    // loop inside file.options
                    if (file.options)
                        for (var u = 0; u < file.options.length; u++) {

                            if (file.options[u]) {
                                // init the stat of the file object
                                file.options[u].stat.loaded = 0;
                                file.options[u].stat.progress = 0;
                                file.options[u].stat.size = 0;
                                file.options[u].stat.allComplete = true; // init to true and set to false when a file is not complete
                                file.options[u].stat.allSuccess = true; // init to true and set to false when a file have an error
                                file.options[u].stat.errorCount = 0;

                                // process progress for all the files in file.options[].fileList
                                if (file.options[u].fileList)
                                    for (var t = 0; t < file.options[u].fileList.length; t++) {
                                        var otherFile = client.yespix.data.file[file.options[u].fileList[t]];
                                        if (otherFile && otherFile.lengthComputable) {
                                            // file started downloading and might be complete
                                            file.options[u].stat.loaded += otherFile.loaded;
                                            file.options[u].stat.size += otherFile.size;
                                            if (otherFile.loaded < otherFile.size) file.options[u].stat.allComplete = false;
                                        } else if (otherFile && otherFile.state == 'error') {
                                            // error
                                            file.options[u].stat.allSuccess = false;
                                        } else {
                                            // file pending
                                            file.options[u].stat.allComplete = false;
                                            file.options[u].stat.allSuccess = false;
                                            file.options[u].stat.errorCount++;
                                            break;
                                        }
                                    }
                                    // set progress to 100% if all files are complete
                                if (file.options[u].stat.allComplete == true) file.options[u].stat.progress = 100;
                                // process stat progress
                                else if (file.options[u].stat.loaded > 0) file.options[u].stat.progress = parseInt(file.options[u].stat.loaded / file.options[u].stat.size * 10000) / 100;
                                // no files started, set progress to 0%
                                else file.options[u].stat.progress = 0;

                            }
                        }
                    return newEvent;
                }

                client.onreadystatechange = function(e) {
                    var file = this.file;

                    // currently downloading
                    e.url = this.url;

                    // check the state
                    var state = this.readyState || e.type;

                    // process the progress of the file
                    var newEvent = progress(e);

                    // The event "onreadystatechange" can be triggered by browsers several times with the same state. To check if the
                    // file has already been processed, check the value of file.done
                    if (!file.done && (/load|loaded|complete/i.test(state) || state == 4)) {
                        // the file is complete, might also returned an error.
                        // we do not put the content in the memory because it would take too much space for big files
                        newEvent.content = this.responseText;

                        newEvent.url = this.url;
                        newEvent.status = this.status;
                        file.done = true;

                        // exclude error HTML status 400 & 500
                        if (this.status >= 400) { // @todo this do not handle other error codes like 310 ...
                            if (this.yespix.options['debug']) console.error('Could not load the file "' + this.url + '"');
                            newEvent.state = file.state = 'error';

                            // executes error and complete functions
                            for (var t = 0; t < this.file.options.length; t++) {
                                newEvent.stat = this.file.options[t].stat;
                                newEvent.type = 'error';
                                this.file.options[t]['error'](newEvent);
                                newEvent.type = 'complete';
                                this.file.options[t]['complete'](newEvent);
                            }
                            this.file.options = [];
                            return;
                        }

                        // executes success and complete functions
                        newEvent.state = file.state = 'loaded';
                        for (var t = 0; t < this.file.options.length; t++) {
                            newEvent.stat = this.file.options[t].stat;
                            newEvent.type = 'success';
                            this.file.options[t]['success'](newEvent);
                            newEvent.type = 'complete';
                            this.file.options[t]['complete'](newEvent);
                        }
                        this.file.options = [];
                    }
                };

                client.addEventListener('progress', function(e) {
                    if (!file.done) {
                        var newEvent = progress(e);

                        // executes progress functions
                        newEvent.type = 'progress';
                        for (var t = 0; t < this.file.options.length; t++) {
                            newEvent.stat = this.file.options[t].stat;
                            this.file.options[t]['progress'](newEvent);
                        }
                    }
                }, false);

                // 
                client.open('GET', client.url);
                client.send('');
            } else {
                // If the file object has a state == 'pending' or 'processing', it means it's still downloading and the 
                // current load options will be added to the file object
                if (!file.options || file.options.length == 0) file.options = [urlOptions];
                // or adding the urlOptions to the list
                else file.options.push(urlOptions);
            }

        }
        // end fileList loop

        return this;
    };


    /**
     * Loads a js script file and execute it
     * @method js
     * @param fileList {array|string} Array of the script files to load
     * @param complete {function} Called when the load of the whole list is complete
     * @param options {function} Called when a script load throw an error
     * @use addjs('my/js/file.js');
     * @use addjs(['file01.js', 'file02.js', 'file03.js'], function() { });
     * @use addjs(['file01.js', 'file02.js', 'file03.js'], { complete: ... , error: ... , once: true});
     */
    yespix.fn.js = function(fileList, complete, options) {
        var e = null;

        if (!fileList) return this;
        if (this.isString(fileList)) fileList = [fileList];
        if (this.isObject(complete)) {
            options = complete;
            complete = function() {};
        }

        options = options || {};
        options['complete'] = options['complete'] || complete || function() {};
        options['error'] = options['error'] || function() {};
        options['progress'] = options['progress'] || function() {};
        options['success'] = options['success'] || function() {};
        options['skip'] = options['skip'] || function() {};
        options['once'] = options['once'] || false;
        options['ordered'] = options['ordered'] || false;

        success = options['success'];

        if (!options['ordered']) {
            options['success'] = function(e) {
                eval(e.content);
                success(e);
            };
            return this.load(fileList, options);
        } else {
            var token = 0;
            options['success'] = function(e) {
                if (fileList[token] == e.file) {
                    eval(e.content);
                    success(e);
                    token++;
                    while (fileList[token]) {
                        if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
                            eval(this.data.file[fileList[token]].content);
                            success(this.data.file[fileList[token]].eventComplete);
                            token++;
                        } else break;
                    }
                } else this.data.file[fileList[token]].eventComplete;
            };

            return this.load(fileList, options);
        }
    };

    /**
     * @method css
     * Load a css file and add it to the document
     * @param list {array|string} Array of the script files to load
     * @param complete {function} Called when the load of the whole list is complete
     * @param error {function} Called when a script load throw an error
     * @param progress {function} Called on the progress of each script load
     * @chainable
     */
    yespix.fn.css = function(fileList, complete, options) {

        var e = null;

        if (!fileList) return this;
        if (this.isString(fileList)) fileList = [fileList];
        if (this.isObject(complete)) {
            options = complete;
            complete = function() {};
        }

        options = options || {};
        options['complete'] = options['complete'] || complete || function() {};
        options['error'] = options['error'] || function() {};
        options['progress'] = options['progress'] || function() {};
        options['skip'] = options['skip'] || function() {};
        options['success'] = options['success'] || function() {};
        options['once'] = false;
        options['ordered'] = options['ordered'] || false;
        options['document'] = options['document'] || this.document || document;

        complete = options['complete'];
        var error = options['error'];

        if (!options['ordered']) {
            options['complete'] = function(e) {
                //console.log('addcss :: complete css, e.file = '+e.file);
                var s = document.createElement('link');
                s.type = 'text/css';
                s.rel = 'stylesheet';
                s.href = e.url;
                s.async = true;
                delete s.crossOrigin;
                document.getElementsByTagName('head')[0].appendChild(s);

                if ('sheet' in s) {
                    sheet = 'sheet';
                    cssRules = 'cssRules';
                } else {
                    sheet = 'styleSheet';
                    cssRules = 'rules';
                }

                var interval_id = setInterval(function() { // start checking whether the style sheet has successfully loaded
                        try {
                            //console.log('len = '+s[sheet][cssRules].length);
                            if (s[sheet] && s[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
                                clearInterval(interval_id); // clear the counters
                                clearTimeout(timeout_id);
                                //console.log('addcss :: load link success');
                                complete(e);
                            }
                        } catch (e) {} finally {}
                    }, 10), // how often to check if the stylesheet is loaded
                    timeout_id = setTimeout(function() { // start counting down till fail
                        clearInterval(interval_id); // clear the counters
                        clearTimeout(timeout_id);
                        //document.getElementsByTagName('head').removeChild(s); // since the style sheet didn't load, remove the link node from the DOM
                        error(e); // fire the callback with success == false
                    }, 30000); // how long to wait before failing
            };
            return this.load(fileList, options);
        } else {
            var token = 0;
            options['complete'] = function(e) {
                //						console.log('complete::: token ='+token+', url = '+fileList[token]);
                if (fileList[token] == e.url) {
                    //console.log('complete css '+e.file);
                    var s = document.createElement('link');
                    s.type = 'text/css';
                    s.rel = 'stylesheet';
                    s.href = e.url;
                    s.async = true;
                    delete s.crossOrigin;
                    document.getElementsByTagName('head')[0].appendChild(s);

                    if ('sheet' in s) {
                        sheet = 'sheet';
                        cssRules = 'cssRules';
                    } else {
                        sheet = 'styleSheet';
                        cssRules = 'rules';
                    }

                    var interval_id = setInterval(function() { // start checking whether the style sheet has successfully loaded
                            try {
                                if (s[sheet] && s[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
                                    clearInterval(interval_id); // clear the counters
                                    clearTimeout(timeout_id);
                                    complete(e);
                                    token++;
                                    while (fileList[token]) {
                                        if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
                                            eval(this.data.file[fileList[token]].content);
                                            complete(this.data.file[fileList[token]].eventComplete);
                                            token++;
                                        } else break;
                                    }
                                }
                            } catch (e) {} finally {}
                        }, 20), // how often to check if the stylesheet is loaded
                        timeout_id = setTimeout(function() { // start counting down till fail
                            clearInterval(interval_id); // clear the counters
                            clearTimeout(timeout_id);
                            document.getElementsByTagName('head').removeChild(s); // since the style sheet didn't load, remove the link node from the DOM
                            error(e); // fire the callback with success == false
                            token++;
                            while (fileList[token]) {
                                if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
                                    eval(this.data.file[fileList[token]].content);
                                    complete(this.data.file[fileList[token]].eventComplete);
                                    token++;
                                } else break;
                            }
                        }, 15000); // how long to wait before failing
                } else this.data.file[e.file].eventComplete = e;
            };

            return this.load(fileList, options);
        }

        return this.load(fileList, options);
    };

    /**
     ***********************************************************************************************************
     ***********************************************************************************************************
     * GENERAL
     */

    /*
     * Returns a random float number between min and max, included.
     * @method randFloat
     * @return {number} Float number
     */
    yespix.fn.randFloat = function(min, max) {
        return Math.random() * (max - min) + min;
    };

    /**
     * Returns a random integer between min and max, included. Each Integer have the same distribution.
     * @method randInt
     * @return {number} Integer number
     */
    yespix.fn.randInt = function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    /**
     * Returns a clone of the object. Clones with a one level property copy.
     * @method clone
     *
     */
    yespix.fn.clone = function(obj) {
        var temp = new obj.constructor();
        for (var n in obj)
            if (obj != obj[n]) temp[n] = obj[n];
        return temp;
    };

    /**
     * @method unique
     */
    yespix.fn.unique = function(arr) {
        var o = {},
            i,
            l = arr.length,
            r = [];
        for (i = 0; i < l; i++) o[arr[i]] = arr[i];
        for (i in o) r.push(o[i]);
        return r;
    };

    /**
     * @method getExtension
     */
    yespix.fn.getExtension = function(str) {
        var ext = str.split('.').pop();
        if (ext == str) return '';
        return ext;
    };

    /**
     * @method getFilename
     */
    yespix.fn.getFilename = function(str) {
        return str.split('/').pop();
    };

    /**
     * @method getDir
     */
    yespix.fn.getDir = function(str) {
        if (str.lastIndexOf("/") == -1) return '';
        return str.substring(0, str.lastIndexOf("/") + 1);
    };

    /**
     * @method getNoExtension
     */
    yespix.fn.getNoExtension = function(str) {
        var filename = this.getFilename(str);
        if (filename.lastIndexOf(".") == -1) return filename;
        return filename.substring(0, filename.lastIndexOf("."));
    };

    /**
     * @method isInt
     */
    yespix.fn.isInt = function(value) {
        if (this.isString(value)) return false;
        if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) return true;
        return false;
    };

    /**
     * @method isArray
     */
    yespix.fn.isArray = function(value) {
        return Object.prototype.toString.call(value) === "[object Array]";
    };

    /**
     * @method isBoolean
     */
    yespix.fn.isBoolean = function(value) {
        return typeof value == "boolean";
    };

    /**
     * @method isUndefined
     */
    yespix.fn.isUndefined = function(value) {
        return value === undefined || value === null;
    };

    /**
     * @method isString
     */
    yespix.fn.isString = function(value) {
        return typeof value == "string";
    };

    /**
     * @method isRegex
     */
    yespix.fn.isRegexp = function(value) {
        return (value instanceof RegExp);
    };

    /**
     * Trim string left and right
     * @param  {string} str String to trim
     * @return {string} Result string
     */
    yespix.fn.trim = function(str) {
        return str.replace(/^\s+|\s+$/g, '');
    };

    /**
     * Left trim string
     * @param  {string} str String to trim
     * @return {string} Result string
     */
    yespix.fn.ltrim = function(str) {
        return str.replace(/^\s+/, '');
    };

    /**
     * Right trim string
     * @param  {string} str String to trim
     * @return {string} Result string
     */
    yespix.fn.rtrim = function(str) {
        return str.replace(/\s+$/, '');
    };

    /**
     * Trim string left and right, merge multiple spaces into one space
     * @param  {string} str String to trim
     * @return {string} Result string
     */
    yespix.fn.xtrim = function(str) {
        return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
    };

    /**
     * Returns True if fn is a function
     * @method isFunction
     */
    yespix.fn.isFunction = function(fn) {
        return fn !== undefined && fn && {}.toString.call(fn) === "[object Function]";
    };

    /**
     * Returns True if obj is an object
     * @method isObject
     */
    yespix.fn.isObject = function(obj) {
        if (this.isString(obj) || this.isArray(obj)) return false;
        return obj !== null && typeof obj === "object";
    };

    /**
     * @method pLength
     */
    yespix.fn.pLength = function(object, owned) {
        owned = owned || true;
        var length = 0;
        for (var key in object)
            if (owned) {
                if (object.hasOwnProperty(key)) length++;
            } else length++;

        return length;
    };

    /**
     * @method getType
     */
    yespix.fn.getType = function(obj) {
        if (obj === null) return 'null';
        else if (this.isString(obj)) return 'string';
        else if (this.isArray(obj)) return 'array';
        else if (this.isObject(obj)) return 'object';
        return typeof obj;
    };

    /**
     * Check if the value is in the array
     * @param arr The array to check
     * @return {boolean} True if the value is in the array
     * @method inArray
     */
    yespix.fn.inArray = function(arr, value) {
        return (arr.indexOf(value) != -1);
    };

    yespix.fn.each = function(array, fn, args) {
        var i;

        if (!this.isArray(array)) array = [].slice.call(array);
        var length = array.length;
        args = args || [];
        if (length) {
            if (this.isFunction(fn)) {
                for (i in array) fn.apply(array[i], args);
            } else if (this.isString(fn)) {
                for (i in array)
                    if (array[i][fn] && this.isFunction(array[i][fn])) array[i][fn].apply(array[i], args);
            }
        }
        return this;
    };

    /**
     * @method dump
     */
    yespix.fn.dump = function(obj, string, properties, expand) {
        string = string || '';
        properties = properties || [];
        expand = expand || 9;

        console.group();
        console.info('Object dump: ' + string);

        var count = 1,
            str = '',
            t;
        for (var n in obj) {
            if (this.isObject(obj) && properties.length > 0 && !this.inArray(properties, n)) continue;

            if (obj[n] === null) console.log(' - ' + n + ' : null');
            else if (typeof obj[n] === 'undefined') console.log(' - ' + n + ' = undefined');
            else if (typeof obj[n] === 'boolean') console.log(' - ' + n + ' = "' + obj[n] + '" (boolean)');
            else if (typeof obj[n] === 'number') console.log(' - ' + n + ' = ' + obj[n] + ' (number)');
            else if (typeof obj[n] === 'function') console.log(' - ' + n + ' (function)');
            else if (this.isString(obj[n])) console.log(' - ' + n + ' = "' + obj[n] + '" (string)');
            else if (this.isArray(obj[n])) {
                str = '';
                if (expand)
                    for (t = 0; t < obj[n].length; t++) {
                        if (t > 0) str += ', ';
                        str += '[' + t + '] ';
                        if (obj[n][t] === null) str += 'null';
                        else if (typeof obj[n][t] === 'undefined') str += 'undefined';
                        else if (typeof obj[n][t] === 'boolean') str += '"' + obj[n][t] + '" (boolean)';
                        else if (typeof obj[n][t] === 'number') str += obj[n][t] + ' (number)';
                        else if (typeof obj[n][t] === 'string') str += '"' + obj[n][t] + '" (string)';
                        else if (typeof obj[n][t] === 'function') str += 'function';
                        else if (this.isArray(obj[n][t])) str += 'Array (' + obj[n][t].length + ')';
                        else str += obj[n][t];
                        if (t > expand) {
                            str += ' ...';
                            break;
                        }
                    }
                if (str === '') console.log(' - ' + n + ' (array), length ' + obj[n].length + '');
                else console.log(' - ' + n + ' (array), length ' + obj[n].length + ', content: ' + str);
            } else if (this.isObject(obj[n])) {
                str = '';
                t = 0;
                if (expand)
                    for (var f in obj[n]) {

                        if (properties.length > 0 && !this.inArray(properties, f)) continue;

                        if (t > 0) str += ', ';
                        str += '[' + t + '] ' + f + ': ';
                        if (obj[n][f] === null) str += 'null';
                        else if (typeof obj[n][f] === 'undefined') str += 'undefined';
                        else if (typeof obj[n][f] === 'boolean') str += '"' + obj[n][f] + '" (boolean)';
                        else if (typeof obj[n][f] === 'number') str += obj[n][f] + ' (number)';
                        else if (typeof obj[n][f] === 'string') str += '"' + obj[n][f] + '" (string)';
                        else if (typeof obj[n][f] === 'function') str += 'function';
                        else if (this.isArray(obj[n][f])) str += 'Array (' + obj[n][f].length + ')';
                        else str += obj[n][f];
                        if (t > expand) {
                            str += ' ...';
                            break;
                        }
                        t++;
                    }
                if (str === '') console.log(' - ' + n + ' (object), length ' + this.pLength(obj[n]) + '');
                else console.log(' - ' + n + ' (object), length ' + this.pLength(obj[n]) + ', content: ' + str);
            } else console.log(' - ' + n + ' : "' + obj[n] + '" (' + (typeof obj[n]) + ')');
        }
        console.groupEnd();
    };

    /**
     ***********************************************************************************************************
     ***********************************************************************************************************
     * YESPIX INIT
     */

    /**
     * Initialisation of the YESPIX engine
     * @method init
     */
    yespix.fn.init = function(options) {
        /**
         * Set to True when the YESPIX engine is initiated and ready to do stuff
         * @property isReady
         * @type boolean
         */
        this.isReady = false;

        /**
         * Array of entities to draw, basically all the entities with a gfx ancestor
         * @property {array} drawEntities
         * @type {Array}
         */
        this.drawEntities = [];

        /**
         * Set to true when a /gfx entity is spawned or removed
         * @type {Boolean}
         */
        this.drawEntitiesChange = false;

        this.collisionSize = 64;


        // initialisation of the ready event
        this.on('ready', function() {
            this.isReady = true;
            this.timerStart();
        });

        // current version of the engine
        this.version = "0.13.1";

        // initialise the data
        this.data = {

            // collision map of the entities
            collisionMap: {

            },

            // Stored informations about downloaded files
            file: {

            },

            // Element and media support
            support: {
                types: {
                    "audio": true,
                    "video": true,
                },
                extensions: {
                    ".3gp": 'audio/3gpp',
                    ".ac3": 'audio/wav',
                    ".avi": 'video/avi',
                    ".kar": 'audio/midi',
                    ".mid": 'audio/midi',
                    ".m4a": 'audio/x-m4a',
                    ".mov": 'video/quicktime',
                    ".mp3": 'audio/mpeg',
                    ".mp4": 'video/mp4',
                    ".mpa": 'audio/mpeg',
                    ".mpg": 'video/mpeg',
                    ".webm": 'video/webm',
                },
                audio: {},
                video: {},
                elements: {},
            },

            // browser support
            browser: {
                infos: {
                    name: null,
                    version: null,
                    os: null,
                    mobile: null,
                    initiated: false,
                },
                browserList: [{
                    subString: "Chrome",
                    identity: "Chrome"
                }, {
                    subString: "Firefox",
                    identity: "Firefox"
                }, {
                    subString: "Apple",
                    identity: "Safari",
                    version: "Version"
                }, {
                    subString: "MSIE",
                    identity: "IE",
                    version: "MSIE"
                }, {
                    subString: "Opera",
                    identity: "Opera",
                    version: "Version"
                }, {
                    subString: "OmniWeb",
                    identity: "OmniWeb",
                    version: "OmniWeb/"
                }, {
                    subString: "iCab",
                    identity: "iCab"
                }, {
                    subString: "KDE",
                    identity: "Konqueror"
                }, {
                    subString: "Camino",
                    identity: "Camino"
                }, {
                    subString: "Netscape",
                    identity: "Netscape"
                }, {
                    subString: "Gecko",
                    identity: "Mozilla",
                    version: "rv"
                }, {
                    subString: "Mozilla",
                    identity: "Netscape",
                    version: "Mozilla"
                }, ],
                osList: [{
                    subString: "Win",
                    identity: "Windows"
                }, {
                    subString: "Mac",
                    identity: "Mac"
                }, {
                    subString: "iPhone",
                    identity: "iPhone/iPod"
                }, {
                    subString: "Linux",
                    identity: "Linux"
                }, ],


            },

            key: {
                pressed: {

                },
                up: {

                },
                down: {

                },
                hold: {

                },
                special: {
                    backspace: 8,
                    tab: 9,
                    enter: 13,
                    shift: 16,
                    ctrl: 17,
                    alt: 18,
                    pause: 19,
                    capsLock: 20,
                    escape: 27,
                    pageUp: 33,
                    pageDown: 34,
                    end: 35,
                    home: 36,
                    left: 37,
                    up: 38,
                    right: 39,
                    down: 40,
                    insert: 45,
                    delete: 46,
                    leftWindowKey: 91,
                    rightWindowKey: 92,
                    selectKey: 93,
                    numpad0: 96,
                    numpad1: 97,
                    numpad2: 98,
                    numpad3: 99,
                    numpad4: 100,
                    numpad5: 101,
                    numpad6: 102,
                    numpad7: 103,
                    numpad8: 104,
                    numpad9: 105,
                    f1: 112,
                    f2: 113,
                    f3: 114,
                    f4: 115,
                    f5: 116,
                    f6: 117,
                    f7: 118,
                    f8: 119,
                    f9: 120,
                    f10: 121,
                    f11: 122,
                    f12: 123,
                    numLock: 144,
                    scrollLock: 145,
                }
            },
        };


        // initialisation of the options 
        options = options || {};
        options.namespace = options.namespace || 'yespix';
        options['dir_resources'] = options['dir_resources'] || '../resources/';
        options['dir_engine'] = options['dir_engine'] || '../engine/';
        options['ready'] = options['ready'] || function() {};
        options['init'] = options['init'] || function() {};
        options['collisionSize'] = options['collisionSize'] || 64;

        this.on('ready', options['ready']);

        // store the options
        this.options = options;

        // set document and window
        this.document = options["document"] || document;
        this.window = options["window"] || window;



        initEntities(this);


        this.options = options;

        this.window[options['namespace']] = this;

        var yespix = this;

        function start(options) {

            if (options['canvas']) yespix.spawn('canvas', options.canvas);
            if (options['fps']) yespix.setFps(options.fps);
            this.collisionSize = options['collisionSize'];

            if (yespix.isArray(yespix.entityInstances['/gfx'])) {
                this.drawEntities = yespix.entityInstances['/gfx'];
                this.drawEntities.sort(compare);
            } else this.drawEntities = [];

            yespix.on('spawn', function(e) {
                this.drawEntitiesChange = true;
            });

            yespix.on('remove', function(e) {
                this.drawEntitiesChange = true;
            });

            yespix.on("draw", function(e) {
                // sort by z and zGlobal
                function compare(a, b) {
                    if (a.z > b.z) return 1;
                    if (a.z === b.z && a.zGlobal > b.zGlobal) return 1;
                    return -1;
                }

                // change the drawEntities because some entity instances have been added or removed
                if (yespix.drawEntitiesChange) {
                    yespix.drawEntities = yespix.entityInstances['/gfx'];
                    if (yespix.drawEntities) yespix.drawEntities = yespix.drawEntities.sort(compare);
                    yespix.drawEntitiesChange = false;
                } else if (yespix.drawEntitiesSort) {
                    yespix.drawEntities = yespix.drawEntities.sort(compare);
                    yespix.drawEntitiesSort = false;
                }

                if (yespix.drawEntities)
                    for (var t = 0; t < yespix.drawEntities.length; t++) {
                        if (yespix.drawEntities[t] && yespix.drawEntities[t].draw) {
                            yespix.drawEntities[t].draw();
                        }
                    }

            });
            options['init']();
            yespix.trigger('ready');
        }

        start(options);



        // init functions for input keys 
        yespix.on('exitFrame', function(e) {
            // delete old keypressed
            /*
				if (this.data.key.pressed && this.data.key.pressed.old) delete this.data.key.pressed.old;
				if (this.data.key.up && this.data.key.up.old) delete this.data.key.up.old;
				if (this.data.key.down && this.data.key.down.old) delete this.data.key.down.old;
				*/
            // save current keypressed as old keypressed and delete current keypressed
            this.data.key.pressed = {
                //	old: this.data.key.pressed
            };
            this.data.key.up = {
                //	old: this.data.key.up
            };
            this.data.key.down = {
                //	old: this.data.key.down
            };
        });


        /**
         * Key down bindings
         * @param  {object} e Event
         * @todo use the yespix document and window instead of the main objects
         */
        document.onkeydown = function(e) {
            // get the event
            e = e || window.event;

            // get the key code
            e.code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;

            // main key pressed
            yespix.data.key.pressed[parseInt(e.code)] = true;
            yespix.data.key.hold[parseInt(e.code)] = true;

            // special key pressed
            if (e.ctrlKey) yespix.data.key.down[yespix.data.key.special['ctrl']] = true;
            else yespix.data.key.hold[yespix.data.key.special['ctrl']] = false;
            if (e.altKey) yespix.data.key.down[yespix.data.key.special['alt']] = true;
            else yespix.data.key.hold[yespix.data.key.special['alt']] = false;
            if (e.shiftKey) yespix.data.key.down[yespix.data.key.special['shift']] = true;
            else yespix.data.key.hold[yespix.data.key.special['shift']] = false;

            // triggers on YESPIX engine
            yespix.trigger(e.type, e);
            console.log('trigger ' + e.type);
            //return false;
        };

        /**
         * Key up bindings
         * @param  {object} e Event
         */
        document.onkeyup = function(e) {
            // get the event
            e = e || window.event;

            // get the key code
            e.code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;

            // main key pressed
            yespix.data.key.up[parseInt(e.code)] = true;
            yespix.data.key.hold[parseInt(e.code)] = false;

            // special key pressed
            if (e.ctrlKey) yespix.data.key.pressed[yespix.data.key.special['ctrl']] = true;
            else yespix.data.key.hold[yespix.data.key.special['ctrl']] = false;
            if (e.altKey) yespix.data.key.pressed[yespix.data.key.special['alt']] = true;
            else yespix.data.key.hold[yespix.data.key.special['alt']] = false;
            if (e.shiftKey) yespix.data.key.pressed[yespix.data.key.special['shift']] = true;
            else yespix.data.key.hold[yespix.data.key.special['shift']] = false;

            // triggers on YESPIX engine
            yespix.trigger(e.type, e);
            //return false;
        };

        /**
         * Key pressed bindings
         *
         * @param  {object} e Event
         */
        document.onkeypress = function(e) {
            // get the event
            e = e || window.event;

            // get the key code
            e.code = e.keyCode ? e.keyCode : e.which ? e.which : e.charCode;

            // main key pressed
            yespix.data.key.pressed[parseInt(e.code)] = true;

            // triggers on YESPIX engine
            yespix.trigger(e.type, e);
            //return false;
        };

        /**
         * blur
         */
        document.onblur = function(e) {
            //console.log('blur');
            yespix.data.key.pressed = {};
            yespix.data.key.hold = {};
            yespix.data.key.down = {};
            yespix.data.key.up = {};

            // triggers on YESPIX engine
            yespix.trigger(e.type, e);
        };




        return this;

    };

    /**
     ************************************************************************************************************
     * INPUT KEYBOARD AND MOUSE
     */


    /**
     * Returns True if some keys are pressed, hold, down or up for this frame. Note: the key arrays are reset every frame, only the "hold"
     * keys are kept until "keyup" event. Depending on the framerate, you will sometimes miss the "pressed", "up" and "down" True value. If you
     * want to trigger an event on a key, it's better to use yespix.on('keypress'), yespix.on('keydown'), yespix.on('keyup') or yespix.on('keyhold'). The operators
     * AND "-" and OR "|" can be used in the selector.
     * @param  {int|string} s The selector or the key code of the character. Selector can be special keys ("shift", "ctrl" ...), multiple keys separated
     *                        with operator AND "-" ("ctrl-a", "a-d-g") or operator OR "|" ("a|2", "g|h|j"). Operator AND "-" have the priority
     *                        over "|", meaning "a|b-c" will be parsed like "a" || ("b" && "c"). If looking for character "|" and "-", the characters
     *                        must be escaped if there is more than one character in the selector, like "\|" and "\-".
     * @param  {string} type "pressed" / "hold" / "down" / "up", default is "hold"
     * @return {boolean} Returns True on success
     * @example key("w") return true if the keys "w" is hold
     * @example key("ctrl-d") return true if the keys "control" and "d" are hold together
     * @example key("a-z-e-r") return true if the keys "a", "z", "e" and "r" are hold together
     * @example key("a|r") return true if the keys "a" OR "r" are hold
     * @example key("a", "up") return true if the key "a" is up for this frame
     * @example key("|", "pressed") return true if the key "|" is pressed for this frame
     * @example key("\-|\|") return true if the key "-" or "|" is hold
     * @example key("a|z-e|r") return true if the keys "a" || ("z" && "e") || "r" are hold
     * @example key("a-z|e-r") return true if the keys ("a" || "z") && ("e" || "r") are hold
     */
    yespix.fn.key = function(s, type) {
        var t;

        type = type || 'hold';
        //console.log('type = '+type);
        if (this.isString(s)) {
            if (s.indexOf('|') != -1 && s.charAt(s.indexOf('|') - 1) != '\\' && s.length > 1) {
                var arr = s.split('|', 2);
                for (t = 0; t < arr.length; t++)
                    if (this.key(arr[t], type)) return true;
                return false;
            }
            if (s.indexOf('-') != -1 && s.charAt(s.indexOf('-') - 1) != '\\' && s.length > 1) return this.key(s.split('-', 2), type);
            if (s.length > 1) return this.specialKey(s, type);
            if (type != 'pressed') s = s.toUpperCase();
            if (type == 'hold' && this.data.key['up'][s.charCodeAt(0)]) return true;
            return !!this.data.key[type][s.charCodeAt(0)];
        }

        if (this.isArray(s)) {
            for (t = 0; t < s.length; t++)
                if (!this.key(s[t], type)) return false;
            return true;
        }
        if (this.isInt(s)) {
            if (type == 'hold' && this.data.key['up'][s]) return true;
            return !!this.data.key[type][s];
        }
        return false;
    };

    yespix.fn.isKey = function(code, s) {
        if (s.length > 1) return this.data.key.special[s.toLowerCase()] == code;
        return (s.charCodeAt(0) == code || s.toUpperCase().charCodeAt(0) == code || s.toLowerCase().charCodeAt(0) == code);
    };

    yespix.fn.specialKey = function(s, type) {
        type = type || 'hold';
        if (type == 'hold' && this.data.key['up'][this.data.key.special[s.toLowerCase()]]) return true;
        return !!this.data.key[type][this.data.key.special[s.toLowerCase()]];
    };

    /**
     ************************************************************************************************************
     ************************************************************************************************************
     * SUPPORT
     */

    /**
     * Media support detection. The function support(type) return true if the requested audio or video is supported
     * by the current browser.
     * @method support
     * @example support('audio') detects if audio is supported
     * @example support('.mp3') detects if mp3 extension is supported, assuming ".mp3" file has an audio/mpeg mimetype
     * @example support('audio/wav') detects if mimetype audio/wav is supported
     * @example support('audio/ogg; codecs="vorbis"') detects if mimetype audio/ogg is supported with codec Vorbis.
     * Note: Some browsers are completely ignoring the codecs and always return True
     *
     */
    yespix.fn.support = function(type) {
        //console.log('yespix.support :: type='+type);
        if (!type) return null;
        var types = type.split('/');

        // type can be a media type or an extension
        if (types.length == 1) {
            // check if the type is a media type
            if (this.data.support.types[type]) {
                if (!this.data.support.elements[type]) {
                    this.data.support.elements[type] = document.createElement(type);
                }
                return !!this.data.support.elements[type].canPlayType;
            }
            // check if the type is an extension
            if (this.data.support.extensions[type]) {
                type = this.data.support.extensions[type];
                types = type.split('/');
            } else return null;
        }


        if (this.data.support[types[0]] !== undefined && this.data.support[types[0]][types[1]] !== undefined) return this.data.support[types[0]][types[1]];

        // create element if needed
        if (this.data.support.elements[types[0]] === undefined) {
            //console.log('type='+type+', types[0]='+types[0]+', types[1]='+types[1]);
            this.data.support.elements[types[0]] = document.createElement(types[0]);
            //		if ( !! this.data.support.elements[types[0]] == false) this.data.support.elements[types[0]] = false;
            if (this.data.support.elements[types[0]] === false) this.data.support.elements[types[0]] = false;
        }

        var e = this.data.support.elements[types[0]];
        //	if (!e || !! e.canPlayType == false) return false;
        if (!e || e.canPlayType === false) return false;

        var str = e.canPlayType(type);
        if (str.toLowerCase() == 'no' || str === '') this.data.support[types[0]][types[1]] = false;
        else this.data.support[types[0]][types[1]] = true;

        return this.data.support[types[0]][types[1]];
    };


    /**
     ************************************************************************************************************
     ************************************************************************************************************
     * BROWSERS SUPPORT
     */


    yespix.fn.isMobile = function() {
        if (!this.data.browser.initiated) this.browser();
        return this.data.browser.mobile;
    };

    yespix.fn.browser = function(type) {
        var yespix = this;

        if (!yespix.data.browser.initiated) {
            function findBrowser(str) {
                var data = yespix.data.browser.browserList;
                for (var i = 0; i < data.length; i++) {
                    if (str.indexOf(data[i].subString) != -1) {
                        yespix.data.browser.found = data[i];
                        return data[i].identity;
                    }
                }
            }

            function findOs(str) {
                var data = yespix.data.browser.osList;
                for (var i = 0; i < data.length; i++) {
                    if (str.indexOf(data[i].subString) != -1) {
                        yespix.data.browser.found = data[i];
                        return data[i].identity;
                    }
                }
            }

            function findVersion(str) {
                if (!yespix.data.browser.found) return;
                var find = yespix.data.browser.found.version || yespix.data.browser.infos.name;
                var index = str.indexOf(find);
                if (index == -1) return;
                return str.substring(index + find.length + 1).split(' ').shift();
            }

            function findMobile(str) {
                if (!yespix.data.browser.found) return;
                return /iPhone|iPod|Android|opera mini|blackberry|palm os|palm| Mobile|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|windows ce|opera mobi| smartphone;|;iemobile/i.test(str);
            }

            yespix.data.browser.infos.initiated = true;
            yespix.data.browser.infos.name = findBrowser(navigator.userAgent) || findBrowser(navigator.vendor) || "Unknown browser";
            yespix.data.browser.infos.version = findVersion(navigator.userAgent) || findVersion(navigator.appVersion) || "Unknown version";
            if (yespix.data.browser.infos.version != "Unknown version") {
                var version = yespix.data.browser.infos.version;
                yespix.data.browser.infos.versionMajor = parseInt(version);
                if (version.indexOf(".") != -1) yespix.data.browser.infos.versionMinor = version.substring(version.indexOf(".") + 1);
                else yespix.data.browser.infos.versionMinor = '';
            }
            yespix.data.browser.infos.os = findOs(navigator.platform) || findOs(navigator.userAgent) || "Unknown OS";
            yespix.data.browser.infos.mobile = findMobile(navigator.userAgent) || findMobile(navigator.platform) || false;
        }
        yespix.data.browser.initiated = true;

        if (type) return yespix.data.browser.infos[type];
        return yespix.data.browser.infos;
    };

    /**
     ************************************************************************************************************
     ************************************************************************************************************
     * TIMER, TICK and FPS
     */


    yespix.fn.frameIndex = 0; // frame
    yespix.fn.frameTime = 0;
    yespix.fn.frameMs = 1; // milliSecPerFrame
    yespix.fn.frameRequest = null; // onFrame
    yespix.fn.frameRequestId = null; // requestId
    yespix.fn.frameTick = null;
    yespix.fn.frameTickNext = (new Date()).getTime(); // nextGameTick

    yespix.fn.time = +new Date(); // currentTime
    yespix.fn.fps = 60;

    yespix.fn.timerStart = function() {
        // Init the requestAnimationFrame in this.frameRequest
        if (!this.frameRequest) this.frameRequest = (function() {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function(callback, element) {
                    return window.setInterval(callback, 1000 / this.fps);
                };
        })();

        //console.log('timer.start, onFrame = '+this.onFrame);

        this.frameMs = 1000 / this.fps;
        var yespix = this;
        this.frameTick = function() {
            yespix.timerStep();
            if (yespix.frameTick) yespix.frameRequest.call(window, yespix.frameTick);
        };

        // clear collision 
        this.collisionClear();

        this.frameTick();

        // trigger the timerStart event
        this.trigger("timerStart");
    };

    yespix.fn.timerResume = function() {
        // @todo
    };


    yespix.fn.timerStop = function() {
        // Cancel the setInterval
        clearInterval(this.frameRequestId);
        this.frameTick = null;

        // trigger the timerStop event
        this.trigger("timerStop");
    };

    yespix.fn.timerStep = function() {
        loops = 0;
        this.frameTime = +new Date();
        if (this.frameTime - this.frameTickNext > 60 * this.frameMs) {
            this.frameTickNext = this.frameTime - this.frameMs;
        }
        while (this.frameTime > this.frameTickNext) {
            this.frameIndex++;
            this.trigger("enterFrame", {
                frameIndex: this.frameIndex
            });

            this.collisionClear();
            //console.log('collision length = '+this.find('/collision').length);
            //				this.dump(this.find('/collision'), 'find(/collision)');
            var list = this.find('/collision');
            if (list.length > 0) list.collisionOccupy().collision();

            this.frameTickNext += this.frameMs;
            loops++;
        }
        if (loops) {
            this.trigger("draw", {
                frameIndex: this.frameIndex
            });
            this.trigger("exitFrame", {
                frameIndex: this.frameIndex
            });
        }
    };

    yespix.fn.currentFps = function() {

    };

    yespix.fn.getFps = function() {
        return this.fps;
    };

    yespix.fn.setFps = function(fps) {
        this.fps = fps;
        this.frameMs = 1000 / this.fps;
    };

    function initEntities(yespix) {

        yespix.define('actor', 'anim, move, collision', {

            isAttacking: false,
            isFalling: false,
            isJumping: false,
            isOnGround: false,

            actorMove: {},
            actorSpeed: 2,
            actorSpeedMin: 0.05,
            actorDirection: '',
            actorAnims: {},
            actorInit: function(options) {},
            init: function() {},

            applyFriction: function() {
                this.speedX *= (1 - this.moveFriction);
                this.speedY *= (1 - this.moveFriction);
                if (this.speedX < this.actorSpeedMin && this.speedX > -this.actorSpeedMin) this.speedX = 0;
                if (this.speedY < this.actorSpeedMin && this.speedY > -this.actorSpeedMin) this.speedY = 0;
            }
        });

        yespix.define('actor2w', 'actor', {
            actorMove: {
                'idle': true,

                'right': true,
                'left': true,

                'lookup': true,
                'lookdown': true,

                'walk': true,
                'run': true,

                'jump': true,
                'longjump': true,
                'doublejump': true,

                'crouch': true,
                'guard': true,

                'damage': true,
                'dead': true,

                'throw': true,
                'attack': true,
                'use': true,
                'default': 'idle',
            },

            actorSpeedJump: 1.1,
            actorGravity: true,
            actorDirection: 'right',

            actorAnims: {
                'idleright': 'idleright',
                'idleleft': 'idleleft',

                'walkright': 'walkright',
                'walkleft': 'walkleft',

                'lookup': 'lookup',
                'lookdown': 'lookdown',

                'lookup': 'lookup',
                'lookdown': 'lookdown',

                'attackleft': 'attackleft',
                'attackright': 'attackright',

                'jumpleft': 'jumpleft',
                'jumpright': 'jumpright',
                'airleft': 'airleft',
                'airright': 'airright',
                'landleft': 'landleft',
                'landright': 'landright',

                'left': 'left',
                'right': 'right',
            },

            actorInit: function(options) {},

            init: function() {},

            move: function() {
                this.speedX += this.accelX;
                this.speedY += this.accelY;

                this.applyFriction();
                this.applyGravity();

                if (yespix.level) yespix.level.collision(this);
                this.x += this.speedX;
                this.y += this.speedY;
            },

            applyGravity: function() {
                if (!yespix.gravity) return false;
                if (!this.isOnGround && yespix.gravity) {
                    //console.log('this.isOnGround = ' + this.isOnGround + ', apply gravity')
                    if (yespix.gravity.x) this.speedX += yespix.gravity.x / 20;
                    if (yespix.gravity.y) this.speedY += yespix.gravity.y / 20;
                }
            },

            applyFriction: function() {
                this.speedX *= (1 - this.moveFriction);
                this.speedY *= (1 - this.moveFriction);
                if (this.speedX < this.actorSpeedMin && this.speedX > -this.actorSpeedMin) this.speedX = 0;
                if (this.speedY < this.actorSpeedMin && this.speedY > -this.actorSpeedMin) this.speedY = 0;
                return true;
            },

        });

        yespix.define('actor4w', 'actor', {
            actorMove: {
                'idle': true,
                'up': true,
                'right': true,
                'down': true,
                'left': true,
                'walk': true,
                'run': true,
                'jump': true,
                'damage': true,
                'crouch': true,
                'guard': true,
                'dead': true,
                'throw': true,
                'attack': true,
                'use': true,
                'default': 'idle',
            },
            actorDirection: 'down',
            actorAnims: {
                'walkup': 'walkup',
                'walkright': 'walkright',
                'walkdown': 'walkdown',
                'walkleft': 'walkleft',

                'idleup': 'idleup',
                'idleright': 'idleright',
                'idledown': 'idledown',
                'idleleft': 'idleleft',

                'runup': 'runup',
                'runright': 'runright',
                'rundown': 'rundown',
                'runleft': 'runleft',
            },
            actorInit: function(options) {},
            init: function() {},
        });

        yespix.define('actor2w', 'actor', {
            actorMove: {
                'idle': true,

                'right': true,
                'left': true,

                'lookup': true,
                'lookdown': true,

                'walk': true,
                'run': true,

                'jump': true,
                'longjump': true,
                'doublejump': true,

                'crouch': true,
                'guard': true,

                'damage': true,
                'dead': true,

                'throw': true,
                'attack': true,
                'use': true,
                'default': 'idle',
            },

            actorSpeedJump: 1.1,
            actorGravity: true,
            actorDirection: 'right',

            actorAnims: {
                'idleright': 'idleright',
                'idleleft': 'idleleft',

                'walkright': 'walkright',
                'walkleft': 'walkleft',

                'lookup': 'lookup',
                'lookdown': 'lookdown',

                'lookup': 'lookup',
                'lookdown': 'lookdown',

                'attackleft': 'attackleft',
                'attackright': 'attackright',

                'jumpleft': 'jumpleft',
                'jumpright': 'jumpright',
                'airleft': 'airleft',
                'airright': 'airright',
                'landleft': 'landleft',
                'landright': 'landright',

                'left': 'left',
                'right': 'right',
            },

            actorInit: function(options) {},

            init: function() {},

            move: function() {
                this.speedX += this.accelX;
                this.speedY += this.accelY;

                this.applyFriction();
                this.applyGravity();

                if (yespix.level) yespix.level.collision(this);
                this.x += this.speedX;
                this.y += this.speedY;
            },

            applyGravity: function() {
                if (!yespix.gravity) return false;
                if (!this.isOnGround && yespix.gravity) {
                    //console.log('this.isOnGround = ' + this.isOnGround + ', apply gravity')
                    if (yespix.gravity.x) this.speedX += yespix.gravity.x / 20;
                    if (yespix.gravity.y) this.speedY += yespix.gravity.y / 20;
                }
            },

            applyFriction: function() {
                this.speedX *= (1 - this.moveFriction);
                this.speedY *= (1 - this.moveFriction);
                if (this.speedX < this.actorSpeedMin && this.speedX > -this.actorSpeedMin) this.speedX = 0;
                if (this.speedY < this.actorSpeedMin && this.speedY > -this.actorSpeedMin) this.speedY = 0;
                return true;
            },

        });


        yespix.define('anim', 'image', {
            animDefault: {
                width: 32, // default tile width
                height: 32, // default tile height
                name: '', // default animation name to run
                duration: 200,
            },

            animSelected: '',
            animFrame: 0,
            animSpeed: 1,
            animReady: false,
            animWait: false,
            animNext: '',

            init: function() {
                this.animInit();
                this.on('imageReady', function() {
                    this.animFramesInit();
                });
            },


            /**
             * Array of anim informations:
             * name: Name of the animation
             * imageIndex: Image index of the sprite
             * imageName: Image name of the sprite
             * image: Image reference
             * width: pixel width
             * height: pixel height
             * x: position X in the image
             * y: position Y in the image
             */
            anims: {},

            /**
             * When all anim frames are ready, animSetup will initiated the frames
             * @return {[type]} [description]
             */
            animFramesInit: function() {
                //console.log('animFramesInit');

                // check every animation
                for (var name in this.anims) {
                    var anim = this.anims[name];

                    //console.log('animFramesInit :: name = ' + name);

                    // only animation that is not ready
                    if (!anim.isReady) {
                        // init the ready variable
                        var ready = true;
                        if (anim.frames && anim.frames.length)
                            for (var t = 0; t < anim.frames.length; t++) {
                                var frame = anim.frames[t];
                                // console.log('animFramesInit :: frame '+t+', isReady = '+frame.isReady+', image = '+frame.image);
                                //if (frame.image) console.log('image.isReady = ' + frame.image.isReady);
                                if (frame.isReady) continue;
                                if (!frame.image || !frame.image.isReady) {
                                    frame.isReady = false;
                                    ready = false;
                                    break;
                                }
                            }

                        // If all the images are ready, we must complete the frame objects
                        if (ready) {
                            // animation is ready
                            anim.isReady = true;

                            var maxLine;

                            // maximum frame in one line
                            if (anim.frames && anim.frames.length)
                                for (var t = 0; t < anim.frames.length; t++) {
                                    var frame = anim.frames[t];

                                    // frame initiated and ready
                                    if (frame.isReady) continue;

                                    if (yespix.isUndefined(frame.index)) frame.index = t;
                                    if (yespix.isUndefined(frame.frameIndex)) frame.frameIndex = t;
                                    anim.from = anim.from || 0;

                                    // process maximum number of frames in one line for this frame and image. Each frame can have its own image
                                    // so we need to update this variable on each frame
                                    maxLine = Math.floor(frame.image.realWidth / frame.width) / this.pixelSize;

                                    console.log('maxLine = ' + maxLine);

                                    if (maxLine > 0) {
                                        frame.x = (anim.offsetX || 0) * this.pixelSize + (frame.frameIndex + anim.from % maxLine) * frame.width * this.pixelSize;
                                        frame.y = (anim.offsetY || 0) * this.pixelSize + Math.floor((frame.frameIndex + anim.from) / maxLine) * frame.height * this.pixelSize;
                                        frame.isReady = true;
                                        console.log('frame :: t=' + t + ', frameIndex=' + frame.frameIndex + ', from=' + anim.from + ', maxLine=' + maxLine + ', x=' + frame.x + ', y=' + frame.y);
                                    } //else console.log('frame :: t='+t+', frameIndex='+frame.frameIndex+', maxLine='+maxLine);
                                }
                            if (anim.extendsTo) {
                                for (var t = 0; t < anim.extendsTo.length; t++) {
                                    if (this.anims[anim.extendsTo[t]]) {
                                        this.anims[anim.extendsTo[t]].isReady = true;
                                        this.anims[anim.extendsTo[t]].length = anim.length;
                                        if (this.anims[anim.extendsTo[t]].frames) this.anims[anim.extendsTo[t]].oldFrames = yespix.clone(this.anims[anim.extendsTo[t]].frames);

                                        this.anims[anim.extendsTo[t]].frames = []; //anim.frames;
                                        for (var u = 0; u < anim.frames.length; u++) {
                                            this.anims[anim.extendsTo[t]].frames[u] = yespix.clone(anim.frames[u]);
                                            if (this.anims[anim.extendsTo[t]].flipX) this.anims[anim.extendsTo[t]].frames[u].flipX = !this.anims[anim.extendsTo[t]].frames[u].flipX;
                                            if (this.anims[anim.extendsTo[t]].flipY) this.anims[anim.extendsTo[t]].frames[u].flipY = !this.anims[anim.extendsTo[t]].frames[u].flipY;
                                            if (this.anims[anim.extendsTo[t]].oldFrames && this.anims[anim.extendsTo[t]].oldFrames[u]) {
                                                //                                              console.log('oldFrames '+u+' exists');
                                                for (var n in this.anims[anim.extendsTo[t]].oldFrames[u]) {
                                                    //                                                  console.log('copy property n='+n);
                                                    this.anims[anim.extendsTo[t]].frames[u][n] = this.anims[anim.extendsTo[t]].oldFrames[u][n];
                                                }
                                            }
                                        }
                                        delete this.anims[anim.extendsTo[t]].oldFrames;
                                    }
                                }
                            }
                        }
                    }
                }
            },

            animInit: function() {
                //console.log('animInit :: this.anims = ' + this.anims);

                for (var name in this.anims) {

                    var anim = this.anims[name];
                    //console.log('animInit :: anim name = ' + name);

                    // check if all images are ready
                    anim.name = name;
                    anim.isReady = false;

                    // init the default animation
                    if (anim.isDefault) {
                        this.animDefault['name'] = name;
                        if (!this.animSelected) this.animSelected = name;
                    }

                    //console.log('animInit :: anim.extendsFrom = ' + anim.extendsFrom);
                    if (anim.extendsFrom) {
                        if (this.anims[anim.extendsFrom]) {
                            if (!this.anims[anim.extendsFrom].extendsTo) this.anims[anim.extendsFrom].extendsTo = [name];
                            else this.anims[anim.extendsFrom].extendsTo.push(name);
                        } //else console.log('animInit :: anim.extendsFrom "' + anim.extendsFrom + '" does not exist');
                    } //else 

                    // "frames" is an array of frames
                    else if (yespix.isArray(anim['frames'])) {
                        // frames are already set
                        if (!anim.length) anim.length = anim['frames'].length;

                        for (var t = 0; t < anim.frames.length; t++) {
                            if (yespix.isInt(anim.frames[t])) {
                                var frame = {
                                    index: t,
                                    frameIndex: anim.frames[t],
                                    anim: name,
                                    duration: anim.duration || this.animDefault.duration,
                                    flipX: anim.flipX || false,
                                    flipY: anim.flipY || false,
                                    isReady: false,
                                    width: anim.width || this.animDefault.width,
                                    height: anim.height || this.animDefault.height,
                                };

                                if (!yespix.isUndefined(anim.imageIndex)) frame.image = this.image(anim.imageIndex);
                                if (!frame.image && !yespix.isUndefined(anim.imageName)) frame.image = this.image(anim.imageName);
                                if (yespix.isUndefined(frame.image)) frame.image = this.image(0);

                                anim.frames[t] = frame;
                            } else {
                                if (!yespix.isUndefined(anim.imageIndex)) anim.frames[t].image = this.image(anim.imageIndex);
                                if (!anim.frames[t].image && !yespix.isUndefined(anim.imageName)) anim.frames[t].image = this.image(anim.imageName);
                                if (yespix.isUndefined(anim.frames[t].image)) anim.frames[t].image = this.image(0);
                            }
                        }

                    } else
                    // "frames" is not set and must be initiated
                    {
                        if (!anim.length) anim.length = 1;
                        if (!anim.from) anim.from = 0;
                        anim['frames'] = [];

                        for (var t = 0; t < anim.length; t++) {
                            var frame = {
                                index: t,
                                frameIndex: t,
                                anim: name,
                                duration: anim.duration || this.animDefault.duration,
                                flipX: anim.flipX || false,
                                flipY: anim.flipY || false,
                                isReady: false,
                                width: anim.width || this.animDefault.width,
                                height: anim.height || this.animDefault.height,
                            };

                            if (!yespix.isUndefined(anim.imageIndex)) frame.image = this.image(anim.imageIndex);
                            if (!yespix.isUndefined(anim.imageName)) frame.image = this.image(anim.imageName);
                            if (yespix.isUndefined(frame.image)) frame.image = this.image(0);

                            anim['frames'].push(frame);
                        }
                    }
                }
                this.animFramesInit();
            },

            animPlay: function(name, speed, from) {
                if (this.animWait) return;
                if (!name) name = this.animDefault.name;
                if (this.animSelected == name) return this;
                if (!this.anims[name]) return null;

                from = from || 0;
                speed = speed || 1;
                var frame = this.anims[name].frames[from];
                if (!frame) return null;

                console.log('playing anim "' + name + '"');

                this.animSelected = name;
                this.animFrame = from;
                this.animSpeed = speed;
                this.animTime = +new Date() + frame.duration * speed;

                this.trigger('animStart', {
                    name: this.animSelected,
                    frame: this.animFrame
                });
                this.trigger('animFrame', {
                    name: this.animSelected,
                    frame: this.animFrame
                });

                return this;
            },

            animStop: function() {
                //this.
            },

            animStep: function() {
                if (!this.anims[this.animSelected] || !this.anims[this.animSelected].frames) return;

                var animEnded = false;
                var now = +new Date();

                if (!this.animTime || isNaN(this.animTime)) this.animTime = now;

                if (!this.animTime || this.animTime <= now) {
                    this.animFrame++;

                    //console.log('animFrame = '+this.animFrame+', frames.length = '+this.anims[this.animSelected].frames.length);
                    if (this.animFrame >= this.anims[this.animSelected].frames.length) {
                        this.animFrame = 0;
                        animEnded = true;
                    }

                    this.trigger('animFrame', {
                        name: this.animSelected,
                        frame: this.animFrame
                    });

                    var frame = this.anims[this.animSelected].frames[this.animFrame];
                    this.animTime = +new Date() + frame.duration * this.animSpeed;
                    if (animEnded) {
                        this.trigger('animEnd', {
                            name: this.animSelected,
                            frame: this.animFrame
                        });
                        this.animWait = false;
                        if (this.animNext && this.animNext != '') {
                            console.log('animNext = ' + this.animNext);
                            this.animPlay(this.animNext);
                        }
                    }
                }
            },


            draw: function(context) {

                this.animStep();
                if (!this.anims[this.animSelected]) this.animSelected = this.animDefault['name'];
                if (!this.anims[this.animSelected]) return;

                if (!this.isVisible) return;


                if (!context) {
                    if (!this._context) {
                        this.getContext();
                        if (this._context) context = this._context;
                    } else context = this._context;
                }

                //console.log('context = '+context+', element = '+this.image(this.imageSelected).element+', src = '+this.image(this.imageSelected).element.src);
                var frame = this.anims[this.animSelected].frames[this.animFrame];
                var img = frame.image;

                var scaleX = frame.flipX ? -1 : 1;
                var scaleY = frame.flipY ? -1 : 1;

                if (this.snapToPixel) {
                    var canvasX = parseInt(this.x * scaleX - frame.flipX * frame.width * this.pixelSize);
                    var canvasY = parseInt(this.y * scaleY - frame.flipY * frame.height * this.pixelSize);
                } else {
                    var canvasX = this.x * scaleX - frame.flipX * frame.width * this.pixelSize;
                    var canvasY = this.y * scaleY - frame.flipY * frame.height * this.pixelSize;
                }
                var x = frame.x;
                var y = frame.y;

                if (context && img && img.element && img.isReady) {

                    if (frame.flipX || frame.flipY) {
                        context.save();
                        context.scale(scaleX, scaleY);
                    }
                    context.globalAlpha = this.alpha;
                    if (this.isJumping) console.log('draw :: frame = ' + this.animFrame + ', animSelected = ' + this.animSelected + ', x = ' + x + ', y = ' + y + ', width = ' + frame.width + ', height = ' + frame.height + ', canvasX = ' + canvasX + ', canvasY = ' + canvasY);
                    context.drawImage(img.element, //image element
                        x, // x position on image
                        y, // y position on image
                        frame.width * this.pixelSize, // width on image
                        frame.height * this.pixelSize, // height on image
                        canvasX, // x position on canvas
                        canvasY, // y position on canvas
                        frame.width * this.pixelSize, // width on canvas
                        frame.height * this.pixelSize // height on canvas
                    );
                    if (this.debug) {
                        context.globalAlpha = 1;
                        context.lineWidth = 0.5;
                        context.strokeStyle = "#ff1111";
                        context.strokeRect(canvasX - 0.5 * scaleX, canvasY - 0.5 * scaleY, frame.width * this.pixelSize + 1 * scaleX, frame.height * this.pixelSize + 1 * scaleY);
                    }
                    if (frame.flipX || frame.flipY) {
                        context.restore();
                    }
                    if (this.debug) {
                        context.globalAlpha = 1;
                        context.fillStyle = '#999999';
                        context.font = "10px sans-serif";
                        context.fillText("Anim: " + this.animSelected + ' / ' + this.animFrame, parseInt(this.x), parseInt(this.y - 5));

                        if (this.collisionBox) {
                            var box = this.collisionBox();
                            context.lineWidth = 0.5;
                            context.strokeStyle = "#000099";
                            context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width + 1 * scaleX, box.height + 1 * scaleY);
                        }
                    }
                }
            },

        });

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

        yespix.define('canvas', {
            canvasOptions: null,
            element: null,
            context: null,
            document: null,

            init: function(options) {
                this.create(options);
            },

            create: function(options) {
                options = options || {};
                options.document = options.document || yespix.document;
                options.width = options.width || 800; // @todo default must be set to client width
                options.height = options.height || 600; // @todo default must be set to client height
                options.style = options.style || {};
                options.id = options.id || 'canvas' + this._id;
                options.class = options.class || '';
                options.autoAppend = options.autoAppend || true;

                this.canvasOptions = options;
                this.document = options.document;

                var canvas = this.document.createElement('canvas');
                canvas.id = options.id;
                canvas.width = options.width;
                canvas.height = options.height;
                canvas.className = options.className;
                for (var n in options.style) canvas.style[n] = options.style[n];

                if (options.autoAppend) {
                    var body = this.document.getElementsByTagName("body")[0];
                    body.appendChild(canvas);
                }

                this.use(canvas, options);
            },

            use: function(canvasElement, options) {
                options = options || {};
                options.backgroundColor = options.backgroundColor || '#ffffff';
                options.clearOnEnterFrame = options.clearOnEnterFrame || true;

                this.element = canvasElement;
                this.context = this.element.getContext('2d');

                var canvas = this;

                if (options.clearOnEnterFrame) yespix.on('enterFrame', function() {
                    canvas.clear();
                });
            },

            clear: function() {
                //			this.context.clearRect(0,0,this.element.width, this.element.height);
                if (this.element) this.element.width = this.element.width;
            },
        });


        yespix.define('scene', {
            sceneOptions: null,
            document: null,

            init: function(options) {
                this.create(options);
            },

            create: function(options) {
                options = options || {};
                options.document = options.document || yespix.document;

                this.sceneOptions = options;
            },

        });



        yespix.define('move', {
            speedX: 0,
            speedY: 0,
            accelX: 0,
            accelY: 0,
            moveFriction: 0.05,

            moveStop: function() {
                this.speedX = this.speedY = this.accelX = this.accelY = 0;
            },


            init: function() {
                yespix.on('enterFrame', this.move, this, yespix);
            },

            move: function() {
                if (this.applyGravity && yespix.gravity) this.applyGravity();
                this.speedX += this.accelX;
                this.speedY += this.accelY;
                this.speedX *= 1 - this.moveFriction;
                this.speedY *= 1 - this.moveFriction;
                if (yespix.level) yespix.level.collision(this);
                this.x += this.speedX;
                this.y += this.speedY;
            },

            applyGravity: function() {
                /*
				if (!this.isOnGround && yespix.gravity) {
					console.log('this.isOnGround = '+this.isOnGround+', apply gravity')
					if (yespix.gravity.x) this.accelX += yespix.gravity.x / 20;
					if (yespix.gravity.y) this.accelY += yespix.gravity.y / 20;
				}
				*/
            },

        });

        yespix.define('collision', {

            colOffsetX: 0,
            colOffsetY: 0,

            colType: 'all', // "all" / "passive" / "active" / "none"
            colClass: [],

            init: function() {
                if (yespix.isUndefined(this.colWidth)) this.colWidth = this.width;
                if (yespix.isUndefined(this.colHeight)) this.colHeight = this.height;
            },

            collisionWith: function(entity) {
                if (this.colClass.length == 0) return true;
                if (entity.typeof(this.colClass)) return true;
                return false;
            },

            collisionBox: function() {
                if (yespix.isUndefined(this.pixelSize)) {
                    return {
                        x: this.x + this.colOffsetX,
                        y: this.y + this.colOffsetY,
                        width: this.colWidth,
                        height: this.colHeight,
                        offsetX: this.colOffsetX,
                        offsetY: this.colOffsetY,
                    };
                } else {
                    return {
                        x: this.x + this.colOffsetX * this.pixelSize,
                        y: this.y + this.colOffsetY * this.pixelSize,
                        width: this.colWidth * this.pixelSize,
                        height: this.colHeight * this.pixelSize,
                        offsetX: this.colOffsetX * this.pixelSize,
                        offsetY: this.colOffsetY * this.pixelSize,
                    };
                }
            },

            collision: function() {
                if (this.colType == 'all' || this.colType == 'active') yespix.collision(this);
            },

            collisionOccupy: function() {
                if (this.colType != 'none') yespix.collisionOccupy(this);
            },

            over: function(entity) {
                if (!this.intersect(entity)) return false;
                if (this.z > entity.z) return true;
                if (this.z == entity.z && this.globalZ > entity.globalZ) return true;
                return false;
            },

            under: function() {
                if (!this.intersect(entity)) return false;
                if (this.z < entity.z) return true;
                if (this.z == entity.z && this.globalZ < entity.globalZ) return true;
                return false;
            },

            touch: function(entity) {
                return yespix.collisionTouch(this, entity);
            },

            intersect: function(entity) {
                return yespix.collisionCheck(this, entity);
            },

            inside: function(entity) {
                return yespix.collisionInside(this, entity);
            },

            drawDebugCollision: function(context, drawBox) {
                console.log('drawDebugCollision');
                if (this.collisionBox) {
                    var box = drawBox || this.collisionBox();
                    context.globalAlpha = 1;
                    context.lineWidth = 0.5;
                    context.strokeStyle = "#000099";
                    if (yespix.isUndefined()) {
                        context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width + 1 * scaleX, box.height + 1 * scaleY);
                    } else {
                        context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width * this.pixelSize + 1 * scaleX, box.height * this.pixelSize + 1 * scaleY);
                    }
                }
            }


        });

        /**
         * @class entity.gfx
         */
        yespix.define('gfx', {
            _changed: false,

            isReady: false,
            isVisible: true,
            snapToPixel: false,

            x: 0,
            y: 0,
            z: 0,
            zGlobal: 0,
            alpha: 1,
            rotation: 0,

            _flipX: false,
            _flipY: false,

            ///////////////////////////////// Main functions ////////////////////////////////

            asset: function() {
                return [];
            },

            // initilize object
            init: function() {

                yespix.listen(this, ['z', 'zGlobal'], function(obj, e) {
                    yespix.drawEntitiesSort = true;
                });

                return true;
            },

            getDrawBox: function() {
                if (this.snapToPixel) {
                    var x = parseInt(this.x);
                    var y = parseInt(this.y);
                } else {
                    var x = this.x;
                    var y = this.y;
                }
                var width = this.width;
                var height = this.height;

                if (this.typeof('image')) {
                    var img = this.image(this.imageSelected);
                    width = this.width || img.width || img.realWidth;
                    height = this.height || img.height || img.realHeight;
                } else if (this.typeof('anim')) {
                    var img = this.image(this.imageSelected);
                    width = this.width || img.width || img.realWidth;
                    height = this.height || img.height || img.realHeight;
                }

                return {
                    x: x,
                    y: y,
                    width: width,
                    height: height
                };
            },

            getContext: function() {
                if (this._context) return this._context;
                if (this._parent == null) {
                    var canvas = yespix.find('.canvas')[0];
                    if (!this._context && canvas) this._context = canvas.context;
                }
                return this._context;
            },

            drawDebug: function(context, box) {
                if (yespix.isFunction(this.drawDebugPosition)) this.drawDebugPosition(context, box);
                if (yespix.isFunction(this.drawDebugImage)) this.drawDebugImage(context, box);
                if (yespix.isFunction(this.drawDebugCollision)) this.drawDebugCollision(context, box);
                if (yespix.isFunction(this.drawDebugMove)) this.drawDebugMove(context, box);
            },

            drawDebugPosition: function(context, drawBox) {
                var box = drawBox || this.getDrawBox();
                context.globalAlpha = 1;
                context.lineWidth = 0.5;
                context.strokeStyle = "#ff1111";
                context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width + 1 * scaleX, box.height + 1 * scaleY);
            },

        });

        yespix.define('image', 'gfx', {
            isVisible: true,

            // images
            images: [],

            imageSelected: 0,

            imageDefaults: {
                isInitiated: false, // true if imageInit() was called
                isReady: false,
                src: '',
                element: null,
                document: yespix.document,
            },

            init: function() {
                var entity = this,
                    count = 1;

                if (!this.pixelSize) this.pixelSize = 1;

                if (yespix.isString(this.images)) this.images = [{
                    src: this.images
                }];

                for (var t = 0; t < this.images.length; t++) {
                    // if the array element is a string, it's the src of the image
                    if (yespix.isString(this.images[t])) this.images[t] = {
                        src: this.images[t],
                    };

                    // init the default properties
                    for (var n in this.imageDefaults) {
                        this.images[t][n] = this.images[t][n] || this.imageDefaults[n];
                    }
                    if (this.images[t].name === '') this.images[t].name = 'image' + count++;
                }

                this.imageInit();
            },

            resize: function(img, scale) {
                // Takes an image and a scaling factor and returns the scaled image
                // The original image is drawn into an offscreen canvas of the same size
                // and copied, pixel by pixel into another offscreen canvas with the 
                // new size.

                var widthScaled = img.width * scale;
                var heightScaled = img.height * scale;

                var orig = document.createElement('canvas');
                orig.width = img.width;
                orig.height = img.height;
                var origCtx = orig.getContext('2d');
                origCtx.drawImage(img, 0, 0);
                var origPixels = origCtx.getImageData(0, 0, img.width, img.height);

                var scaled = document.createElement('canvas');
                scaled.width = widthScaled;
                scaled.height = heightScaled;
                var scaledCtx = scaled.getContext('2d');
                var scaledPixels = scaledCtx.getImageData(0, 0, widthScaled, heightScaled);

                for (var y = 0; y < heightScaled; y++) {
                    for (var x = 0; x < widthScaled; x++) {
                        var index = (Math.floor(y / scale) * img.width + Math.floor(x / scale)) * 4;
                        var indexScaled = (y * widthScaled + x) * 4;
                        scaledPixels.data[indexScaled] = origPixels.data[index];
                        scaledPixels.data[indexScaled + 1] = origPixels.data[index + 1];
                        scaledPixels.data[indexScaled + 2] = origPixels.data[index + 2];
                        scaledPixels.data[indexScaled + 3] = origPixels.data[index + 3];
                    }
                }
                scaledCtx.putImageData(scaledPixels, 0, 0);
                return scaled;
            },

            image: function(properties) {
                //console.log('image :: properties = '+properties);

                if (properties == undefined)
                    if (this.images[0]) return this.imageInit(this.images[0]);
                    else return null;
                if (typeof properties == 'string') properties = {
                    name: properties
                };
                else if (yespix.isInt(properties))
                    if (this.images[properties]) return this.imageInit(this.images[properties]);
                    else return null;

                var max = Object.keys(properties).length;
                var count = 0;
                for (var t = 0; t < this.images.length; t++) {
                    //console.log('checking image ['+t+'] with name "'+this.images[t].name+'"');
                    for (var n in properties) {
                        if (this.images[t][n] !== undefined && properties[n] == this.images[t][n]) count++;
                        //console.log('property "'+n+'", max = '+max+', count = '+count);
                        if (count >= max) return this.imageInit(this.images[t]);
                    }
                }
                return null;
            },

            imageInit: function(image) {
                var entity = this;

                // no image, init all the images
                if (image == undefined) {
                    for (var t = 0; t < this.images.length; t++) {
                        this.imageInit(this.images[t]);
                    }
                    return true;
                }

                // image already initiated
                if (image.isInitiated) return image;

                image.isReady = false;
                image.isInitiated = true;
                image.entity = entity;
                image.element = document.createElement('img');
                //console.log('createElement :: imageSelected = '+entity.imageSelected+', src = '+image.src+', image.element = '+image.element);

                if (image.element) image.element.onload = image.element.onLoad = function() {
                    //console.log('image.onlad :: imageSelected = '+entity.imageSelected+', src = '+image.src+', image.element = '+image.element);
                    image.realWidth = this.width;
                    image.realHeight = this.height;
                    image.isReady = true;

                    if (!yespix.isUndefined(entity.pixelSize) && entity.pixelSize != 1) {
                        image.element = entity.resize(image.element, entity.pixelSize);
                        image.realWidth = this.width * entity.pixelSize;
                        image.realHeight = this.height * entity.pixelSize;

                        //console.log('image resized');
                        //yespix.call(entity, 'draw', 'gfx');
                        //yespix.error();
                    }
                    //yespix.timerStop();

                    entity.trigger('imageReady', {
                        target: image,
                    });

                    delete this.onload;
                };

                // add source to the image element
                image.changeSource = function(source) {
                    this.element.src = source;
                    entity.trigger('change');
                    return true;
                };

                if (image.src !== undefined && image.src !== '') {
                    image.changeSource(image.src);
                }


                return image; //source != '';
            },

            draw: function(context) {
                if (!this.isVisible) return;

                if (!context) {
                    if (!this._context) {
                        this.getContext();
                        if (this._context) context = this._context;
                    } else context = this._context;
                }

                //console.log('context = '+context+', element = '+this.image(this.imageSelected).element+', src = '+this.image(this.imageSelected).element.src);
                var img = this.image(this.imageSelected);
                var box = this.getDrawBox();
                var scaleX = this.flipX ? -1 : 1;
                var scaleY = this.flipY ? -1 : 1;

                if (context && img && img.element && img.isReady) {
                    context.globalAlpha = this.alpha;
                    context.drawImage(img.element, //image element
                        0, // x position on image
                        0, // y position on image
                        img.realWidth, // width on image
                        img.realHeight, // height on image
                        box.x, // x position on canvas
                        box.y, // y position on canvas
                        box.width, // width on canvas
                        box.height // height on canvas
                    );
                    if (this.debug) {
                        this.drawDebug(context, box);
                    }
                }
            },

            drawDebugImage: function(context, drawBox) {
                var box = drawBox || this.getDrawBox();
                context.globalAlpha = 1;
                context.fillStyle = '#999999';
                context.font = "10px sans-serif";
                context.fillText("Image: " + this.imageSelected, box.x, box.y - 5);
            }

        });

        /**
         ************************************************************************************************************
         ************************************************************************************************************
         * Level
         *
         */

        yespix.define('level', 'gfx', {
            data: {},

            isVisible: true,

            isReady: false,

            layers: [],

            canvas: null,
            context: null,


            block: function(x, y) {
                var index = y * this.data.width + x;
                var tileIndex = this.data.layers[0].data[index];
                //console.log('block :: index = ' + index + ', tileIndex = ' + tileIndex);
                if (tileIndex > 1) return true;
                return false;
            },

            hit: function(cellX, cellY, direction, speed) {
                return true;
            },

            collisionRight: function(entity, box, cellX, cellY) {
                this.hit(cellX, cellY, 'right', entity.speedX);
                entity.x = this.x + cellX * this.data.tilewidth - 0.0001 - box.offsetX - box.width;
                entity.speedX = 0;
            },

            collisionLeft: function(entity, box, cellX, cellY) {
                this.hit(cellX, cellY, 'left', entity.speedX);
                entity.x = this.x + (cellX + 1) * this.data.tilewidth + 0.0001 - box.offsetX;
                entity.speedX = 0;
            },

            collisionUp: function(entity, box, cellX, cellY) {
                this.hit(cellX, cellY, 'up', entity.speedY);
                var posY = this.y + (cellY + 1) * this.data.tileheight + 1 - box.offsetY;
                entity.y = posY;
                entity.speedY = 0;
            },

            collisionDown: function(entity, box, cellX, cellY) {
                this.hit(cellX, cellY, 'down', entity.speedY);
                entity.y = this.y + (cellY) * this.data.tileheight - box.offsetY - box.height - 1;
                entity.speedY = 0;
                entity.isOnGround = true;
                entity.isJumping = false;
                entity.isFalling = false;
                this.accelY = 0;
            },

            collision: function(entity) {
                if (entity.speedX == 0 && entity.speedY == 0) return;

                var left = false,
                    right = false,
                    up = false,
                    down = false;

                //console.log('level.collision :: #1 speedX = ' + entity.speedX + ', speedY = ' + entity.speedY);

                var box = entity.collisionBox();


                if (entity.speedX > 0) {
                    // check every collision on the right
                    var cellRight = Math.floor((box.x + box.width) / this.data.tilewidth);

                    // cellNext is the final cell on the right of the entity
                    var cellNext = Math.floor((box.x + box.width + entity.speedX) / this.data.tilewidth);

                    if (cellNext > cellRight) {

                        right = true;

                        var cellTop = Math.floor(box.y / this.data.tileheight);
                        var cellBottom = Math.floor((box.y + box.height) / this.data.tileheight);
                        var stopped = false;
                        for (var x = cellRight; x <= cellNext; x++) {
                            for (var y = cellTop; y <= cellBottom; y++) {
                                if (this.block(x, y)) {
                                    this.collisionRight(entity, box, x, y);
                                    //var posX = this.x + (x) * this.data.tilewidth - 0.0001 - box.offsetX - box.width;
                                    //entity.x = posX;
                                    //entity.speedX = 0;
                                    stopped = true;
                                    break;
                                }
                            }
                            if (stopped) break;
                        }
                    }
                } else if (entity.speedX < 0) {
                    // check every collision on the left
                    var cellLeft = Math.floor(box.x / this.data.tilewidth);

                    // cellNext is the final cell on the left of the entity
                    var cellNext = Math.floor((box.x + entity.speedX) / this.data.tilewidth);

                    //console.log('cellLeft = '+cellLeft+', cellNext = '+cellNext);

                    if (cellNext < cellLeft) {

                        left = true;

                        var cellTop = Math.floor(box.y / this.data.tileheight);
                        var cellBottom = Math.floor((box.y + box.height) / this.data.tileheight);
                        var stopped = false;
                        for (var x = cellLeft; x >= cellNext; x--) {
                            for (var y = cellTop; y <= cellBottom; y++) {
                                if (this.block(x, y)) {
                                    this.collisionLeft(entity, box, x, y);
                                    /*var posX = this.x + (x + 1) * this.data.tilewidth + 0.0001 - box.offsetX;
									entity.x = posX;
									entity.speedX = 0;*/
                                    stopped = true;
                                    break;
                                }
                            }
                            if (stopped) break;
                        }
                    }
                }

                if (entity.speedY > 0) {
                    // check every collision on the bottom
                    var cellBottom = Math.floor((box.y + box.height) / this.data.tileheight);

                    // cellNext is the final cell on the right of the entity
                    var cellNext = Math.floor((box.y + box.height + entity.speedY) / this.data.tileheight);

                    //console.log('cellBottom = '+cellBottom+', cellNext = '+cellNext);

                    if (cellNext > cellBottom) {

                        down = true;

                        var cellLeft = Math.floor(box.x / this.data.tilewidth);
                        var cellRight = Math.floor((box.x + box.width) / this.data.tilewidth);
                        var stopped = false;
                        for (var y = cellBottom; y <= cellNext; y++) {
                            for (var x = cellLeft; x <= cellRight; x++) {
                                if (this.block(x, y)) {
                                    this.collisionDown(entity, box, x, y);
                                    /*
									var posY = this.y + (y) * this.data.tileheight - box.offsetY - box.height - 1;
									//console.log('block :: x = '+x+', y = '+y+', poxY = '+posY);
									console.log('entity posY from ' + entity.y + ' to ' + posY);
									entity.y = posY;
									entity.speedY = 0;
									entity.isOnGround = true;
									entity.isJumping = false;
									entity.isFalling = false;
									this.accelY = 0;*/
                                    stopped = true;
                                    break;
                                }
                            }
                            if (stopped) break;
                        }
                    }
                } else if (entity.speedY < 0) {
                    // check every collision on the bottom
                    var cellTop = Math.floor(box.y / this.data.tileheight);

                    // cellNext is the final cell on the right of the entity
                    var cellNext = Math.floor((box.y + entity.speedY) / this.data.tileheight);

                    //console.log('cellTop = ' + cellTop + ', cellNext = ' + cellNext);

                    if (cellNext < cellTop) {

                        up = true;

                        var cellLeft = Math.floor(box.x / this.data.tilewidth);
                        var cellRight = Math.floor((box.x + box.width) / this.data.tilewidth);
                        var stopped = false;
                        for (var y = cellTop; y >= cellNext; y--) {
                            for (var x = cellLeft; x <= cellRight; x++) {
                                //console.log('level.collision :: x=' + x + ', y=' + y + ', block=' + this.block(x, y));
                                if (this.block(x, y)) {
                                    this.collisionUp(entity, box, x, y);
                                    /*
									var posY = this.y + (y + 1) * this.data.tileheight + 1 - box.offsetY;
									console.log('entity posY from ' + entity.y + ' to ' + posY);
									entity.y = posY;
									entity.speedY = 0;
									*/
                                    stopped = true;
                                    break;
                                }
                            }
                            if (stopped) break;
                        }
                    }
                }

                if (!up && !right && entity.speedX > 0 && entity.speedY < 0) {
                    var cellRight = Math.floor((box.x + box.width + entity.speedX) / this.data.tilewidth);
                    var cellTop = Math.floor((box.y + entity.speedY) / this.data.tileheight);
                    if (this.block(cellRight, cellTop)) {
                        console.log('Double collision right top');
                        this.collisionUp(entity, box, cellRight, cellTop);
                        this.collisionRight(entity, box, cellRight, cellTop);
                    }
                } else if (!down && !right && entity.speedX > 0 && entity.speedY > 0) {
                    var cellRight = Math.floor((box.x + box.width + entity.speedX) / this.data.tilewidth);
                    var cellBottom = Math.floor((box.y + box.height + entity.speedY) / this.data.tileheight);
                    if (this.block(cellRight, cellBottom)) {
                        console.log('Double collision right down');
                        this.collisionDown(entity, box, cellRight, cellBottom);
                        this.collisionRight(entity, box, cellRight, cellBottom);
                    }
                } else if (!down && !left && entity.speedX < 0 && entity.speedY > 0) {
                    var cellLeft = Math.floor((box.x + entity.speedX) / this.data.tilewidth);
                    var cellBottom = Math.floor((box.y + box.height + entity.speedY) / this.data.tileheight);
                    if (this.block(cellLeft, cellBottom)) {
                        console.log('Double collision left down');
                        this.collisionDown(entity, box, cellLeft, cellBottom);
                        this.collisionLeft(entity, box, cellLeft, cellBottom);
                    }
                } else if (!up && !left && entity.speedX < 0 && entity.speedY < 0) {
                    var cellLeft = Math.floor((box.x + entity.speedX) / this.data.tilewidth);
                    var cellTop = Math.floor((box.y + entity.speedY) / this.data.tileheight);
                    if (this.block(cellLeft, cellTop)) {
                        console.log('Double collision left up');
                        this.collisionUp(entity, box, cellLeft, cellTop);
                        this.collisionLeft(entity, box, cellLeft, cellTop);
                    }
                }

                if (entity.speedY == 0) {
                    // check if the entity is on ground
                    var cellBottom = Math.floor((box.y + box.height) / this.data.tileheight);
                    var cellNext = Math.floor((box.y + box.height + 1) / this.data.tileheight);
                    if (cellNext == cellBottom) {
                        entity.isOnGround = false;
                        //console.log('entity NOT on ground');
                    } else {
                        entity.isOnGround = false;
                        var cellLeft = Math.floor(box.x / this.data.tilewidth);
                        var cellRight = Math.floor((box.x + box.width) / this.data.tilewidth);
                        var stopped = false;
                        for (var y = cellBottom; y <= cellNext; y++) {
                            for (var x = cellLeft; x <= cellRight; x++) {
                                if (this.block(x, y)) {
                                    //console.log('entity on ground');
                                    entity.isOnGround = true;
                                    entity.isJumping = false;
                                    entity.isFalling = false;
                                    this.accelY = 0;
                                    stopped = true;
                                    break;
                                }
                            }
                            if (stopped) break;
                        }
                    }
                } else entity.isOnGround = false;

            },


            load: function(src) {
                // destroy other loaded levels @todo
                //yespix.find('/level').not(this).destroy();

                yespix.load(src, {
                    'complete': function(e) {
                        yespix.dump(e);

                        var entity = e.entity;
                        entity.data = JSON.parse(e.content);


                        entity.canvas = document.createElement('canvas');
                        entity.context = entity.canvas.getContext('2d');

                        var index = 0;
                        var colors = ['', '', '#ff9900', '#FF0000', '#006600', '#000099'];

                        entity.canvas.width = entity.data.width * entity.data.tilewidth;
                        entity.canvas.height = entity.data.height * entity.data.tileheight;

                        for (var y = 0; y < entity.data.height; y++) {
                            for (var x = 0; x < entity.data.width; x++) {
                                var tileIndex = entity.data.layers[0].data[index];
                                if (tileIndex > 1) {
                                    //console.log('x=' + x + ', y=' + y + ', tileIndex=' + tileIndex);
                                    entity.context.fillStyle = colors[tileIndex];
                                    entity.context.fillRect(x * entity.data.tilewidth, y * entity.data.tileheight, entity.data.tilewidth, entity.data.tileheight);
                                }
                                index++;
                            }
                        }
                        entity.isReady = true;
                        yespix.level = entity;
                    },
                    'entity': this,
                });
            },

            draw: function(context) {
                //console.log('level draw');
                if (!this.isVisible) return;

                //console.log('level draw #2');
                if (!context) {
                    if (!this._context) {
                        this.getContext();
                        if (this._context) context = this._context;
                    } else context = this._context;
                }

                //console.log('level draw #3 context = '+context+', isReady = '+this.isReady);
                if (context && this.isReady) {
                    context.globalAlpha = this.alpha;
                    //console.log('level draw #4');
                    context.drawImage(this.canvas, //image element
                        0, // x position on image
                        0, // y position on image
                        this.canvas.width, // width on image
                        this.canvas.height, // height on image
                        0, // x position on canvas
                        0, // y position on canvas
                        this.canvas.width, // width on canvas
                        this.canvas.height // height on canvas
                    );
                }
            },
        });

        yespix.define('player2w', 'actor2w', {

            actorKeys: {
                left: 'left',
                right: 'right',
                attack: 'x',
                jump: ' ',
            },

            actorAnims: {
                'idleright': 'idleright',
                'idleleft': 'idleleft',

                'walkright': 'walkright',
                'walkleft': 'walkleft',

                'lookup': 'lookup',
                'lookdown': 'lookdown',

                'jumpleft': 'jumpleft',
                'jumpright': 'jumpright',

                'airleft': 'airleft',
                'airright': 'airright',

                'attackleft': 'punch1left',
                'attackright': 'punch1right',
            },

            playerAirFriction: 0.02,
            playerGroundFriction: 0.13,

            actorOptions: {
                alwaysRun: false,
            },

            init: function() {
                yespix.on('enterFrame', function() {
                    var move = '';

                    if (this.actorMove.left && yespix.key(this.actorKeys.left) && !yespix.key(this.actorKeys.right)) this.accelX = -this.actorSpeed;
                    else if (this.actorMove.right && yespix.key(this.actorKeys.right) && !yespix.key(this.actorKeys.left)) this.accelX = this.actorSpeed;
                    else this.accelX = 0;

                    //console.log('yespix.key('+this.actorKeys.attack+') = '+yespix.key(this.actorKeys.attack));
                    //console.log('isOnGround = '+this.isOnGround+'');

                    if (this.actorMove.attack && yespix.key(this.actorKeys.attack) && !this.isAttacking) {
                        this.isAttacking = true;
                        move = 'attack' + this.actorDirection;
                        this.animWait = false;
                        this.animPlay(this.actorAnims[move]);
                        this.animWait = true;
                        //yespix.dump(this);
                    }

                    if (this.actorMove.jump && this.isOnGround && yespix.key(this.actorKeys.jump)) {
                        move = 'jump' + this.actorDirection;
                        this.animWait = false;
                        this.animPlay(this.actorAnims[move]);
                        this.animWait = true;
                        this.accelY = -this.actorSpeedJump;
                        this.animNext = 'air' + this.actorDirection;
                        this.isJumping = true;
                        this.jumpTime = (new Date).getTime();
                        console.log('this.jumpTime = ' + this.jumpTime);
                    } else if (this.isJumping) {
                        console.log('jumpTime = ' + this.jumpTime + ', now = ' + ((new Date).getTime()) + ', +400 ? ' + (this.jumpTime + 400 > (new Date).getTime()));
                        if (this.jumpTime + 200 > (new Date).getTime() && yespix.key(this.actorKeys.jump)) {
                            this.accelY = -(this.actorSpeedJump / 6);
                            //this.accelY = 0;
                        } else this.accelY = 0;
                    } else this.accelY = 0;

                    if (this.speedX > 0 && this.speedX >= this.speedY && this.speedX >= -this.speedY) {
                        this.actorDirection = 'right';
                        if (this.isOnGround) move = 'walk';
                    } else if (this.speedX < 0 && this.speedX <= this.speedY && this.speedX <= -this.speedY) {
                        this.actorDirection = 'left';
                        if (this.isOnGround) move = 'walk';
                    }
                    if (!this.isOnGround) {
                        if (this.speedY > 0) {
                            this.isJumping = false;
                            this.isFalling = true;
                        }
                        move = 'air';
                    }

                    if (move == '') move = this.actorMove['default'] + this.actorDirection;
                    else move = move + this.actorDirection;
                    this.animNext = this.actorAnims[move];


                    if (this.animWait || this.isAttacking) return;


                    this.animPlay(this.actorAnims[move]);
                    //console.log('move = '+move+', anim = '+this.actorAnims[move]+', actorAnim = '+this.actorAnims[this.actorAnims[move]]);

                }, this, yespix);
            },

            applyFriction: function() {
                this.speedX *= (1 - this.playerGroundFriction);
                this.speedY *= (1 - this.playerAirFriction);
                if (this.speedX < this.actorSpeedMin && this.speedX > -this.actorSpeedMin) this.speedX = 0;
                if (this.speedY < this.actorSpeedMin && this.speedY > -this.actorSpeedMin) this.speedY = 0;
                return true;
            },


        });

        yespix.define('rect', 'gfx', {

            lineWidth: 0,
            lineColor: '#000000',
            rectColor: '#999999',
            isVisible: true,

            init: function() {},

            draw: function(context) {
                if (!this.isVisible) return;

                if (!context) {
                    if (!this._context) {
                        this.getContext();
                        if (this._context) context = this._context;
                    } else context = this._context;
                }

                var box = this.getDrawBox();
                var scaleX = this.flipX ? -1 : 1;
                var scaleY = this.flipY ? -1 : 1;

                if (context) {
                    context.globalAlpha = this.alpha;

                    if (this.rectColor !== '') {
                        context.fillStyle = this.rectColor;
                        context.fillRect(
                            box.x, // x position on canvas
                            box.y, // y position on canvas
                            box.width, // width on canvas
                            box.height // height on canvas
                        );
                    }
                    if (this.lineWidth > 0 && this.lineColor != '') {
                        context.lineWidth = this.lineWidth;
                        context.strokeStyle = this.lineColor;
                        context.strokeRect(box.x, box.y, box.width, box.height);
                    }

                    if (this.debug) {
                        this.drawDebug(context, box);
                    }
                }
            },

        });

        yespix.define('roundrect', 'rect', {

            rectRadius: 5,

            init: function() {},

            drawPath: function(context) {
                context.beginPath();
                context.moveTo(this.x + this.rectRadius, this.y);
                context.lineTo(this.x + this.width - this.rectRadius, this.y);
                context.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + this.rectRadius);
                context.lineTo(this.x + this.width, this.y + this.height - this.rectRadius);
                context.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - this.rectRadius, this.y + this.height);
                context.lineTo(this.x + this.rectRadius, this.y + this.height);
                context.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - this.rectRadius);
                context.lineTo(this.x, this.y + this.rectRadius);
                context.quadraticCurveTo(this.x, this.y, this.x + this.rectRadius, this.y);
            },

            draw: function(context) {
                if (!this.isVisible) return;

                if (!context) {
                    if (!this._context) {
                        this.getContext();
                        if (this._context) context = this._context;
                    } else context = this._context;
                }

                var box = this.getDrawBox();
                var scaleX = this.flipX ? -1 : 1;
                var scaleY = this.flipY ? -1 : 1;

                if (context) {
                    context.globalAlpha = this.alpha;
                    if (this.rectColor != '') {
                        context.fillStyle = this.rectColor;
                        this.drawPath(context);
                        context.fill();
                    }
                    if (this.lineWidth > 0 && this.lineColor != '') {
                        context.lineWidth = this.lineWidth;
                        context.strokeStyle = this.lineColor;
                        if (this.rectColor == '') this.drawPath(context);
                        context.stroke();
                    }
                    if (this.debug) {
                        this.drawDebug(context, box);
                    }
                }
            },

        });

        /**
         *
         */
        yespix.define('sound', {
            // sounds
            sounds: [],

            soundDefaults: {
                isInitiated: false, // true if soundInit() was called
                isSupported: false, // 
                isReady: false,
                volume: 1.0,
                duration: 0,
                formats: [],
                src: '',
                mimeType: '',
                loop: false,
                autoplay: false,
                element: null,
                document: yespix.document,
                assets: this.assets,
            },

            init: function() {
                var entity = this,
                    count = 1;

                if (yespix.isString(this.sounds)) this.sounds = [{
                    src: this.sounds,
                }];
                //console.log('init sound: array of '+this.sounds.length+' sounds');

                for (var t = 0; t < this.sounds.length; t++) {
                    // init the default properties
                    //console.log('init the sound ['+t+'] with the default properties');
                    for (var n in this.soundDefaults) {
                        //console.log('copy property '+n+' : sound = '+this.sounds[t][n]+', default = '+this.soundDefaults[n]);
                        this.sounds[t][n] = this.sounds[t][n] || this.soundDefaults[n];
                        //console.log('init as '+this.sounds[t][n]);
                    }
                    if (this.sounds[t].name === '') this.sounds[t].name = 'sound' + count++;
                }

                /**
                 * returns a sound and executes a function on it
                 * @function sound
                 * @example sound() returns the first sound
                 * @example sound('test') returns the sound with name "test"
                 * @example sound('/play') plays the first sound and returns it
                 * @example sound('test/stop') stop the sound with name "test"
                 * @example sound(1) returns the sound at index 1 (index is from 0 to sounds.length-1)
                 * @example sound({name: 'test' }) returns the sound with name "test"
                 * @example sound({ volume: 0.7 }) return the first sound with volume set to 0.7
                 */
                this.sound = function(properties) {
                    //console.log('sound :: properties = '+properties);

                    var fn = '';
                    if (properties == undefined)
                        if (this.sounds[0]) return this.soundInit(this.sounds[0]);
                        else return null;
                    if (typeof properties == 'string') {
                        properties = {
                            name: properties
                        };
                        if (properties.name.indexOf('/') != -1) {
                            var list = properties.name.split('/');
                            properties.name = list[0];
                            fn = list[1];
                            if (list[0] == '') return this.soundInit(this.sounds[0])[fn]();
                        }
                    } else if (Object.isInt(properties))
                        if (this.sounds[properties]) return this.soundInit(this.sounds[properties]);
                        else return null;

                    var max = Object.keys(properties).length;
                    var count = 0;
                    for (var t = 0; t < this.sounds.length; t++) {
                        //console.log('checking sound ['+t+'] with name "'+this.sounds[t].name+'"');
                        for (var n in properties) {
                            if (this.sounds[t][n] !== undefined && properties[n] == this.sounds[t][n]) count++;
                            //console.log('property "'+n+'", max = '+max+', count = '+count);
                            if (fn != '') return this.soundInit(this.sounds[t])[fn]();
                            if (count >= max) return this.soundInit(this.sounds[t]);
                        }
                    }
                    return null;
                };

                this.soundInit = function(sound) {
                    parent = this;

                    // no sound, init all the sounds
                    if (sound == undefined) {
                        for (var t = 0; t < this.sounds.length; t++) this.soundInit(this.sounds[t]);
                        return true;
                    }

                    // sound already initiated
                    if (sound.isInitiated) return sound;

                    sound.isInitiated = true;
                    sound.element = document.createElement("audio");

                    // alias of yespix.support
                    sound.support = function(format) {
                        if (format == undefined) return false;
                        return yespix.support(format);
                    };

                    // add source to the audio element and to the assets list
                    sound.changeSource = function(source) {
                        if (this.support('.' + yespix.getExtension(source))) {
                            this.isSupported = true;
                            this.element.src = source;

                            if (this.volume < 0) this.volume = 0;
                            else if (this.volume > 1) this.volume = 1;
                            this.element.volume = this.volume;
                            return true;
                        }
                        return false;
                    };

                    sound.load = function() {
                        if (!this.isSupported) return this;
                        this.element.load();
                        return this;
                    };

                    sound.play = function() {
                        if (!this.isSupported) return this;
                        this.element.play();
                        return this;
                    };

                    sound.isPlaying = function() {
                        if (!this.isSupported) return null;
                        return !this.element.paused;
                    };

                    sound.pause = function() {
                        if (!this.isSupported) return this;
                        this.element.pause();
                        return this;
                    };

                    sound.isPaused = function() {
                        if (!this.isSupported) return null;
                        return !!this.element.paused;
                    };

                    sound.mute = function() {
                        if (!this.isSupported) return null;
                        this.element.muted = true;
                        return this;
                    };

                    sound.unmute = function() {
                        if (!this.isSupported) return this;
                        this.element.muted = false;
                        return this;
                    };

                    sound.muteToggle = function() {
                        if (!this.isSupported) return this;
                        if (this.isMuted()) this.unmute();
                        else this.mute();
                        return this;
                    };

                    sound.isMuted = function() {
                        if (!this.isSupported) return null;
                        return this.element.muted;
                    };

                    sound.restart = function() {
                        if (!this.isSupported) return this;
                        this.stop().play();
                        return this;
                    };

                    sound.stop = function() {
                        if (!this.isSupported) return this;
                        this.element.pause();
                        this.setTime(0);
                        return this;
                    };

                    sound.setVolume = function(n) {
                        if (!this.isSupported) return this;
                        this.volume = n;
                        if (this.volume < 0) this.volume = 0;
                        else if (this.volume > 1) this.volume = 1;
                        this.element.volume = this.volume;
                        return this;
                    };

                    sound.volumeUp = function() {
                        if (!this.isSupported) return this;
                        this.volume -= 0.1;
                        if (this.volume < 0) this.volume = 0;
                        else if (this.volume > 1) this.volume = 1;
                        this.element.volume = this.volume;
                        return this;
                    };

                    sound.volumeDown = function() {
                        if (!this.isSupported) return this;
                        this.volume += 0.1;
                        if (this.volume < 0) this.volume = 0;
                        else if (this.volume > 1) this.volume = 1;
                        this.element.volume = this.volume;
                        return this;
                    };

                    sound.setTime = function(time) {
                        if (!this.isSupported) return this;
                        this.element.currentTime = time;
                        return this;
                    };

                    sound.isEnded = function() {
                        if (!this.isSupported) return null;
                        return this.element.ended;
                    };

                    if (sound.src !== undefined && sound.src !== '') {
                        if (yespix.isArray(sound.src)) {
                            // check every sources to add the source element
                            for (var t = 0; t < sound.src.length; t++)
                                if (sound.src[t] && !sound.isSupported) sound.changeSource(sound.src[t]);
                        } else if (yespix.isArray(sound.formats) && sound.formats.length > 0) {
                            // check every formats to add the source element
                            for (var t = 0; t < sound.formats.length; t++)
                                if (sound.formats[t] && !sound.isSupported) sound.changeSource(sound.src + '.' + sound.formats[t]);
                        } else if (yespix.isString(sound.src) && sound.src != '') {
                            // add the source
                            sound.changeSource(sound.src);
                        }
                    }
                    //this.soundInit();
                    return sound;
                };

                this.assets = function(sound) {
                    parent = this;

                    // no sound defined, call assets on all the sounds
                    if (sound == undefined) {
                        var assets = []
                        for (var t = 0; t < this.sounds.length; t++) assets = assets.concat(this.assets(this.sounds[t]));
                        return assets;
                    }

                    if (sound.src !== undefined && sound.src !== '') {
                        if (yespix.isArray(sound.src)) {
                            // check every sources in array to add the source element
                            for (var t = 0; t < sound.src.length; t++)
                                if (sound.src[t] && yespix.support('.' + yespix.getExtension(sound.src[t]))) {
                                    sound.src = sound.src[t];
                                    sound.isSupported = true;
                                    return [sound.src];
                                }
                            return [];
                        } else if (yespix.isArray(sound.formats) && sound.formats.length > 0) {
                            // check every formats to add the source element
                            for (var t = 0; t < sound.formats.length; t++)
                                if (sound.formats[t] && yespix.support('.' + sound.formats[t])) {
                                    sound.src = sound.src + '.' + sound.formats[t];
                                    sound.isSupported = true;
                                    return [sound.src];
                                }
                        } else if (yespix.isString(sound.src) && sound.src.indexOf('|') != -1) {
                            var s = sound.src.split('|');
                            for (var t = 0; t < s.length; t++)
                                if (s[t] && yespix.support('.' + yespix.getExtension(s[t]))) {
                                    sound.src = s[t];
                                    sound.isSupported = true;
                                    return [sound.src];
                                }
                            return [];
                        } else if (yespix.isString(sound.src) && sound.src != '') {
                            if (yespix.support('.' + yespix.getExtension(sound.src))) {
                                sound.isSupported = true;
                                return [sound.src];
                            }
                        }
                    }
                    return [];
                };

            },
        });

        yespix.define('text', 'gfx', {
            textAlign: 'left', // "left" / "right" / "center"
            textFont: '16px sans-serif',
            textColor: '#000000',
            text: '',

            draw: function(context) {
                if (!this.isVisible) return;

                if (!context) {
                    if (!this._context) {
                        this.getContext();
                        if (this._context) context = this._context;
                    } else context = this._context;
                }

                if (context) {

                    context.globalAlpha = this.alpha;
                    context.fillStyle = this.textColor;
                    context.font = this.textFont;
                    context.fillText(this.text, this.x, this.y);

                    if (this.debug) {
                        this.drawDebug(context, box);
                    }
                }
            },

        });

    }

    // expose the YESPIX function constructor
    window.yespix = yespix;

})();
