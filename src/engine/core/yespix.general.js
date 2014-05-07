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
	return str.substring(0, this.lastIndexOf("/") + 1);
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
	return fn && {}.toString.call(fn) === "[object Function]";
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
	if (!this.isArray(array)) array = [].slice.call(array);
	var length = array.length;
	args = args || [];
	if (length) {
		if (this.isFunction(fn)) {
			for (var i in array) fn.apply(array[i], args);
		} else if (this.isString(fn)) {
			for (var i in array)
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
	var count = 1;
	for (var n in obj) {
		if (this.isObject(obj) && properties.length > 0 && !this.inArray(properties, n)) continue;

		if (obj[n] === null) console.log(' - ' + n + ' : null');
		else if (typeof obj[n] === 'undefined') console.log(' - ' + n + ' = undefined');
		else if (typeof obj[n] === 'boolean') console.log(' - ' + n + ' = "' + obj[n] + '" (boolean)');
		else if (typeof obj[n] === 'number') console.log(' - ' + n + ' = ' + obj[n] + ' (number)');
		else if (typeof obj[n] === 'function') console.log(' - ' + n + ' (function)');
		else if (this.isString(obj[n])) console.log(' - ' + n + ' = "' + obj[n] + '" (string)');
		else if (this.isArray(obj[n])) {
			var str = '';
			if (expand)
				for (var t = 0; t < obj[n].length; t++) {
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
			var str = '';
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