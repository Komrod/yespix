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
                destination[key]._methodName = key;
            }
}

Function.prototype.inherit = function(parent) {
    var d = {},
        p = this.prototype;
    Function.extend.apply(p, [parent.prototype]);
    this.prototype.constructor = parent;

    for (var methodName in p) {
        p[methodName]._methodName = methodName;
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
            if (!foundImpl) throw "super function may not be called outside an inherit implementation";
        }
    });
};




/*
properties:
inheritClass: class to inherit from
extendClasses: array of classes to extend from
*/
yespix.fn.define = function(name, properties) { //, inheritClass, extendClasses) {
    if (properties.inheritClass && this.isString(properties.inheritClass)) properties.inheritClass = this.class[properties.inheritClass];
    this.class[name] = function() {

        if (this.instanceInitiated) return;
        this.instanceInitiated = true;

        if (properties.inheritClass) properties.inheritClass.apply(this, arguments);

        for (var variableName in properties) {
            if (typeof properties[variableName] !== 'function' && variableName !== 'extendClasses') {
                if (!this.prototype) this.prototype = {};
                this.prototype[variableName] = properties[variableName];
            }
        }

        if (this.init) {
            this.init.apply(this, arguments);
        }
    };

    if (properties.inheritClass) this.class[name].inherit(properties.inheritClass);

    if (properties.extendClasses)
        for (var t = 0; t < properties.extendClasses.length; t++) this.class[name].extend(properties.extendClasses[t]);

    for (var functionName in properties) {
        if (typeof properties[functionName] === 'function' && functionName !== 'inheritClass') {
            properties[functionName]._methodName = functionName;
            this.class[name].prototype[functionName] = properties[functionName];
        }
    }

    return this.class[name];
};
