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
 * LISTEN TO VARIABLE CHANGES
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
 * Key down bindings
 * @param  {object} e Event
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
