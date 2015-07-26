
function Input(options) {

    // init the options
    options = options || {};

    this.persistence = options.persistence || 200;
    this.doc = options.document || document;

    var input = this;

    /**
     * Key down bindings
     * @param  {object} e Event
     * @todo use the yespix document and window instead of the main objects
     */
    this.doc.onkeydown = function(e) {
        // get the event
        e = e || window.event;

        // get the key code
        e.inputCode = e.which || e.keyCode || e.charCode || e.key.charCodeAt(0);

        if (input.data.ids[parseInt(e.inputCode)]) {
            clearTimeout(input.data.ids[parseInt(e.inputCode)]);
        }

        // main key pressed
        input.data.pressed[parseInt(e.inputCode)] = true;
        input.data.hold[parseInt(e.inputCode)] = true;

        // special key pressed
        if (e.ctrlKey) input.data.hold[input.data.special['ctrl']] = true;
        else input.data.hold[input.data.special['ctrl']] = false;
        if (e.altKey) input.data.hold[input.data.special['alt']] = true;
        else input.data.hold[input.data.special['alt']] = false;
        if (e.shiftKey) input.data.hold[input.data.special['shift']] = true;
        else input.data.hold[input.data.special['shift']] = false;
    };

    /**
     * Key up bindings
     * @param  {object} e Event
     */
    this.doc.onkeyup = function(e) {
        // get the event
        e = e || window.event;

        // get the key code
        e.inputCode = e.which || e.keyCode || e.charCode || e.key.charCodeAt(0);

        // main key pressed
        input.data.up[parseInt(e.inputCode)] = true;
        input.data.hold[parseInt(e.inputCode)] = false;

        // special key pressed
        if (e.ctrlKey) input.data.hold[input.data.special['ctrl']] = true;
        else input.data.hold[input.data.special['ctrl']] = false;
        if (e.altKey) input.data.hold[input.data.special['alt']] = true;
        else input.data.hold[input.data.special['alt']] = false;
        if (e.shiftKey) input.data.hold[input.data.special['shift']] = true;
        else input.data.hold[input.data.special['shift']] = false;


        if (input.data.ids[parseInt(e.inputCode)]) {
            clearTimeout(input.data.ids[parseInt(e.inputCode)]);
        }
        setTimeout(function() {
            // main key pressed
            input.data.up[parseInt(e.inputCode)] = false;
            input.data.pressed[parseInt(e.inputCode)] = false;
            input.data.down[parseInt(e.inputCode)] = false;
            input.data.hold[parseInt(e.inputCode)] = false;

            // special key pressed
            input.data.hold[input.data.special['ctrl']] = false;
            input.data.hold[input.data.special['alt']] = false;
            input.data.hold[input.data.special['shift']] = false;
        }, this.persistence);
    };

    /**
     * Key pressed bindings
     * @param  {object} e Event
     */
    this.doc.onkeypress = function(e) {
        // get the event
        e = e || window.event;
        // get the key code
        e.inputCode = e.which || e.keyCode || e.charCode || e.key.charCodeAt(0);

//console.log('keypress: e=', e);
        if (input.data.ids[parseInt(e.inputCode)]) {
            clearTimeout(input.data.ids[parseInt(e.inputCode)]);
        }

        // main key pressed
        input.data.pressed[parseInt(e.inputCode)] = true;
    };

    /**
     * blur
     */
    this.doc.onblur = function(e) {
        input.data.pressed = {};
        input.data.hold = {};
        input.data.down = {};
        input.data.up = {};
    };

    this.data = {
        pressed: {},
        hold: {},
        down: {},
        up: {},
        ids: {},
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
            scrollLock: 145
        }

    };

};


/**
 * Returns True if some keys are pressed, hold, down or up for this frame. Note: the key arrays are reset every frame, only the "hold"
 * keys are kept until "keyup" event. Depending on the framerate, you will sometimes miss the "pressed", "up" and "down" True value. If you
 * want to trigger an event on a key, it's better to use yespix.on('keypress'), yespix.on('keydown'), yespix.on('keyup') or yespix.on('keyhold'). The operators
 * AND "-" and OR "|" can be used in the selector.
 * @param  {int|string} s The selector or the key code of the character. Selector can be special keys ("shift", "ctrl" ...), multiple keys separated
 *                        with operator AND "-" ("ctrl-a", "a-d-g") or operator OR "|" ("a|2", "g|h|j"). Operator AND "-" have the priority
 *                        over "|", meaning "a|b-c" will be parsed like "a" || ("b" && "c"). If looking for keys "|" and "-", the characters
 *                        must be escaped if there is more than one character in the selector, like "\|" and "\-".
 * @param  {string} type "pressed" / "hold" / "down" / "up", default is "hold"
 * @return {boolean} Returns True on success
 * @example key("w") return true if the keys "w" is hold
 * @example key("ctrl-d") return true if the keys "control" and "d" are hold together
 * @example key("a-z-e-r") return true if the keys "a", "z", "e" and "r" are hold together
 * @example key("a|r") return true if the keys "a" OR "r" are hold
 * @example key("a", "up") return true if the key "a" was pressed and is up for this frame
 * @example key("|", "pressed") return true if the key "|" is pressed for this frame
 * @example key("\-|\|") return true if the key "-" or "|" is hold
 * @example key("a|z-e|r") return true if the keys "a" || ("z" && "e") || "r" are hold
 * @example key("a-z|e-r") return true if the keys ("a" || "z") && ("e" || "r") are hold
 */
Input.prototype.key = function(s, type) {
    var t;

    type = type || 'hold';
    if (yespix.isString(s)) {
        s = s.toLowerCase();
        if (s.indexOf('|') != -1 && s.charAt(s.indexOf('|') - 1) != '\\' && s.length > 1) {
            var arr = s.split('|', 2);
            for (t = 0; t < arr.length; t++)
                if (this.key(arr[t], type)) return true;
            return false;
        }
        if (s.indexOf('-') != -1 && s.charAt(s.indexOf('-') - 1) != '\\' && s.length > 1) return this.key(s.split('-'), type);
        if (s.length > 1) return this.specialKey(s, type);
        //if (type != 'pressed') s = s.toUpperCase();
        if (type == 'hold' && this.data['up'][s.charCodeAt(0)]) {
            return true;
        }
        return !!this.data[type][s.charCodeAt(0)];
    }

    if (yespix.isArray(s)) {
        for (t = 0; t < s.length; t++)
            if (!this.key(s[t], type)) {
                return false;
            }
        return true;
    }
    if (yespix.isInt(s)) {
        if (type == 'hold' && this.data['up'][s]) {
            return true;
        }
        return !!this.data[type][s];
    }
    return false;
};


Input.prototype.isKey = function(code, s) {
    if (s.length > 1) return this.data.special[s.toLowerCase()] == code;
    return (s.charCodeAt(0) == code || s.toUpperCase().charCodeAt(0) == code || s.toLowerCase().charCodeAt(0) == code);
};


Input.prototype.specialKey = function(s, type) {
    type = type || 'hold';
    if (type == 'hold' && this.data['up'][this.data.special[s.toLowerCase()]]) {
        return true;
    }
    return !!this.data[type][this.data.special[s.toLowerCase()]];
};


Input.prototype.keyDisable = function() {
    return false;
};


Input.prototype.reset = function() {
    this.data.pressed = {};
    this.data.hold = {};
    this.data.down = {};
    this.data.up = {};
};


