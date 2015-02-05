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
 *
*/
yespix.fn.isEntity = function(object) {
    if (!yespix.isObject(object)) return false;
    if (entity.hasOwnProperty('_class') 
        && entity.hasOwnProperty('_ancestors') 
        && entity.hasOwnProperty('_id')
        && entity.hasOwnProperty('_children')
        && entity.hasOwnProperty('_parent')) {
        return true;
    }
    return false;
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
 * @method contains
 */
yespix.fn.contains = function(str, search) {
    return (str+'').indexOf(search) > -1;
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


/*
 * Get the font height and puts it in cache
 */
yespix.fn.getFontHeight = function(fontStyle) {
    var result = this.data.fontHeight[fontStyle];

    if (!result) {
        var fontDraw = document.createElement("canvas");
        var ctx = fontDraw.getContext('2d');
        ctx.fillRect(0, 0, fontDraw.width, fontDraw.height);
        ctx.textBaseline = 'top';
        ctx.fillStyle = 'white';
        ctx.font = fontStyle;
        ctx.fillText('gM', 0, 0);
        var pixels = ctx.getImageData(0, 0, fontDraw.width, fontDraw.height).data;
        var start = -1;
        var end = -1;
        for (var row = 0; row < fontDraw.height; row++) {
            for (var column = 0; column < fontDraw.width; column++) {
                var index = (row * fontDraw.width + column) * 4;
                if (pixels[index] === 0) {
                    if (column === fontDraw.width - 1 && start !== -1) {
                        end = row;
                        row = fontDraw.height;
                        break;
                    }
                    continue;
                } else {
                    if (start === -1) {
                        start = row;
                    }
                    break;
                }
            }
        }
        result = end - start;
        this.data.fontHeight[fontStyle] = result;
    }
    return result;
};


yespix.fn.quickSort = (function () {

    function partition(array, left, right) {
        var cmp = array[right - 1],
            minEnd = left,
            maxEnd;
        for (maxEnd = left; maxEnd < right - 1; maxEnd += 1) {
            if (array[maxEnd] <= cmp) {
                swap(array, maxEnd, minEnd);
                minEnd += 1;
            }
        }
        swap(array, minEnd, right - 1);
        return minEnd;
    }

    function swap(array, i, j) {
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
        return array;
    }

    function quickSort(array, left, right) {
        if (left < right) {
            var p = partition(array, left, right);
            quickSort(array, left, p);
            quickSort(array, p + 1, right);
        }
        return array;
    }

    return function (array) {
        return quickSort(array, 0, array.length);
    };
}());

