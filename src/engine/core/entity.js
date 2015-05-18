

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
    var yespix = this;
    if (properties.inheritClass && this.isString(properties.inheritClass)) properties.inheritClass = this.class[properties.inheritClass];
//console.log('======================');        
//console.log('define: start: class name = ', name);        
//console.log('define: properties = ', properties);


    this.class[name] = function() {
//console.log('-------');        
//console.log('define: creating instance class = ', name);        

        // create
        if (properties.inheritClass) properties.inheritClass.apply(this, arguments);

//console.log('-------');        
//console.log('define: continue instance class = ', name);    

        // create the prototype
        if (!this.prototype) this.prototype = {};
//console.log('define: instance properties = ', properties);
//console.log('define: instance yespix = ', yespix);
//console.log('define: instance yespix.class['+name+'].properties = ', yespix.class[name].properties);
        // copy the variables
        for (var variableName in properties) {
//console.log('properties['+variableName+'] type = '+(typeof properties[variableName]));
            if (typeof properties[variableName] !== 'function' && variableName !== 'extendClasses') {

                //this.prototype[variableName] = properties[variableName];
                this[variableName] = properties[variableName];

//console.log('define: instance properties['+variableName+'] = ', properties[variableName]);
//console.log('define: instance prototype['+variableName+'] = ', this.prototype[variableName]);

            }
        }

//console.log('define: instance prototype = ', this.prototype);
//console.log('define: instance = ', this);
//console.log('define: name = ', name);
//if (this.instanceInitiated) console.log('define: this.instanceInitiated[name] = ', this.instanceInitiated[name]);
//else console.log('define: this.instanceInitiated = ', null);
        // dont init if we already did
        if (this.instanceInitiated) { // && this.instanceInitiated[name]) {
//console.log('define: dont fire init, this.instanceInitiated = ', this.instanceInitiated);
            return;
        }
        //if (!this.instanceInitiated) this.instanceInitiated = {};
        //this.instanceInitiated[name] = true;
        this.instanceInitiated = true;

        // init if function exists
        if (this.init) {
console.log('define: name = '+name+': execute init');
            this.init.apply(this, arguments);
        }
//console.log('define: instance end, name = ', name);        
console.log('define: end instance = ', this);
    };

    this.class[name].properties = properties;

    if (properties.inheritClass) this.class[name].inherit(properties.inheritClass);

    if (properties.extendClasses)
        for (var t = 0; t < properties.extendClasses.length; t++) this.class[name].extend(properties.extendClasses[t]);

    for (var functionName in properties) {
        if (typeof properties[functionName] === 'function' && functionName !== 'inheritClass') {
            properties[functionName]._methodName = functionName;
            this.class[name].prototype[functionName] = properties[functionName];
        }
    }

//console.log('define: end properties = ', properties);
    return this.class[name];
};
