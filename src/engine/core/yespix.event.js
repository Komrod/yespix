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