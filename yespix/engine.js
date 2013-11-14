(function(undefined) {

	/**
	 * TODO:
	 * - do the variable listener
	 * - complete the find method and the bunch
	 * - function visible() returns true if entity is visible on canvas
	 * - debug the z index
	 * - do a partial draw for each gfx entities
	 * - prerender canvas for the partial draw
	 * - function xload which try to do something with the loaded file (execute a .js script, add .css file to document ...)
	 *
	 *
	 * DONE:
	 * x handle keys // 2013-11-14
	 * x do the children manager // 2013-11-13
	 * x make functions to handle instances in YESPIX engine and _instances in entity
	 * x change _name to name because it's not unique and private // 2013-11-13
	 * x do not store the progress in the file object // 2013-11-11
	 * x "cache" object switch to "file" object // 2013-11-11
	 * x do not put content in memory cache // 2013-11-10
	 * x make a YESPIX engine class to be instanciated
	 * x build a system to make the unit tests
	 *
	 *
	 * CANCELED:
	 * + override the yespix function to do something else after init // cant instanciate new YESPIX object after that
	 *
	 * PENDING:
	 * - do real js classes with prototype for entity classes
	 *
	 */

	/**
	 * @class yespix
	 */

	/**
	 * YESPIX contructor. Handles the engine initialisation with options and trigger the "ready" event
	 */

	function yespix(options) {
		if (!(this instanceof yespix)) return new yespix(options);
		this.init(options);
		this.trigger('ready');
	}

	/**
	 * YESPIX prototype
	 */
	yespix.fn = yespix.prototype = {

		/**
		 ***********************************************************************************************************
		 ***********************************************************************************************************
		 * YESPIX INIT
		 */

		/**
		 * Initialisation of the YESPIX engine
		 * @method init
		 */
		init: function(options) {
			/**
			 * Set to True when the YESPIX engine is initiated and ready to do stuff
			 * @property isReady
			 * @type boolean
			 */
			this.isReady = false;

			// initialisation of the ready event
			this.on('ready', function() {
				isReady = true;
				this.timerStart();
			});

			// current version of the engine
			this.version = "0.112";

			// initialise the modules array
			var modules = []; // yespix common modules

			// initialise the data
			this.data = {
				// download files
				file: {

				},

				// media support
				support: {
					types: {
						"audio": true,
						"video": true,
					},
					extensions: {
						".3gp": 'audio/3gpp',
						".ac3": 'audio/wav',
						".avi": 'video/avi',
						".kar": 'audio/midi',
						".mid": 'audio/midi',
						".m4a": 'audio/x-m4a',
						".mov": 'video/quicktime',
						".mp3": 'audio/mpeg',
						".mp4": 'video/mp4',
						".mpa": 'audio/mpeg',
						".mpg": 'video/mpeg',
						".webm": 'video/webm',
					},
					audio: {},
					video: {},
					elements: {},
				},

				// browser support
				browser: {
					infos: {
						name: null,
						version: null,
						os: null,
						mobile: null,
						initiated: false,
					},
					browserList: [{
						subString: "Chrome",
						identity: "Chrome"
					}, {
						subString: "Firefox",
						identity: "Firefox"
					}, {
						subString: "Apple",
						identity: "Safari",
						version: "Version"
					}, {
						subString: "MSIE",
						identity: "IE",
						version: "MSIE"
					}, {
						subString: "Opera",
						identity: "Opera",
						version: "Version"
					}, {
						subString: "OmniWeb",
						identity: "OmniWeb",
						version: "OmniWeb/"
					}, {
						subString: "iCab",
						identity: "iCab"
					}, {
						subString: "KDE",
						identity: "Konqueror"
					}, {
						subString: "Camino",
						identity: "Camino"
					}, {
						subString: "Netscape",
						identity: "Netscape"
					}, {
						subString: "Gecko",
						identity: "Mozilla",
						version: "rv"
					}, {
						subString: "Mozilla",
						identity: "Netscape",
						version: "Mozilla"
					}, ],
					osList: [{
						subString: "Win",
						identity: "Windows"
					}, {
						subString: "Mac",
						identity: "Mac"
					}, {
						subString: "iPhone",
						identity: "iPhone/iPod"
					}, {
						subString: "Linux",
						identity: "Linux"
					}, ],


				},

				key: {
					pressed: {

					},
					up: {

					},
					down: {

					},
					hold: {

					},
					special: {
						backspace: 8,
						tab: 9,
						enter: 13,
						shift: 16,
						ctrl: 17,
						alt: 18,
						pause: 19,
						capsLock: 20,
						escape: 27,
						pageUp: 33,
						pageDown: 34,
						end: 35,
						home: 36,
						left: 37,
						up: 38,
						right: 39,
						down: 40,
						insert: 45,
						delete: 46,
						leftWindowKey: 91,
						rightWindowKey: 92,
						selectKey: 93,
						numpad0: 96,
						numpad1: 97,
						numpad2: 98,
						numpad3: 99,
						numpad4: 100,
						numpad5: 101,
						numpad6: 102,
						numpad7: 103,
						numpad8: 104,
						numpad9: 105,
						f1: 112,
						f2: 113,
						f3: 114,
						f4: 115,
						f5: 116,
						f6: 117,
						f7: 118,
						f8: 119,
						f9: 120,
						f10: 121,
						f11: 122,
						f12: 123,
						numLock: 144,
						scrollLock: 145,
					}
				},
			};


			// initialisation of the options 
			options = options || {};
			options['namespace'] = options['namespace'] || 'yespix';
			options['dir_resources'] = options['dir_resources'] || 'resources/';
			options['dir_engine'] = options['dir_engine'] || 'yespix/';
			options['dir_modules'] = options['dir_modules'] || 'yespix/modules/';
			options['modules'] = this.unique(modules.concat(options['modules'] || []));
			options['ready'] = options['ready'] || function() {};
			options['init'] = options['init'] || function() {};
			this.on('ready', options['ready']);

			// store the options
			this.options = options;

			// set document and window
			this.document = options["document"] || document;
			this.window = options["window"] || window;


			initEntities(this);

			for (var t = 0; t < options['modules'].length; t++) {
				if (!/^http(s)?\:\/\//i.test(options['modules'][t])) {
					options['modules'][t] = options['dir_modules'] + options['modules'][t];
					if (!/\.js$/i.test(options['modules'][t])) options['modules'][t] = options['modules'][t] + '.js';
				}
				//console.log('script '+options['modules'][t]);
			}

			this.options = options;

			this.window[options['namespace']] = this;

			var yespix = this;

			function start(options) {

				if (options['canvas']) yespix.spawn('canvas', options.canvas);
				if (options['fps']) this.setFps(options.fps);

				yespix.on("draw", function(e) {
					//console.log('draw :: ');
					// sort by z and zGlobal
					function compare(a, b) {
						if (a.z > b.z) return true;
						if (a.z == b.z && a.zGlobal > b.zGlobal) return true;
						return false;
					}
					if (yespix.isArray(yespix.entityInstances['gfx'])) yespix.entityInstances['gfx'].sort(compare);

					if (yespix.entityInstances['gfx'])
						for (var t = 0; t < yespix.entityInstances['gfx'].length; t++) {
							if (yespix.entityInstances['gfx'][t] && yespix.entityInstances['gfx'][t].draw) {
								yespix.entityInstances['gfx'][t].draw();
							}
						}
				});
				options['init']();
				yespix.trigger('ready');
			}

			if (options['modules'].length === 0) {
				start(options);
				return this;
			}
			this.addjs(options['modules'], {
				complete: function() {
					start(options);
				},
				orderedExec: true,
			});

			return this;

		},

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
		randFloat: function(min, max) {
			return Math.random() * (max - min) + min;
		},

		/**
		 * Returns a random integer between min and max, included. Each Integer have the same distribution.
		 * @method randInt
		 * @return {number} Integer number
		 */
		randInt: function(min, max) {
			return Math.floor(Math.random() * (max - min + 1)) + min;
		},

		/**
		 * Returns a clone of the object. Clones with a one level property copy.
		 * @method clone
		 *
		 */
		clone: function(obj) {
			var count = 1;
			var temp = new obj.constructor();
			for (var n in obj)
				if (obj != obj[n]) temp[n] = obj[n];
			return temp;
		},

		/**
		 * @method unique
		 */
		unique: function(arr) {
			var o = {},
				i,
				l = arr.length,
				r = [];
			for (i = 0; i < l; i++) o[arr[i]] = arr[i];
			for (i in o) r.push(o[i]);
			return r;
		},

		/**
		 * @method getExtension
		 */
		getExtension: function(str) {
			var ext = str.split('.').pop();
			if (ext == str) return '';
			return ext;
		},

		/**
		 * @method getFilename
		 */
		getFilename: function(str) {
			return str.split('/').pop();
		},

		/**
		 * @method getDir
		 */
		getDir: function(str) {
			if (str.lastIndexOf("/") == -1) return '';
			return str.substring(0, this.lastIndexOf("/") + 1);
		},

		/**
		 * @method getNoExtension
		 */
		getNoExtension: function(str) {
			var filename = this.getFilename(str);
			if (filename.lastIndexOf(".") == -1) return filename;
			return filename.substring(0, filename.lastIndexOf("."));
		},

		/**
		 * @method isInt
		 */
		isInt: function(value) {
			if (this.isString(value)) return false;
			if ((parseFloat(value) == parseInt(value)) && !isNaN(value)) return true;
			return false;
		},

		/**
		 * @method isArray
		 */
		isArray: function(value) {
			return Object.prototype.toString.call(value) === "[object Array]";
		},

		/**
		 * @method isBoolean
		 */
		isBoolean: function(value) {
			return typeof value == "boolean";
		},

		/**
		 * @method isUndefined
		 */
		isUndefined: function(value) {
			return value === undefined;
		},

		/**
		 * @method isString
		 */
		isString: function(value) {
			return typeof value == "string";
		},

		/**
		 * Trim string left and right
		 * @param  {string} str String to trim
		 * @return {string} Result string
		 */
		trim: function(str) {
			return str.replace(/^\s+|\s+$/g, '');
		},

		/**
		 * Left trim string
		 * @param  {string} str String to trim
		 * @return {string} Result string
		 */
		ltrim: function(str) {
			return str.replace(/^\s+/, '');
		},

		/**
		 * Right trim string
		 * @param  {string} str String to trim
		 * @return {string} Result string
		 */
		rtrim: function(str) {
			return str.replace(/\s+$/, '');
		},

		/**
		 * Trim string left and right, merge multiple spaces into one space
		 * @param  {string} str String to trim
		 * @return {string} Result string
		 */
		xtrim: function(str) {
			return str.replace(/(?:(?:^|\n)\s+|\s+(?:$|\n))/g, '').replace(/\s+/g, ' ');
		},

		/**
		 * Returns True if fn is a function
		 * @method isFunction
		 */
		isFunction: function(fn) {
			return fn && {}.toString.call(fn) === "[object Function]";
		},

		/**
		 * Returns True if obj is an object
		 * @method isObject
		 */
		isObject: function(obj) {
			return obj !== null && typeof obj === "object";
		},

		/**
		 * @method pLength
		 */
		pLength: function(object, owned) {
			owned = owned || true;
			var length = 0;
			for (var key in object)
				if (owned) {
					if (object.hasOwnProperty(key)) length++;
				} else length++;

			return length;
		},

		/**
		 * @method getType
		 */
		getType: function(obj) {
			if (obj === null) return 'null';
			else if (this.isString(obj)) return 'string';
			else if (this.isArray(obj)) return 'array';
			else if (this.isObject(obj)) return 'object';
			return typeof obj;
		},

		/**
		 * Check if the value is in the array
		 * @param arr The array to check
		 * @return {boolean} True if the value is in the array
		 * @method inArray
		 */
		inArray: function(arr, value) {
			return (arr.indexOf(value) != -1);
		},

		each: function(array, fn) {
			var length = array.length;
			if (length)
				for (var i in array) fn.apply(array[i], [i]);
			return this;
		},

		/**
		 * @method dump
		 */
		dump: function(obj, string, expand) {
			string = string || '';
			expand = expand || 9;
			console.group();
			console.info('Object dump: ' + string);
			var count = 1;
			for (var n in obj) {
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
		},



		/**
		 ************************************************************************************************************
		 ************************************************************************************************************
		 * EVENTS
		 *
		 */

		/**
		 * Trigger an event of an object. This function look inside the property "_eventList" of the object and
		 * iterates the array to trigger each event in the list. All the events are triggered synchronously, so
		 * after you called the trigger function, all the events are done.
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
		trigger: function(name, event, obj) {
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
		},

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
		on: function(name, callback, context, obj) {
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
		},


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
		off: function(name, callback, obj) {
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
		},

		/**
		 * @method ready
		 * Add a function call to the ready event of the YESPIX engine
		 * @exemple
		 * @todo ready must be triggered by the event system
		 * @chainable
		 */
		ready: function(fn, context) {
			if (isReady) fn.call(context, {
				type: "ready"
			});
			else on('ready', fn, context);
			return this;
		},



		/**
		 ************************************************************************************************************
		 ************************************************************************************************************
		 * FILES
		 *
		 */

		/**
		 * @method load
		 * Load some files and call "complete" function. Options can also add some other function calls ("error",
		 * "progress", "success", "skip") and "once" option. The methods "addjs" and "addcss" both use the "load"
		 * method and the same kind of options. If you provide options['complete'], it will overrides the
		 * "complete" parameter.
		 * For each functions, an event object is returned as follow:
		 * 		event['size']: size of the file, if
		 * 		event['loaded']: size of the file, if
		 * 		event['progress']: size of the file, if
		 * 		event['state']: pending / processing / loaded / error
		 * 		event['lengthComputable'] : true if the file size is known
		 * 		event['stat'] : object that provides the same informations (size, loaded ...) but for all the files
		 * @param {object} options Options of the file load, optional.
		 *		options['complete']: function called on complete, remember that the file can be successfully
		 *				downloaded or have an error, look at the event.status or use the "success" and "error" functions
		 *		options['success']: function called on success, request returned an "ok" status (code 200)
		 *		options['error']: function called on error
		 *		options['progress']: function called on progress
		 *		options['skip']: function called when a file is skipped
		 *		options['ordered']: True if you want to execute the complete and success functions in the specified order the fileList
		 *		options['once']: boolean, if file has been already downloaded successfully, the file will be skipped,
		 *				default is False. Note that if the file was previously loaded with an error, the function will
		 *				try another load process even if options['once'] is true.
		 *		options[url]: This is the URL specific options where url is the URL string of the fileList and options[url]
		 *				is the new options you want to apply to the url.
		 * @example load('folder/file.ext') loads the file
		 * @example load(['file1','file2','file3']) loads 'file1', 'file2' and 'file3'
		 * @example load(files, complete) loads the files in the array "files" and call the function "complete"
		 * @example load(files, options) loads the files and initialize with the options object
		 */
		load: function(fileList, complete, options) {
			// do nothing if no fileList
			if (!fileList) return this;

			// init the fileList
			if (this.isString(fileList)) fileList = [fileList];
			if (this.isObject(complete)) {
				options = complete;
				complete = function() {};
			}

			// init the options
			options = options || {};
			options['complete'] = options['complete'] || complete || function() {};
			options['error'] = options['error'] || function() {};
			options['progress'] = options['progress'] || function() {};
			options['skip'] = options['skip'] || function() {};
			options['success'] = options['success'] || function() {};
			options['once'] = options['once'] || false;
			options['ordered'] = options['ordered'] || false;

			var len = fileList.length,
				index = 0,
				stat = {
					loaded: 0,
					progress: 0,
					size: 0,
					allComplete: false,
					allSuccess: false,
					errorCount: 0,
				};

			// loop fileList
			for (; index < len; index++) {

				if (!fileList[index]) continue;

				// init url specific options in urlOptions to store it in yespix.data.file[url]
				if (options[fileList[index]]) {
					var urlOptions = options[fileList[index]];
					urlOptions = urlOptions || {};
					urlOptions['complete'] = urlOptions['complete'] || options['complete'] || complete || function() {};
					urlOptions['error'] = urlOptions['error'] || options['error'] || function() {};
					urlOptions['progress'] = urlOptions['progress'] || options['progress'] || function() {};
					urlOptions['skip'] = urlOptions['skip'] || options['skip'] || function() {};
					urlOptions['success'] = urlOptions['success'] || options['success'] || function() {};
					urlOptions['once'] = urlOptions['once'] || options['once'] || false;
				} else var urlOptions = options;

				//if (this.data.file[fileList[index]]) console.log('index = '+index+', url = '+fileList[index]+', file = '+this.data.file[fileList[index]]+', state = '+this.data.file[fileList[index]].state)
				//else console.log('index = '+index+', url = '+fileList[index]+', file = undefined, state = undefined')
				// if the file already exists and urlOptions['once'] is set to True
				if (urlOptions['once'] && this.data.file[fileList[index]]) {
					// skip the file
					if (this.options['debug']) console.warn('yespix.load: skip the file "' + fileList[index] + '"');
					urlOptions['skip']({
						file: this.data.file[fileList[index]],
						url: fileList[index],
						type: 'skip',
					});
					continue;
				}

				// Setting new variables in urlOptions
				urlOptions.isLastFile = (index == fileList.length - 1);
				urlOptions.isFirstFile = (index == 0);
				urlOptions.fileList = fileList;

				// stat will store the overall progress of the files load
				urlOptions.stat = stat;


				// init the file object if not found with no state 
				if (!this.data.file[fileList[index]]) {
					this.data.file[fileList[index]] = {
						loaded: 0,
						progress: 0,
						size: 0,
						done: false,
						lengthComputable: false,
						options: [],
					};
				}

				// file will now refer to the current file URL object
				var file = this.data.file[fileList[index]];
				//console.log('load :: index = ' + index + ', file=' + file + ', url=' + fileList[index] + ', options=' + file.options + ', state=' + file.state);

				// starting a XMLHttpRequest client only if the file is not currently downloading.
				if (!this.data.file[fileList[index]] // file URL not previously loaded
					|| !this.data.file[fileList[index]].state // file URL has no state 
					|| this.data.file[fileList[index]].state == 'loaded' // file loaded but options['once'] is false
					|| this.data.file[fileList[index]].state == 'error' // file complete with an error
				) {

					// overriding previous file object
					this.data.file[fileList[index]] = {
						state: 'pending',
						loaded: 0,
						progress: 0,
						size: 0,
						done: false,
						lengthComputable: false,
						options: [urlOptions],
						url: fileList[index],
					};

					// start XMLHttpRequest client
					var client = null;

					// create XMLHttpRequest
					if (window.XMLHttpRequest) client = new XMLHttpRequest();
					else if (window.ActiveXObject) {
						var names = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
						for (var i in names) {
							try {
								client = new ActiveXObject(names[i]);
								break;
							} catch (e) {};
						}
						// cancel load, nothing will work
						if (!client) {
							console.error("yespix.load: the browser does not support XMLHTTPRequest");
							return null;
						}
					}

					// add a reference to the yespix object in the XMLHttpRequest client
					client.yespix = this;

					// add URL to the XMLHttpRequest client
					client.url = fileList[index];
					client.file = this.data.file[fileList[index]];
					//console.log('load :: client.file.options=' + client.file.options);

					/**
					 * Extract data from the event and process the progress for the file and the overall progress for
					 * all the files in fileList array
					 * @param {object} e The event object where e.url is the URL of the file loading
					 */
					function progress(e) {


						var file = client.file;
						e.file = file;
						//console.log('progress :: client.url = ' + client.url + ', file=' + file + ', options=' + file.options + ', done=' + file.done);
						//						console.log('progress :: client.file.options='+client.file.options);
						// check if the file is already finished and do not call progress anymore
						if (file.done) {
							e.size = file.size;
							e.totalSize = file.size;
							e.loaded = file.loaded;
							e.progress = file.progress;
							return;
						}


						if (!file.lengthComputable && !e.lengthComputable) {
							// the file did not start download and we dont know its size
							console.log('NOT COMPUTABLE');
							file.state = 'pending';
							file.loaded = 0;
							file.progress = 0;
							file.size = 0;
							file.lengthComputable = false;
						} else {
							// process progress for the file
							console.log('COMPUTABLE');
							file.lengthComputable = true;
							if (file.loaded < e.loaded) file.loaded = e.loaded;
							if (file.size < e.totalSize) file.size = e.totalSize;
							if (file.size > 0) file.progress = parseInt(file.loaded / file.size * 10000) / 100;
							else file.progress = 100;
							if (file.progress > 100) file.progress = 100;
							if (file.progress == 100) file.state = 'loaded';
							else file.state = 'processing';
						}

						var newEvent = {
							size: file.size,
							loaded: file.loaded,
							progress: file.progress,
							lengthComputable: file.lengthComputable,
							state: file.state,
							url: file.url,
							file: file,
						}

						// loop inside file.options
						if (file.options)
							for (var u = 0; u < file.options.length; u++) {

								if (file.options[u]) {
									// init the stat of the file object
									file.options[u].stat.loaded = 0;
									file.options[u].stat.progress = 0;
									file.options[u].stat.size = 0;
									file.options[u].stat.allComplete = true; // init to true and set to false when a file is not complete
									file.options[u].stat.allSuccess = true; // init to true and set to false when a file have an error
									file.options[u].stat.errorCount = 0;

									// process progress for all the files in file.options[].fileList
									if (file.options[u].fileList)
										for (var t = 0; t < file.options[u].fileList.length; t++) {
											var otherFile = client.yespix.data.file[file.options[u].fileList[t]];
											if (otherFile && otherFile.lengthComputable) {
												// file started downloading and might be complete
												file.options[u].stat.loaded += otherFile.loaded;
												file.options[u].stat.size += otherFile.size;
												if (otherFile.loaded < otherFile.size) file.options[u].stat.allComplete = false;
											} else if (otherFile && otherFile.state == 'error') {
												// error
												file.options[u].stat.allSuccess = false;
											} else {
												// file pending
												file.options[u].stat.allComplete = false;
												file.options[u].stat.allSuccess = false;
												file.options[u].stat.errorCount++;
												break
											}
										}
										// set progress to 100% if all files are complete
									if (file.options[u].stat.allComplete == true) file.options[u].stat.progress = 100;
									// process stat progress
									else if (file.options[u].stat.loaded > 0) file.options[u].stat.progress = parseInt(file.options[u].stat.loaded / file.options[u].stat.size * 10000) / 100;
									// no files started, set progress to 0%
									else file.options[u].stat.progress = 0;

								}
							}
						return newEvent;
					}

					client.onreadystatechange = function(e) {
						var file = this.file;

						// currently downloading
						e.url = this.url;
						//console.log('index=' + index + ', fileList=' + fileList[index]);

						// check the state
						var state = this.readyState || e.type;

						//						console.log('avant progress :: url = ' + this.url + ', client.state = ' + state + ', e.size = ' + e.size);

						// process the progress of the file
						var newEvent = progress(e);

						//if (file.lengthComputable) file.state = 'processing';
						console.log('apres progress :: url = ' + newEvent.url + ', client.state = ' + state + ', e.size = ' + newEvent.size);

						// onreadystatechange can be triggered by browsers several times with the same state. To check if the
						// file has already been processed, check the value of file.done
						if (!file.done && (/load|loaded|complete/i.test(state) || state == 4)) {
							// the file is complete, might also returned an error.
							// we do not put the content in the memory because it would take too much space for big files
							newEvent.content = this.responseText;

							newEvent.url = this.url;
							newEvent.status = this.status;
							file.done = true;

							// exclude error HTML status 400 & 500
							if (this.status >= 400) { // @todo this do not handle other error codes like 310 ...
								if (this.yespix.options['debug']) console.error('Could not load the file "' + this.url + '"');
								newEvent.state = file.state = 'error';

								// executes error and complete functions
								for (var t = 0; t < this.file.options.length; t++) {
									newEvent.stat = this.file.options[t].stat;
									newEvent.type = 'error';
									this.file.options[t]['error'](newEvent);
									newEvent.type = 'complete';
									this.file.options[t]['complete'](newEvent);
								}
								this.file.options = [];
								return;
							}

							// executes success and complete functions
							newEvent.state = file.state = 'loaded';
							for (var t = 0; t < this.file.options.length; t++) {
								newEvent.stat = this.file.options[t].stat;
								newEvent.type = 'success';
								this.file.options[t]['success'](newEvent);
								newEvent.type = 'complete';
								this.file.options[t]['complete'](newEvent);
							}
							this.file.options = [];
						}
					}

					client.addEventListener('progress', function(e) {
						if (!file.done) {
							var newEvent = progress(e);

							// executes progress functions
							newEvent.type = 'progress';
							for (var t = 0; t < this.file.options.length; t++) {
								newEvent.stat = this.file.options[t].stat;
								this.file.options[t]['progress'](newEvent);
							}
						}
					}, false);

					// 
					client.open('GET', client.url);
					client.send('');
				} else {
					// If the file object has a state == 'pending' or 'processing', it means it's still downloading and the 
					// current load options will be added to the file object
					if (!file.options || file.options.length == 0) file.options = [urlOptions];
					// or adding the urlOptions to the list
					else file.options.push(urlOptions);
				}

			}
			// end fileList loop

			return this;
		},


		/**
		 * Loads a js script file and execute it
		 * @method js
		 * @param fileList {array|string} Array of the script files to load
		 * @param complete {function} Called when the load of the whole list is complete
		 * @param options {function} Called when a script load throw an error
		 * @use addjs('my/js/file.js');
		 * @use addjs(['file01.js', 'file02.js', 'file03.js'], function() { });
		 * @use addjs(['file01.js', 'file02.js', 'file03.js'], { complete: ... , error: ... , once: true});
		 */
		js: function(fileList, complete, options) {
			var e = null;

			if (!fileList) return this;
			if (this.isString(fileList)) fileList = [fileList];
			if (this.isObject(complete)) {
				options = complete;
				complete = function() {};
			}

			options = options || {};
			options['complete'] = options['complete'] || complete || function() {};
			options['error'] = options['error'] || function() {};
			options['progress'] = options['progress'] || function() {};
			options['success'] = options['success'] || function() {};
			options['skip'] = options['skip'] || function() {};
			options['once'] = options['once'] || false;
			options['ordered'] = options['ordered'] || false;

			success = options['success'];

			if (!options['ordered']) {
				options['success'] = function(e) {
					eval(e.content);
					success(e);
				};
				return this.load(fileList, options);
			} else {
				var token = 0;
				options['success'] = function(e) {
					if (fileList[token] == e.file) {
						eval(e.content);
						success(e);
						token++;
						while (fileList[token]) {
							if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
								eval(this.data.file[fileList[token]].content);
								success(this.data.file[fileList[token]].eventComplete);
								token++;
							} else break;
						}
					} else this.data.file[fileList[token]].eventComplete;
				};

				return this.load(fileList, options);
			}
		},

		/**
		 * @method css
		 * Load a css file and add it to the document
		 * @param list {array|string} Array of the script files to load
		 * @param complete {function} Called when the load of the whole list is complete
		 * @param error {function} Called when a script load throw an error
		 * @param progress {function} Called on the progress of each script load
		 * @chainable
		 */
		css: function(fileList, complete, options) {

			var e = null;

			if (!fileList) return this;
			if (this.isString(fileList)) fileList = [fileList];
			if (this.isObject(complete)) {
				options = complete;
				complete = function() {};
			}
			//console.log('css : fileList = ' + fileList);

			options = options || {};
			options['complete'] = options['complete'] || complete || function() {};
			options['error'] = options['error'] || function() {};
			options['progress'] = options['progress'] || function() {};
			options['skip'] = options['skip'] || function() {};
			options['success'] = options['success'] || function() {};
			options['once'] = false;
			options['ordered'] = options['ordered'] || false;
			options['document'] = options['document'] || this.document || document;

			complete = options['complete'];
			var error = options['error'];

			if (!options['ordered']) {
				//console.log('addcss :: not ordered');
				options['complete'] = function(e) {
					//console.log('addcss :: complete css, e.file = '+e.file);
					//yp.dump(e, 'addjs :: complete');

					var s = document.createElement('link');
					s.type = 'text/css';
					s.rel = 'stylesheet';
					s.href = e.url;
					s.async = true;
					delete s.crossOrigin;
					document.getElementsByTagName('head')[0].appendChild(s);

					if ('sheet' in s) {
						sheet = 'sheet';
						cssRules = 'cssRules';
					} else {
						sheet = 'styleSheet';
						cssRules = 'rules';
					}

					var interval_id = setInterval(function() { // start checking whether the style sheet has successfully loaded
						try {
							//console.log('len = '+s[sheet][cssRules].length);
							if (s[sheet] && s[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
								clearInterval(interval_id); // clear the counters
								clearTimeout(timeout_id);
								//console.log('addcss :: load link success');
								complete(e);
							}
						} catch (e) {} finally {}
					}, 10), // how often to check if the stylesheet is loaded
						timeout_id = setTimeout(function() { // start counting down till fail
							clearInterval(interval_id); // clear the counters
							clearTimeout(timeout_id);
							//document.getElementsByTagName('head').removeChild(s); // since the style sheet didn't load, remove the link node from the DOM
							error(e); // fire the callback with success == false
						}, 15000); // how long to wait before failing
				};
				return this.load(fileList, options);
			} else {
				var token = 0;
				options['complete'] = function(e) {
					//						console.log('complete::: token ='+token+', url = '+fileList[token]);
					if (fileList[token] == e.url) {
						//console.log('complete css '+e.file);
						var s = document.createElement('link');
						s.type = 'text/css';
						s.rel = 'stylesheet';
						s.href = e.url;
						s.async = true;
						delete s.crossOrigin;
						document.getElementsByTagName('head')[0].appendChild(s);

						if ('sheet' in s) {
							sheet = 'sheet';
							cssRules = 'cssRules';
						} else {
							sheet = 'styleSheet';
							cssRules = 'rules';
						}

						var interval_id = setInterval(function() { // start checking whether the style sheet has successfully loaded
							try {
								if (s[sheet] && s[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
									clearInterval(interval_id); // clear the counters
									clearTimeout(timeout_id);
									complete(e);
									token++;
									while (fileList[token]) {
										if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
											eval(this.data.file[fileList[token]].content);
											complete(this.data.file[fileList[token]].eventComplete);
											token++;
										} else break;
									}
								}
							} catch (e) {} finally {}
						}, 20), // how often to check if the stylesheet is loaded
							timeout_id = setTimeout(function() { // start counting down till fail
								clearInterval(interval_id); // clear the counters
								clearTimeout(timeout_id);
								document.getElementsByTagName('head').removeChild(s); // since the style sheet didn't load, remove the link node from the DOM
								error(e); // fire the callback with success == false
								token++;
								while (fileList[token]) {
									if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
										eval(this.data.file[fileList[token]].content);
										complete(this.data.file[fileList[token]].eventComplete);
										token++;
									} else break;
								}
							}, 15000); // how long to wait before failing
					} else this.data.file[e.file].eventComplete = e;
				};

				return this.load(fileList, options);
			}

			return this.load(fileList, options);
		},



		/**
		 ************************************************************************************************************
		 ************************************************************************************************************
		 * TIMER, TICK and FPS
		 */


		frameIndex: 0, // frame
		frameTime: 0,
		frameMs: 1, // milliSecPerFrame
		frameRequest: null, // onFrame
		frameRequestId: null, // requestId
		frameTick: null,
		frameTickNext: (new Date).getTime(), // nextGameTick

		time: +new Date(), // currentTime
		fps: 60,

		timerStart: function() {
			// Init the requestAnimationFrame in this.frameRequest
			if (!this.frameRequest) this.frameRequest = (function() {
				return window.requestAnimationFrame ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame ||
					window.oRequestAnimationFrame ||
					window.msRequestAnimationFrame ||
					function(callback, element) {
						return window.setInterval(callback, 1000 / this.fps);
				};
			})();

			//console.log('timer.start, onFrame = '+this.onFrame);

			this.frameMs = 1000 / this.fps;
			var yespix = this;
			this.frameTick = function() {
				yespix.timerStep();
				if (yespix.frameTick) yespix.frameRequest.call(window, yespix.frameTick);
			};
			this.frameTick();

			// trigger the timerStart event
			this.trigger("timerStart");
		},

		timerStop: function() {
			// if Cancel the setInterval
			clearInterval(this.frameRequestId);
			this.frameTick = null;

			// trigger the timerStop event
			yespix.trigger("timerStop");
		},

		timerStep: function() {
			loops = 0;
			this.frameTime = +new Date();
			if (this.frameTime - this.frameTickNext > 60 * this.frameMs) {
				this.frameTickNext = this.frameTime - this.frameMs;
			}
			while (this.frameTime > this.frameTickNext) {
				this.frameIndex++;
				this.trigger("enterFrame", {
					frameIndex: this.frameIndex
				});
				this.frameTickNext += this.frameMs;
				loops++;
			}
			if (loops) {
				this.trigger("draw", {
					frameIndex: this.frameIndex
				});
				this.trigger("exitFrame", {
					frameIndex: this.frameIndex
				});
			}
		},

		currentFps: function() {

		},

		getFps: function() {
			return this.fps;
		},

		setFps: function(fps) {
			this.fps = fps;
			this.frameMs = 1000 / this.fps;
		},



		/**
		 ************************************************************************************************************
		 ************************************************************************************************************
		 * MEDIA SUPPORT
		 */

		/**
		 * Media support detection. The function support(type) return true if the requested audio or video is supported
		 * by the current browser.
		 * @method support
		 * @example support('audio') detects if audio is supported
		 * @example support('.mp3') detects if mp3 extension is supported, assuming ".mp3" file has an audio/mpeg mimetype
		 * @example support('audio/wav') detects if mimetype audio/wav is supported
		 * @example support('audio/ogg; codecs="vorbis"') detects if mimetype audio/ogg is supported with codec Vorbis.
		 * Note: Some browsers are completely ignoring the codecs and always return True
		 *
		 */
		support: function(type) {
			//console.log('yespix.support :: type='+type);
			if (!type) return null;
			var types = type.split('/');

			// type can be a media type or an extension
			if (types.length == 1) {
				// check if the type is a media type
				if (this.data.support.types[type]) {
					if (!this.data.support.elements[type]) {
						this.data.support.elements[type] = document.createElement(type);
					}
					return !!this.data.support.elements[type].canPlayType;
				}
				// check if the type is an extension
				if (this.data.support.extensions[type]) {
					type = this.data.support.extensions[type];
					types = type.split('/');
				} else return null;
			}


			if (this.data.support[types[0]] != undefined && this.data.support[types[0]][types[1]] != undefined) return this.data.support[types[0]][types[1]];

			// create element if needed
			if (this.data.support.elements[types[0]] == undefined) {
				//console.log('type='+type+', types[0]='+types[0]+', types[1]='+types[1]);
				this.data.support.elements[types[0]] = document.createElement(types[0]);
				if ( !! this.data.support.elements[types[0]] == false) this.data.support.elements[types[0]] = false;
			}

			var e = this.data.support.elements[types[0]];
			if (!e || !! e.canPlayType == false) return false;

			var str = e.canPlayType(type);
			if (str.toLowerCase() == 'no' || str == '') this.data.support[types[0]][types[1]] = false;
			else this.data.support[types[0]][types[1]] = true;

			return this.data.support[types[0]][types[1]];
		},


		/**
		 ************************************************************************************************************
		 ************************************************************************************************************
		 * BROWSERS SUPPORT
		 */


		isMobile: function() {
			if (!this.data.browser.initiated) this.browser();
			return this.data.browser.mobile;
		},

		browser: function(type) {
			var yespix = this;

			if (!yespix.data.browser.initiated) {
				function findBrowser(str) {
					var data = yespix.data.browser.browserList;
					for (var i = 0; i < data.length; i++) {
						if (str.indexOf(data[i].subString) != -1) {
							yespix.data.browser.found = data[i];
							return data[i].identity;
						}
					}
				}

				function findOs(str) {
					var data = yespix.data.browser.osList;
					for (var i = 0; i < data.length; i++) {
						if (str.indexOf(data[i].subString) != -1) {
							yespix.data.browser.found = data[i];
							return data[i].identity;
						}
					}
				}

				function findVersion(str) {
					if (!yespix.data.browser.found) return;
					var find = yespix.data.browser.found.version || yespix.data.browser.infos.name;
					var index = str.indexOf(find);
					if (index == -1) return;
					return str.substring(index + find.length + 1).split(' ').shift();
				}

				function findMobile(str) {
					if (!yespix.data.browser.found) return;
					return /iPhone|iPod|Android|opera mini|blackberry|palm os|palm| Mobile|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|windows ce|opera mobi| smartphone;|;iemobile/i.test(str);
				}

				yespix.data.browser.infos.initiated = true;
				yespix.data.browser.infos.name = findBrowser(navigator.userAgent) || findBrowser(navigator.vendor) || "Unknown browser";
				yespix.data.browser.infos.version = findVersion(navigator.userAgent) || findVersion(navigator.appVersion) || "Unknown version";
				if (yespix.data.browser.infos.version != "Unknown version") {
					var version = yespix.data.browser.infos.version;
					yespix.data.browser.infos.versionMajor = parseInt(version);
					if (version.indexOf(".") != -1) yespix.data.browser.infos.versionMinor = version.substring(version.indexOf(".") + 1);
					else yespix.data.browser.infos.versionMinor = '';
				}
				yespix.data.browser.infos.os = findOs(navigator.platform) || findOs(navigator.userAgent) || "Unknown OS";
				yespix.data.browser.infos.mobile = findMobile(navigator.userAgent) || findMobile(navigator.platform) || false;
			}
			yespix.data.browser.initiated = true;

			if (type) return yespix.data.browser.infos[type];
			return yespix.data.browser.infos;
		},



		/**
		 ************************************************************************************************************
		 ************************************************************************************************************
		 * ENTITIES
		 */



		entityRootClassname: '',

		/**
		 * Stores some informations about the entity classes
		 * @type {Object}
		 */
		entityClasses: {}, // entity classes

		/**
		 * List of entity instances
		 * @type {Object}
		 * @example entityInstances[entity._id] refers to the entity with integer id "entity._id"
		 * @example entityInstances[classname] refers to an array of entities directly with the class or with an ancestor with the class name "classname"
		 * @example entityInstances[''] refers to an array of all the entity instances
		 */
		entityInstances: {},

		entityNextId: 1,
		entityNextClassId: 1,

		/**
		 * Find an entity or multiple entities from the selector, possibly executes a function fn and returns a bunch of
		 * entities. The function fn is executed in the context of each entities, meaning that inside the function "this"
		 * will refer to an entity.
		 * @exemple find('')					// find all the entities
		 * @exemple find('test', function(e) { alert(e._id); }) // find entities with name "test" and show its id
		 * @exemple find({}, fn)				// find all the entities and executes "fn" function
		 * @example find('test', fn)			// find the entities with name "test"
		 * @example find('lady,gaga', fn)		// find the entities with name "lady" OR "gaga"
		 * @example find('.image', fn)			// find the entities with class "image"
		 * @example find('.sound test', fn)		// find the entities with class "sound" AND name
		 * @example find(4, fn)					// find the entities with the id 4 (number), only one since the id is unique
		 * @example find('#4', fn)				// find the entities with the id 4 (number), only one since the id is unique
		 * @example find('test, #2, .image', fn) // find the entities with name "test" OR id 2 OR class "image"
		 * @exemple find({_name: 'test'}, fn)	// find the entities with name "test", only one since the entity name is unique
		 * @exemple find({_name: /te/}, fn)		// find the entities with name corresponding to the regex /te/
		 * @exemple find({_name: ['lady', 'gaga']}, fn) // find the entities with name "lady" or "gaga"
		 * @return {bunch} YESPIX bunch of entities, an array of entities on which you can call a function on all entities with
		 *		bunch.function(args), access the first entity with bunch[0] and access a property with bunch[0].property
		 */
		find: function(selector, fn) {
			//console.log('find: properties:'+properties+', fn:'+fn);

			// init selector and properties to find
			var properties = {};
			if (this.isString(selector)) properties = this.selectorInit(selector);
			else if (this.isObject(selector)) properties = selector;
			if (this.isArray(selector)) {
				var result = [];
				for (var n in selector) result = result.concat(this.find(selector[n]));
				return this.bunch(result);
			}

			//this.dump(properties, 'find: properties');

			var propMatch = this.pLength(properties);
			var result = [];

			// @todo search with the classname array instead of parsing all the entities
			for (var t = 0; t < this.entityInstances[''].length; t++) {
				var count = 0;
				//console.log('find: checking entity ['+t+'] with name "'+this.instances[t]._name+'"');
				for (var n in properties) {
					if (this.entityInstances[t] !== undefined && this.entityInstances[t][n] !== undefined && this.selectorCompare(this.entityInstances[t][n], properties[n])) count++;
					//console.log('property "'+n+'", propMatch = '+propMatch+', count = '+count);
					if (count >= propMatch) {
						//console.log('find: adding entity to result');
						result.push(this.entityInstances[t]);
					}
				}
			}
			//console.log('find: result length = '+result.length);

			if (fn) this.each(result, fn);

			return this.bunch(result);
		},

		selectorInit: function(selector) {
			// multiple selectors with ','
			if (selector.indexOf(',') != -1) {
				var result = [];
				var selectors = selector.split(',');
				var result = [];
				for (var t in selectors) result = result.push(this.selectorInit(properties[t]));
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
		},

		selectorCompare: function(entityValue, value) {
			var type1 = this.getType(entityValue);
			var type2 = this.getType(value);
			//console.log('entityValue = '+entityValue+', type1 = '+type1+', value = '+value+', type2 = '+type2);
			if (type1 == type2) return entityValue === value;

			return false;
		},

		selectorType: function(str) {
			if (str[0] == '.') return '_class';
			if (str[0] == '#') return '_id';
			return 'name';
		},

		selectorValue: function(str) {
			if (str[0] == '.' || str[0] == '#') return str.substr(1, str.length);
			return str;
		},


		/**
		 * Convert an array of entities into a bunch of entities.The bunch object is an array of entities on which you can call a function on all entities with
		 *		bunch.function(args), access the first entity with bunch[0] and access a property with bunch[0].property. The bunch object also have all the
		 *		array functions and properties such as length, concat ...
		 * @todo
		 */
		bunch: function(list) {

			return list;
		},


		/**
		 *
		 * @param  {[type]} object     [description]
		 * @param  {[type]} properties [description]
		 * @return {[type]}            [description]
		 */
		mixin: function(object, properties) {
			for (fn in properties) {
				//				if (properties.hasOwnProperty(fn) && fn != '__mixin')
				{
					//						console.log('mixin :: copy property "'+fn+'" into object');
					object[fn] = properties[fn];
				}
			}
			//console.log('mixin :: end mixin');
		},


		ancestors: function(name) {
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
		},


		define: function(name, list, properties) {
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
				classname: name,
				properties: properties,
			};

			// adding the ancestors
			for (var t = 0; t < list.length; t++) {
				if (list[t] != '') {
					if (!this.entityClasses[list[t]]) {
						console.warn('define :: cannot find the entity class name "' + list[t] + '", skipping');
					} else if (list[t] == name) {
						console.warn('define :: entity class cannot add itself to ancestors, skipping');
					} else {
						//							console.log('register :: adding ancestors "'+list[t]+'": ');
						this.entityClasses[name].ancestors = this.entityClasses[name].ancestors.concat(this.ancestors(list[t]));
						//							this.entityClasses[name].ancestors.push(list[t]);
						//this.mixin(name, this.entityClasses[list[t]]);
						//							console.log('register :: ancestors are now "'+this.entityClasses[name].ancestors.join(', ')+'": ');
					}
				}
			}

			this.entityClasses[name].ancestors = this.unique(this.entityClasses[name].ancestors);

			this.trigger('define', {
				class: this.entityClasses[name]
			});

			return this;
			//console.log('entity.define :: entity class name "'+name+'" added');
			//console.log('entity.define :: ancestors = "'+this.entityClasses[name].ancestors.join(', ')+'"');
			//console.log('----');
		},


		spawn: function(name, properties) {
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

			//yespix.dump(properties, 'entity.spawn :: classname "'+name+'" with properties:');
			//yespix.dump(this.entityClasses[name], 'spawn :: classname "'+name+'" with class:');

			var entity = {};
			//			var init = [];
			//			if (yespix.isFunction(properties['init'])) init.unshift(properties['init'])

			//if (yespix.isFunction(this.entityClasses[name].properties['init'])) init.unshift(this.entityClasses[name].properties['init'])


			//console.log('entity.spawn :: mixin with '+this.entityClasses[name].ancestors.length+' ancestors');
			// mixin with the ancestors
			for (var t = 0; t < this.entityClasses[name].ancestors.length; t++) {
				//console.log('entity.spawn :: ancestor name "'+this.entityClasses[name].ancestors[t]+'"');
				var c = this.entityClasses[this.entityClasses[name].ancestors[t]];
				if (c) {
					this.mixin(entity, c.properties);
					//console.log('entity.spawn :: copy ancestor "'+this.entityClasses[name].ancestors[t]+'"');
					//if (yespix.isFunction(c.properties['init'])) init.unshift(c.properties['init'])
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

			// Trigger some events to dispatch the spawn of an entity
			this.trigger('spawn', {
				entity: entity
			});
			this.trigger(name + ':spawn', {
				entity: entity
			});
			if (entity._ancestors.length > 0)
				for (t = 0; t < entity._ancestors.length; t++) this.trigger(entity._ancestors[t] + ':spawn', {
					entity: entity
				});

			return entity;
		},


		/**
		 *
		 * A reference of the entity will be the inserted in:
		 * yespix.entityInstances[''] 				at the index entity._instances[''] (integer)
		 * yespix.entityInstances[entity._id] 		at the index entity._id (integer)
		 * yespix.entityInstances[entity._class]	at the index entity._instances[entity._class]
		 * yespix.entityInstances[ancestorClass]	at the index entity._instances[ancestorClass]
		 */
		instanceAdd: function(entity) {
			// the entity must not be in any instances list because we are overriding his _instances object
			if (entity._instances) this / instanceRemove(entity);
			entity._instances = {};


			// insert reference in the global instances list
			if (!this.entityInstances['']) {
				this.entityInstances[''] = [entity];
				entity._instances[''] = 0;
			} else {
				this.entityInstances[''].push(entity);
				entity._instances[''] = this.entityInstances[''].length - 1;
			}
			// insert reference with the entity Id
			this.entityInstances[+entity._id] = entity;

			// insert reference in the class instances list for its own class name
			if (!this.entityInstances[entity._class]) {
				this.entityInstances[entity._class] = [entity];
				entity._instances[entity._class] = 0;
			} else {
				this.entityInstances[entity._class].push(entity);
				entity._instances[entity._class] = this.entityInstances[entity._class].length - 1;
			}

			// insert a reference in the class instances list for all its ancestors
			if (entity._ancestors.length > 0)
				for (var t = 0; t < entity._ancestors.length; t++) {
					if (!this.entityInstances[entity._ancestors[t]]) {
						this.entityInstances[entity._ancestors[t]] = [entity];
						entity._instances[entity._ancestors[t]] = 0;
					} else {
						this.entityInstances[entity._ancestors[t]].push(entity);
						entity._instances[entity._ancestors[t]] = this.entityInstances[entity._ancestors[t]].length - 1;
					}
				}
		},

		instanceRemove: function(entity) {
			// remove reference from the global instances list
			if (this.entityInstances['']) this.entityInstances[''].splice(entity._instances[''], 1);

			// remove reference with the entity Id
			delete this.entityInstances[+entity._id];

			// remove reference from the class instances list for its own class name
			if (this.entityInstances[entity._class]) this.entityInstances[entity._class].splice(entity._instances[entity._class], 1);

			// insert a reference in the class instances list for all its ancestors
			if (entity._ancestors.length > 0)
				for (var t = 0; t < entity._ancestors.length; t++)
					if (this.entityInstances[entity._ancestors[t]]) this.entityInstances[entity._ancestors[t]].splice(entity._instances[entity._ancestors[t]], 1);
		},

		/**
		 * Return True if the entity name have a defined class
		 * @function isDefined
		 * @param {string} name Name of the entity class
		 * @return {boolean} True if the entity classname exists
		 */
		isDefined: function(name) {
			return !!this.entityClasses[name];
		},

		/**
		 * Returns True if the entity class possesses all the ancestors
		 * @function hasAncestors
		 * @param {string} name Name of the entity
		 * @param {array|string} ancestors A string of ancestor names separeted by "," or an array
		 *
		 */
		hasAncestors: function(classname, ancestors) {
			if (!this.isDefined(name)) return null;
			if (this.isString(ancestors)) ancestors = [ancestors];
			for (var t = 0; t < ancestors.length; t++)
				if (!this.inArray(this.entityClasses[name].ancestors, ancestors[t])) return false;
			return true;
		},

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
		call: function(entity, fn, ancestors, params) {
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

			//yespix.dump(result, 'call result');

			return result;
		},


		/**
		 ************************************************************************************************************
		 * CHILDREN
		 */

		/**
		 * @todo  moving rotating the parent will affect the children
		 * @param {entity} parent The parent
		 * @param {entity|array} child An entity to attached or an array of entities
		 * @example attach(entity1, entity2) attaches entity2 to entity1
		 * @example attach(entity1, [entity2, entity3 ...]) attaches multiple entities to entity1
		 */
		attach: function(parent, child) {
			// multiple children
			if (this.isArray(child)) {
				for (var t = 0; t < child.length; t++) this.attach(parent, child[t]);
				return this;
			}

			// try to attach an entity already attached to the parent
			if (child._parent == parent) return null;

			// attach
			if (!parent._children) parent._children = [child];
			else parent._children.push(child);

			if (child._parent) this.detach(child._parent, child);
			child._parent = parent;
			return this;
		},

		detach: function(parent, child) {
			// detach everything 
			if (!child) {
				if (parent._children) {
					for (var t = 0; t < parent._children.length; t++) parent._children[t]._parent = null;
					parent._children = null;
				}
				return this;
			}

			// detach all the children
			if (this.isArray(child)) {
				for (var t = 0; t < child.length; t++) this.detach(parent, child[t]);
				return this;
			}

			// try to detach an entity already detached
			if (child._parent != parent) return null;

			// detach one child
			child._parent = null;
			for (var t = 0; t < parent._children.length; t++)
				if (parent._children[t] == child) {
					parent._children.splice(t, 1);
					break;
				}
			return this;
		},

		/**
		 ************************************************************************************************************
		 * INPUT KEYBOARD AND MOUSE
		 */


		/**
		 * Returns True if some keys are pressed, hold, down or up for this frame. Note: the key arrays are reset every frame, only the "hold"
		 * keys are kept until "keyup" event. Depending on the framerate, you will sometimes miss the "pressed", "up" and "down" event. If you
		 * want to trigger an event on a key, it's better to use yespix.on('keypress'), yespix.on('keydown') or yespix.on('keyup'). The operators
		 * AND "-" and OR "|" can be used in the selector.
		 * @param  {int|string} s The selector or the key code of the character. Selector can be special keys ("shift", "ctrl" ...), multiple keys separated
		 *                        with operator AND "-" ("ctrl-a", "a-d-g") or operator OR "|" ("a|2", "g|h|j"). Operator AND "-" have the priority
		 *                        over "|", meaning "a|b-c" will be parsed like "a" || ("b" && "c"). If looking for character "|" and "-", the character
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
		key: function(s, type) {
			type = type || 'hold';
			//console.log('type = '+type);
			if (this.isString(s)) {
				if (s.indexOf('|') != -1 && s.charAt(s.indexOf('|') - 1) != '\\' && s.length > 1) {
					var arr = s.split('|', 2);
					for (var t = 0; t < arr.length; t++)
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
				for (var t = 0; t < s.length; t++)
					if (!this.key(s[t], type)) return false;
				return true;
			}
			if (this.isInt(s)) {
				if (type == 'hold' && this.data.key['up'][s]) return true;
				return !!this.data.key[type][s];
			}
			return false;
		},

		specialKey: function(s, type) {
			type = type || 'hold';
			if (type == 'hold' && this.data.key['up'][this.data.key.special[s.toLowerCase()]]) return true;
			return !!this.data.key[type][this.data.key.special[s.toLowerCase()]];
		},


		/**
		 ************************************************************************************************************
		 * LISTEN VARIABLE CHANGES
		 */

		listen: function(obj, pname) {
			if (Object.defineProperty) {
				//				var value = obj[pname];
				//				console.log('value = '+value);
				Object.defineProperty(obj, 'x', {
					set: function(v) {
						console.log('v=' + v);
						obj.trigger('change:' + pname, {
							'v': v
						});
						return v;
					},
					configurable: true
				});
				//				obj[pname] = value;
				//				console.log('value = '+value+', obj[pname] = '+obj[pname]);
			} else {
				console.log('NO defineProperty');
			}
		},
	};


	/*
	 
	 
	 */


	/**
	 *
	 * @module entity
	 *
	 */

	function initEntities(yespix) {



		/**
		 ************************************************************************************************************
		 * @class entity.base
		 */

		yespix.define('base', {
			/**
			 * Entity class name initiated on the spawn of the entity
			 * @property _class
			 * @type string
			 */
			_class: '',

			/**
			 * Array of ancestor names initiated on the spawn of the entity
			 * @property _ancestors
			 * @type array
			 */
			_ancestors: [],

			/**
			 * Reference to the scene of the entity initiated by the scene entity
			 * @property _scene
			 * @type object
			 */
			_scene: null,

			/**
			 * Unique integer of the entity instance
			 * @property _id
			 * @type integer
			 */
			_id: 1,

			/**
			 * Array of children reference
			 * @property _children
			 * @type array
			 */
			_children: null,

			/**
			 * Reference to the parent
			 * @property _parent
			 * @type object
			 */
			_parent: null,

			/**
			 * Set True if the entity is active
			 * @property isActive
			 * @type boolean
			 * @default true
			 */
			isActive: true,

			/**
			 * Set True if the entity is visible
			 * @property isVisible
			 * @type boolean
			 * @default false
			 */
			isVisible: false,

			/**
			 * Set True if the entity is global
			 * @property isGlobal
			 * @type boolean
			 * @default false
			 */
			isGlobal: false,

			/**
			 * Name of the entity, not unique
			 * @property name
			 * @type string
			 */
			name: '',


			///////////////////////////////// Main functions ////////////////////////////////

			/**
			 * Return the array of assets used for the entity. The original code of the function is called for the class name of the entity and each ancestor classes
			 */
			assets: function() {
				return [];
			},

			/**
			 * Initilize the entity object. The original code of the function is called for the class name of the entity and each ancestor classes
			 */
			init: function(properties) {
				return true;
			},

			attach: function(entity) {
				yespix.attach(this, entity);
				return this;
			},

			detach: function(entity) {
				yespix.detach(this, entity);
				return this;
			},

			trigger: function(name, e) {
				yespix.trigger(this, name, e);
				return this;
			},

			on: function(name, callback) {
				yespix.on(this, name, callback);
			},

			off: function(name, callback) {
				yespix.off(this, name, callback);
			},

			destroy: function() {
				this._deleting = true;
				this.isActive = false;
				this.isVisible = false;

				if (this._children) {
					for (var t = 0; t < this._children.length; t++) {
						if (this._children[t] && !this._children[t].deleting) {
							this._children[t].destroy();
						}
					}
				}

				yespix.instanceRemove(this);
			}

		});
		yespix.entityRootClassname = 'base';


		/**
		 * @class entity.gfx
		 */
		yespix.define('gfx', {
			_changed: false,

			isReady: false,

			x: 0,
			y: 0,
			z: 0,
			zGlobal: 0,
			alpha: 0,
			origin: {
				x: 0,
				y: 0,
			},
			rotation: 0,


			_flipX: false,
			_flipY: false,

			///////////////////////////////// Main functions ////////////////////////////////

			asset: function() {
				return [];
			},

			// initilize object
			init: function() {
				var lp =
					[{
					name: 'x',
					init: 0,
				}, {
					name: 'y',
					init: 0,
				}, {
					name: 'z',
					init: 0,
				}, {
					name: 'zGlobal',
					init: 0,
				}, {
					name: 'rotation',
					init: 0,
				}, {
					name: 'alpha',
					init: 1.0,
				}, {
					name: 'origin',
					init: {
						x: 0,
						y: 0
					},
				}, {
					name: '_numChildren',
					init: 0,
				}, ];
				//yespix.listen(this.lp);
				//console.log('init gfx!');

				return true;
			},

			getContext: function() {
				if (this._context) {
					//console.log('getContext : context exists');
					return this._context;
				}
				//console.log('getContext : looking for context');
				if (this._parent == null) {
					(function(obj) {
						//					var obj = this;
						yespix.find('.canvas', function() {
							if (!obj._context) obj._context = this.context;
							//console.log('find canvas!');
						});
					})(this);
				}
				//console.log('getContext : _context = '+this._context);
			},

		});



		/**
		 * ams_entity_object : abstract base entity with no visual
		 */
		yespix.define('sound', {
			// sounds
			sounds: [],

			soundDefaults: {
				isInitiated: false, // true if soundInit() was called
				isSupported: false, // 
				isLoaded: false,
				isReady: false,
				volume: 1.0,
				duration: 0,
				formats: [],
				src: '',
				mimeType: '',
				loop: false,
				autoplay: false,
				element: null,
				document: yespix.document,
				assets: this.assets,
			},

			init: function() {
				var entity = this,
					count = 1;

				if (yespix.isString(this.sounds)) this.sounds = [{
					src: this.sounds,
				}];
				//console.log('init sound: array of '+this.sounds.length+' sounds');

				for (var t = 0; t < this.sounds.length; t++) {
					// init the default properties
					//console.log('init the sound ['+t+'] with the default properties');
					for (var n in this.soundDefaults) {
						//console.log('copy property '+n+' : sound = '+this.sounds[t][n]+', default = '+this.soundDefaults[n]);
						this.sounds[t][n] = this.sounds[t][n] || this.soundDefaults[n];
						//console.log('init as '+this.sounds[t][n]);
					}
					if (this.sounds[t].name === '') this.sounds[t].name = 'sound' + count++;
				}

				/**
				 * returns a sound and executes a function on it
				 * @function sound
				 * @example sound() returns the first sound
				 * @example sound('test') returns the sound with name "test"
				 * @example sound('/play') plays the first sound and returns it
				 * @example sound('test/stop') stop the sound with name "test"
				 * @example sound(1) returns the sound at index 1 (index is from 0 to sounds.length-1)
				 * @example sound({name: 'test' }) returns the sound with name "test"
				 * @example sound({ volume: 0.7 }) return the first sound with volume set to 0.7
				 */
				this.sound = function(properties) {
					//console.log('sound :: properties = '+properties);

					var fn = '';
					if (properties == undefined)
						if (this.sounds[0]) return this.soundInit(this.sounds[0]);
						else return null;
					if (typeof properties == 'string') {
						properties = {
							name: properties
						};
						if (properties.name.indexOf('/') != -1) {
							var list = properties.name.split('/');
							properties.name = list[0];
							fn = list[1];
							if (list[0] == '') return this.soundInit(this.sounds[0])[fn]();
						}
					} else if (Object.isInt(properties))
						if (this.sounds[properties]) return this.soundInit(this.sounds[properties]);
						else return null;

					var max = Object.keys(properties).length;
					var count = 0;
					for (var t = 0; t < this.sounds.length; t++) {
						//console.log('checking sound ['+t+'] with name "'+this.sounds[t].name+'"');
						for (var n in properties) {
							if (this.sounds[t][n] !== undefined && properties[n] == this.sounds[t][n]) count++;
							//console.log('property "'+n+'", max = '+max+', count = '+count);
							if (fn != '') return this.soundInit(this.sounds[t])[fn]();
							if (count >= max) return this.soundInit(this.sounds[t]);
						}
					}
					return null;
				};

				this.soundInit = function(sound) {
					parent = this;

					// no sound, init all the sounds
					if (sound == undefined) {
						for (var t = 0; t < this.sounds.length; t++) this.soundInit(this.sounds[t]);
						return true;
					}

					// sound already initiated
					if (sound.isInitiated) return sound;

					sound.isInitiated = true;
					sound.element = document.createElement("audio");

					// alias of yespix.support
					sound.support = function(format) {
						if (format == undefined) return false;
						return yespix.support(format);
					};

					// add source to the audio element and to the assets list
					sound.changeSource = function(source) {
						if (this.support('.' + yespix.getExtension(source))) {
							//yespix.dump(parent);
							this.isSupported = true;
							this.element.src = source;

							if (this.volume < 0) this.volume = 0;
							else if (this.volume > 1) this.volume = 1;
							this.element.volume = this.volume;
							return true;
						}
						return false;
					};

					sound.load = function() {
						if (!this.isSupported) return this;
						this.element.load();
						return this;
					};

					sound.play = function() {
						if (!this.isSupported) return this;
						this.element.play();
						return this;
					};

					sound.isPlaying = function() {
						if (!this.isSupported) return null;
						return !this.element.paused;
					};

					sound.pause = function() {
						if (!this.isSupported) return this;
						this.element.pause();
						return this;
					};

					sound.isPaused = function() {
						if (!this.isSupported) return null;
						return !!this.element.paused;
					};

					sound.mute = function() {
						if (!this.isSupported) return null;
						this.element.muted = true;
						return this;
					};

					sound.unmute = function() {
						if (!this.isSupported) return this;
						this.element.muted = false;
						return this;
					};

					sound.muteToggle = function() {
						if (!this.isSupported) return this;
						if (this.isMuted()) this.unmute();
						else this.mute();
						return this;
					};

					sound.isMuted = function() {
						if (!this.isSupported) return null;
						return this.element.muted;
					};

					sound.restart = function() {
						if (!this.isSupported) return this;
						this.stop().play();
						return this;
					};

					sound.stop = function() {
						if (!this.isSupported) return this;
						this.element.pause();
						this.setTime(0);
						return this;
					};

					sound.setVolume = function(n) {
						if (!this.isSupported) return this;
						this.volume = n;
						if (this.volume < 0) this.volume = 0;
						else if (this.volume > 1) this.volume = 1;
						this.element.volume = this.volume;
						return this;
					};

					sound.volumeUp = function() {
						if (!this.isSupported) return this;
						this.volume -= 0.1;
						if (this.volume < 0) this.volume = 0;
						else if (this.volume > 1) this.volume = 1;
						this.element.volume = this.volume;
						return this;
					};

					sound.volumeDown = function() {
						if (!this.isSupported) return this;
						this.volume += 0.1;
						if (this.volume < 0) this.volume = 0;
						else if (this.volume > 1) this.volume = 1;
						this.element.volume = this.volume;
						return this;
					};

					sound.setTime = function(time) {
						if (!this.isSupported) return this;
						this.element.currentTime = time;
						return this;
					};

					sound.isEnded = function() {
						if (!this.isSupported) return null;
						return this.element.ended;
					};

					//yespix.dump(sound, 'sound');
					if (sound.src !== undefined && sound.src !== '') {
						if (yespix.isArray(sound.src)) {
							// check every sources to add the source element
							for (var t = 0; t < sound.src.length; t++)
								if (sound.src[t] && !sound.isSupported) sound.changeSource(sound.src[t]);
						} else if (yespix.isArray(sound.formats) && sound.formats.length > 0) {
							// check every formats to add the source element
							for (var t = 0; t < sound.formats.length; t++)
								if (sound.formats[t] && !sound.isSupported) sound.changeSource(sound.src + '.' + sound.formats[t]);
						} else if (yespix.isString(sound.src) && sound.src != '') {
							// add the source
							sound.changeSource(sound.src);
						}
					}
					//this.soundInit();
					return sound;
				};

				this.assets = function(sound) {
					parent = this;

					// no sound defined, call assets on all the sounds
					if (sound == undefined) {
						var assets = []
						for (var t = 0; t < this.sounds.length; t++) assets = assets.concat(this.assets(this.sounds[t]));
						return assets;
					}

					if (sound.src !== undefined && sound.src !== '') {
						if (yespix.isArray(sound.src)) {
							// check every sources in array to add the source element
							for (var t = 0; t < sound.src.length; t++)
								if (sound.src[t] && yespix.support('.' + yespix.getExtension(sound.src[t]))) {
									sound.src = sound.src[t];
									sound.isSupported = true;
									return [sound.src];
								}
							return [];
						} else if (yespix.isArray(sound.formats) && sound.formats.length > 0) {
							// check every formats to add the source element
							for (var t = 0; t < sound.formats.length; t++)
								if (sound.formats[t] && yespix.support('.' + sound.formats[t])) {
									sound.src = sound.src + '.' + sound.formats[t];
									sound.isSupported = true;
									return [sound.src];
								}
						} else if (yespix.isString(sound.src) && sound.src.indexOf('|') != -1) {
							var s = sound.src.split('|');
							for (var t = 0; t < s.length; t++)
								if (s[t] && yespix.support('.' + yespix.getExtension(s[t]))) {
									sound.src = s[t];
									sound.isSupported = true;
									return [sound.src];
								}
							return [];
						} else if (yespix.isString(sound.src) && sound.src != '') {
							if (yespix.support('.' + yespix.getExtension(sound.src))) {
								sound.isSupported = true;
								return [sound.src];
							}
						}
					}
					return [];
				};

			},
		});


		yespix.define('canvas', {
			canvasOptions: null,
			element: null,
			context: null,
			document: null,

			init: function(options) {
				this.create(options);
			},

			create: function(options) {
				options = options || {};
				options.document = options.document || yespix.document;
				options.width = options.width || 800; // @todo default must be set to client width
				options.height = options.height || 600; // @todo default must be set to client height
				options.style = options.style || {};
				options.id = options.id || 'canvas' + this._id;
				options.class = options.class || '';
				options.autoAppend = options.autoAppend || true;

				this.canvasOptions = options;
				this.document = options.document;

				var canvas = this.document.createElement('canvas');
				canvas.id = options.id;
				canvas.width = options.width;
				canvas.height = options.height;
				canvas.className = options.className;
				for (var n in options.style) canvas.style[n] = options.style[n];

				if (options.autoAppend) {
					var body = this.document.getElementsByTagName("body")[0];
					body.appendChild(canvas);
				}

				this.use(canvas, options);
			},

			use: function(canvasElement, options) {
				options = options || {};
				options.backgroundColor = options.backgroundColor || '#ffffff';
				options.clearOnEnterFrame = options.clearOnEnterFrame || true;

				this.element = canvasElement;
				this.context = this.element.getContext('2d');

				var canvas = this;

				if (options.clearOnEnterFrame) yespix.on('enterFrame', function() {
					canvas.clear();
				});
			},

			clear: function() {
				//			this.context.clearRect(0,0,this.element.width, this.element.height);
				if (this.element) this.element.width = this.element.width;
			},
		});


		yespix.define('scene', {
			sceneOptions: null,
			document: null,

			init: function(options) {
				this.create(options);
			},

			create: function(options) {
				options = options || {};
				options.document = options.document || yespix.document;

				this.sceneOptions = options;
			},

		});



		yespix.define('debug', 'gfx', {
			isVisible: true,

		});


		yespix.define('move', {
			speedX: 0,
			speedY: 0,

			init: function() {
				console.log('init move');
				yespix.on('enterFrame', function() {
					this.x += this.speedX;
					this.y += this.speedY;
				}, this, yespix);

				//yespix.dump(this);
			},

		});


		yespix.define('image', 'gfx', {
			isVisible: true,

			// images
			images: [],

			selectedImage: 0,

			imageDefaults: {
				isInitiated: false, // true if imageInit() was called
				isLoaded: false,
				src: '',
				element: null,
				document: yespix.document,
			},

			init: function() {
				var entity = this,
					count = 1;

				//console.log('init image');
				//yespix.dump(this);
				if (yespix.isString(this.images)) this.images = [{
					src: this.images
				}];
				//console.log('init image: array of '+this.images.length+' images');

				for (var t = 0; t < this.images.length; t++) {
					// init the default properties
					//console.log('init the image ['+t+'] with the default properties');
					for (var n in this.imageDefaults) {
						//console.log('copy property '+n+' : image = '+this.images[t][n]+', default = '+this.imageDefaults[n]);
						this.images[t][n] = this.images[t][n] || this.imageDefaults[n];
						//console.log('init as '+this.images[t][n]);
					}
					if (this.images[t].name === '') this.images[t].name = 'image' + count++;
				}

				this.image = function(properties) {
					//console.log('image :: properties = '+properties);

					if (properties == undefined)
						if (this.images[0]) return this.imageInit(this.images[0]);
						else return null;
					if (typeof properties == 'string') properties = {
						name: properties
					};
					else if (yespix.isInt(properties))
						if (this.images[properties]) return this.imageInit(this.images[properties]);
						else return null;

					var max = Object.keys(properties).length;
					var count = 0;
					for (var t = 0; t < this.images.length; t++) {
						//console.log('checking image ['+t+'] with name "'+this.images[t].name+'"');
						for (var n in properties) {
							if (this.images[t][n] !== undefined && properties[n] == this.images[t][n]) count++;
							//console.log('property "'+n+'", max = '+max+', count = '+count);
							if (count >= max) return this.imageInit(this.images[t]);
						}
					}
					return null;


				};

				this.imageInit = function(image, index) {
					var entity = this;

					// no sound, init all the sounds
					if (image == undefined) {
						for (var t = 0; t < this.images.length; t++) {
							this.imageInit(this.images[t], t);
						}
						return true;
					}

					// image already initiated
					if (image.isInitiated) return image;

					image.isInitiated = true;
					image.index = index;
					image.entity = entity;
					image.element = document.createElement('img');
					if (index !== undefined && entity.selectedImage == index) {
						image.element.onload = function() {
							entity.width = this.width;
							entity.height = this.height;
							delete this.onload;
							entity.trigger('change');
						};
					}
					// add source to the image element
					image.changeSource = function(source) {
						this.element.src = source;
						entity.trigger('change');
						return true;
					};

					if (image.src !== undefined && image.src !== '') {
						image.changeSource(image.src);
					}

					//console.log('imageInit :: src #1 = '+image.element.src);

					return image; //source != '';
				};

				this.imageInit();

				yespix.on('change', function() {
					this.hasChanged = true;
				}, this);
			},

			draw: function(context) {
				//yespix.dump(this, 'draw');
				if (!this.isVisible) return;

				if (!context) {
					if (!this._context) this.getContext();
					if (this._context) context = this._context;
				}

				if (!context) context = this._context;

				//console.log('context = '+context+', element = '+this.image(this.selectedImage).element+', src = '+this.image(this.selectedImage).element.src);
				var img = this.image(this.selectedImage);
				//yespix.dump(img);
				if (context && img && img.element) context.drawImage(img.element, //image element
					0, // x position on image
					0, // y position on image
					this.width, // width on image
					this.height, // height on image
					this.x, // x position on canvas
					this.y, // y position on canvas
					this.width, // width on canvas
					this.height // height on canvas
				);
			},
		});



		/**
		 ************************************************************************************************************
		 ************************************************************************************************************
		 * Bindings
		 *
		 */

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
			console.log('blur');
			yespix.data.key.pressed = {};
			yespix.data.key.hold = {};
			yespix.data.key.down = {};
			yespix.data.key.up = {};

			// triggers on YESPIX engine
			yespix.trigger(e.type, e);
		};


		yespix.on('exitFrame', function(e) {
			//this.dump(this);
			// delete old keypressed
			if (this.data.key.pressed && this.data.key.pressed.old) delete this.data.key.pressed.old;
			if (this.data.key.up && this.data.key.up.old) delete this.data.key.up.old;
			if (this.data.key.down && this.data.key.down.old) delete this.data.key.down.old;

			// save current keypressed as old keypressed and delete current keypressed
			this.data.key.pressed = {
				old: this.data.key.pressed
			};
			this.data.key.up = {
				old: this.data.key.up
			};
			this.data.key.down = {
				old: this.data.key.down
			};
		});
	};



	// expose the YESPIX function constructor
	window.yespix = yespix;


})();