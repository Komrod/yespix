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

Bunch.prototype = new Array;

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