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
yespix.fn.entityClasses = {}; // entity classes

/**
 * Stores entity informations for the creation on init
 * @type {array}
 */
yespix.fn.entityPending = []; // list of entity classes pending their creation



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
 * will refer to an entity. When comparing the selector property to the entity property, the comparision is
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
 * @exemple find('') of find()			// find all the entities
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
                if (properties[this.selectorType(items[t])]) console.warn('entity.selectorInit: ambiguous selector item: "' + items[t] + '" defined twice in "' + selector + '"')
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
},


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
    //console.log('define :: defining the entity "'+name+'"');

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
        list: list,
        classname: name,
        properties: properties,
    };

    // adding the ancestors
    this.entityFetchAncestors(name);

    this.entityClasses[name].ancestors = this.unique(this.entityClasses[name].ancestors);

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
        return;
    }

    mode = mode || 'pending';
    var list = this.entityClasses[className].list;

    for (var t = 0; t < list.length; t++) {
        if (list[t] != '') {
            if (!this.entityClasses[list[t]]) {
                if (mode == 'pending') {
                    console.warn('entityFetchAncestors :: cannot find the ancestor class name "' + list[t] + '" for class "' + className + '", add as pending entity');
                    this.entityPending.push(className);
                    this.entityClasses[className].ancestors = [];
                    break;
                } else {
                    console.error('entityFetchAncestors :: cannot find the ancestor class name "' + list[t] + '" for entity class "' + className + '"');
                }
            } else if (list[t] == className) {
                console.warn('entityFetchAncestors :: entity class cannot add itself to ancestors, skipping');
            } else {
                this.entityClasses[className].ancestors = this.entityClasses[className].ancestors.concat(this.ancestors(list[t]));
            }
        }
    }
};

yespix.fn.isEntityPending = function(className) {
    var len = this.entityPending.length;
    for (var t = 0; t < len; t++) {
        if (this.entityPending[t] == className) return true;
    }
    console.log('isEntityPending :: entity "' + className + '" not pending');

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
    if (this.isEntityPending(name)) {
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
