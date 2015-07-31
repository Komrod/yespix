

/**
 ************************************************************************************************************
 ************************************************************************************************************
 * ENTITIES
 */


Function.prototype.extend = function() {
    var destination = this.prototype || this;
    for (var i = 0; i < arguments.length; i++)
        for (var key in arguments[i])
            if (arguments[i].hasOwnProperty(key)) {
                destination[key] = arguments[i][key];
                if (destination[key]) destination[key]._methodName = key;
            }
}


Function.prototype.inherit = function(parent) {
    var d = {},
        p = this.prototype;
    Function.extend.apply(p, [parent.prototype]);
    this.prototype.constructor = parent;

    for (var methodName in p) {
        if (p[methodName]) p[methodName]._methodName = methodName;
    }

    Object.defineProperty(this.prototype, "super", {
        get: function get() {
            var impl = get.caller,
                name = impl._methodName,
                foundImpl = this[name] === impl,
                proto = this;
            while (proto = proto.constructor.prototype) {
                if (!proto[name]) {
                    break;
                } else if (proto[name] === impl) {
                    foundImpl = true;
                } else if (foundImpl) {
                    return proto[name];
                }
            }
            //if (!foundImpl) throw "super function may not be called outside an inherit implementation";
        }
    });
};



yespix.fn.defineEntity = function(name, properties) {
    if (this.isFunction(properties)) {
        this.entity[name] = properties;
        return properties;
    } else {
        return this.define(name, properties, 'entity');
    }
};


yespix.fn.defineClass = function(name, properties) {
    if (this.isFunction(properties)) {
        this.class[name] = properties;
        return properties;
    } else {
        return this.define(name, properties, 'class');
    }
};



/*
properties:
inheritClass: class to inherit from
extendClasses: array of classes to extend from
*/
yespix.fn.define = function(name, properties, type) { //, inheritClass, extendClasses) {
    
    type = type || 'class';
    var yespix = this;
    
    if (properties.inheritClass && this.isString(properties.inheritClass)) {
        if (type == 'class') {
            properties.inheritClass = this.class[properties.inheritClass];
        } else if (type == 'entity') {
            properties.inheritClass = this.entity[properties.inheritClass];
        }
    }

    var newClass = function() {
        // create
        if (properties.inheritClass) properties.inheritClass.apply(this, arguments);

        // create the prototype
        if (!this.prototype) {
            this.prototype = {};
        }

        // copy the variables
        for (var variableName in properties) {
            if (typeof properties[variableName] !== 'function' && variableName !== 'extendClasses') {
                this[variableName] = properties[variableName];
            }
        }

        // dont init if we already did
        if (this.instanceInitiated) { // && this.instanceInitiated[name]) {
            return;
        }

        this.instanceInitiated = true;

        // init if function exists
        if (this.init) {
            this.init.apply(this, arguments);
        }
    };

    
    newClass.properties = properties;

    if (properties.inheritClass) newClass.inherit(properties.inheritClass);

    if (properties.extendClasses)
        for (var t = 0; t < properties.extendClasses.length; t++) newClass.extend(properties.extendClasses[t]);

    for (var functionName in properties) {
        if (typeof properties[functionName] === 'function' && functionName !== 'inheritClass') {
            properties[functionName]._methodName = functionName;
            newClass.prototype[functionName] = properties[functionName];
        }
    }

    // place new class in the right object
    if (type == 'class') {
        this.class[name] = newClass;
    } else if (type == 'entity') {
        this.entity[name] = newClass;
    }
//console.log('define: end properties = ', properties);
    return newClass;
};
