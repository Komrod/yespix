/**
 ************************************************************************************************************
 ************************************************************************************************************
 * Bunch
 *
 */

// bunch init
Bunch = function(list) {
    if (!(this instanceof Bunch)) return new Bunch(list);
    this.__bunch_init.apply(this, arguments);
};

Bunch.prototype = [];

Bunch.prototype.unique = function() {
    for (var t = 0; t < this.length; t++) {
        for (var u = t + 1; u < this.length; u++) {
            if (this[t] === this[u]) {
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
