/**
 ***********************************************************************************************************
 ***********************************************************************************************************
 * YESPIX INIT
 */

/**
 * Initialisation of the YESPIX engine
 * @method init
 */
yespix.fn.init = function(options) {
    /**
     * Set to True when the YESPIX engine is initiated and ready to do stuff
     * @property isReady
     * @type boolean
     */
    this.isReady = false;

    /**
     * Array of entities to draw, basically all the entities with a gfx ancestor
     * @property {array} drawEntities
     * @type {Array}
     */
    this.drawEntities = [];

    /**
     * Set to true when a /gfx entity is spawned or removed
     * @type {Boolean}
     */
    this.drawEntitiesChange = false;

    this.collisionSize = 64;


    // initialisation of the ready event
    this.on('ready', function() {
        this.isReady = true;
        this.timerStart();
    });

    // current version of the engine
    this.version = "0.13.1";

    // initialise the data
    this.data = {

        // collision map of the entities
        collisionMap: {

        },

        // Stored informations about downloaded files
        file: {

        },

        // Element and media support
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
    options.namespace = options.namespace || 'yespix';
    options['dir_resources'] = options['dir_resources'] || '../resources/';
    options['dir_engine'] = options['dir_engine'] || '../engine/';
    options['ready'] = options['ready'] || function() {};
    options['init'] = options['init'] || function() {};
    options['collisionSize'] = options['collisionSize'] || 64;

    this.on('ready', options['ready']);

    // store the options
    this.options = options;

    // set document and window
    this.document = options["document"] || document;
    this.window = options["window"] || window;



    initEntities(this);


    this.options = options;

    this.window[options['namespace']] = this;

    var yespix = this;

    function start(options) {

        if (options['canvas']) yespix.spawn('canvas', options.canvas);
        if (options['fps']) yespix.setFps(options.fps);
        this.collisionSize = options['collisionSize'];

        if (yespix.isArray(yespix.entityInstances['/gfx'])) {
            this.drawEntities = yespix.entityInstances['/gfx'];
            this.drawEntities.sort(compare);
        } else this.drawEntities = [];

        yespix.on('spawn', function(e) {
            this.drawEntitiesChange = true;
        });

        yespix.on('remove', function(e) {
            this.drawEntitiesChange = true;
        });

        yespix.on("draw", function(e) {
            // sort by z and zGlobal
            function compare(a, b) {
                if (a.z > b.z) return 1;
                if (a.z === b.z && a.zGlobal > b.zGlobal) return 1;
                return -1;
            }

            // change the drawEntities because some entity instances have been added or removed
            if (yespix.drawEntitiesChange || !yespix.drawEntities) {
                yespix.drawEntities = yespix.entityInstances['/gfx'];
                if (yespix.drawEntities) yespix.drawEntities = yespix.drawEntities.sort(compare);
                yespix.drawEntitiesChange = false;
            } else if (yespix.drawEntitiesSort) {
                yespix.drawEntities = yespix.drawEntities.sort(compare);
                yespix.drawEntitiesSort = false;
            }

            if (yespix.drawEntities)
                for (var t = 0; t < yespix.drawEntities.length; t++) {
                    if (yespix.drawEntities[t] && yespix.drawEntities[t].draw) {
                        yespix.drawEntities[t].draw();
                    }
                }

        });
        options['init']();
        yespix.trigger('ready');
    }

    start(options);



    // init functions for input keys 
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


    /**
     * Key down bindings
     * @param  {object} e Event
     * @todo use the yespix document and window instead of the main objects
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




    return this;

};
