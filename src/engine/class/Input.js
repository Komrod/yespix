

function Input(properties) {

    // init the properties
    properties = properties || {};

    
    // reset mouse and key states
    this.reset();
    
    this.keyMap = {
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
    };

    this.mouseMap = {
        left: 0,
        wheel: 1,
        right: 2
    }

    this.enableKey(properties.document);
    if (properties.canvas) {
        //this.enableMouse(properties.canvas);
    }
}

Input.prototype.onKey = function(e, b) {
    // get the event
    e = e || window.event;

    // get the key code
//    e.inputCode = e.which || e.keyCode || e.charCode || e.key.charCodeAt(0);
    e.inputCode = e.key.charCodeAt(0);

    // main key 
    this.state.key[parseInt(e.inputCode)] = b;
//console.log(e, this.state.key);        
//console.log('this.state.key['+parseInt(e.inputCode)+'] = '+b+';');
    // special key 
    if (e.ctrlKey) this.state.key[this.keyMap['ctrl']] = true;
    else this.state.key[this.keyMap['ctrl']] = false;
    if (e.altKey) this.state.key[this.keyMap['alt']] = true;
    else this.state.key[this.keyMap['alt']] = false;
    if (e.shiftKey) this.state.key[this.keyMap['shift']] = true;
    else this.state.key[this.keyMap['shift']] = false;

    this.trigger(e);

};

Input.prototype.enableKey = function(doc) {

    this.doc = doc || document;
    var input = this;

    this.doc.onkeydown = function(e) {
        input.onKey(e, true);
    };

    this.doc.onkeyup = function(e) {
        input.onKey(e, false);
    };

    this.doc.onkeypress = function(e) {
        input.onKey(e, true);
    };

    this.doc.onblur = function(e) {
        this.reset();
    };
};


Input.prototype.trigger = function(event, name) {
    this.event.trigger(event, name);
};

Input.prototype.when = function(eventName, fct, name) {
    this.event.link(eventName, fct, name);
};

Input.prototype.unlink = function(eventName, name) {
    this.event.trigger(eventName, name);
};


Input.prototype.enableMouse = function(canvas) {
    
    this.setCanvas(canvas);
    var input = this;

    this.canvas.onmousedown = function(e) {
        input.onMouse(e, true); //'down', {x: e.x - input.canvasOffset.x, y: e.y - input.canvasOffset.y});
    };
    this.canvas.onmouseup = function(e) {
        input.onMouse(e, false); //'up', {x: e.x - input.canvasOffset.x, y: e.y - input.canvasOffset.y});
    };
    this.canvas.onmousemove = function(e) {
        input.onMouse(e);
    };
    this.canvas.onmouseleave = function(e) {
        input.onMouse(e);
//        input.onMouse('move', {x: e.x - input.canvasOffset.x, y: e.y - input.canvasOffset.y});
//        input.mouseDo('up', {x: e.x - input.canvasOffset.x, y: e.y - input.canvasOffset.y});
    };
    this.canvas.onmousewheel = function(e) {
//        input.mouseDo('wheel', {x: e.x - input.canvasOffset.x, y: e.y - input.canvasOffset.y});
        input.onMouse(e);
    };

};



Input.prototype.setCanvas = function(canvas) {
    this.canvas = canvas;

    var offsetLeft = 0;
    var offsetTop = 0;
    do {
        if (!isNaN(canvas.offsetLeft)) {
            offsetLeft += canvas.offsetLeft;
        }
        if (!isNaN(canvas.offsetTop)) {
            offsetTop += canvas.offsetTop;
        }
    } while (canvas = canvas.offsetParent);
    this.canvasOffset = {
        x: offsetLeft, 
        y: offsetTop
    };
    this.mouseDo();
};


Input.prototype.onMouse = function(event) {
console.log(event); return;
    if (!type) {
        this.mouseState = {
            clicked: false,
            button: false,
            x: 0,
            y: 0
        }
    }
//console.log(type, properties);
    var clicked = false;
    if (type == 'down') {
        clicked = true;
    }
    this.mouseState = {
        right: clicked,
        left: clicked,
        drag: false,
        x: properties.x,
        y: properties.y
    }
};




/**
 * Returns True if some keys are pressed for this frame.
 * If you want to trigger an event on a key, use input.on('keypress'), yespix.on('keydown'), yespix.on('keyup'). The operators
 * AND "-" and OR "|" can be used in the selector.
 * @param  {int|string} The selector or the key code of the character. Selector can be special keys ("shift", "ctrl" ...), multiple keys separated
 *         with operator AND "-" ("ctrl-a", "a-d-g") or operator OR "|" ("a|2", "g|h|j"). Operator AND "-" have the priority
 *         over "|", meaning "a|b-c" will be parsed like "a" || ("b" && "c"). If looking for keys "|" and "-", the characters
 *         must be escaped if there is more than one character in the selector, like "\|" and "\-".
 * @return {boolean} Returns True on success
 * @example input.key("w") return true if the keys "w" is hold
 * @example input.key("ctrl-d") return true if the keys "control" and "d" are hold together
 * @example input.key("a-z-e-r") return true if the keys "a", "z", "e" and "r" are hold together
 * @example input.key("a|r") return true if the keys "a" OR "r" are hold
 * @example input.key("\-|\|") return true if the key "-" or "|" are hold
 * @example input.key("a|z-e|r") return true if the keys "a" || ("z" && "e") || "r" are hold
 * @example input.key("a-z|e-r") return true if the keys ("a" || "z") && ("e" || "r") are hold
 */
Input.prototype.key = function(s) {
    var t;

    if (yespix.isString(s)) {
        s = s.toLowerCase();
        if (s.indexOf('|') != -1 && s.charAt(s.indexOf('|') - 1) != '\\' && s.length > 1) {
            var arr = s.split('|', 2);
            for (t = 0; t < arr.length; t++)
                if (this.key(arr[t])) return true;
            return false;
        }
        if (s.indexOf('-') != -1 && s.charAt(s.indexOf('-') - 1) != '\\' && s.length > 1) return this.key(s.split('-'));
        if (s.length > 1) return this.specialKey(s);
        return !!this.state.key[s.charCodeAt(0)];
    }

    if (yespix.isArray(s)) {
        for (t = 0; t < s.length; t++)
            if (!this.key(s[t])) {
                return false;
            }
        return true;
    }
    if (yespix.isInt(s)) {
        return !!this.state.key[s];
    }
    return false;
};


Input.prototype.isKey = function(code, s) {
    if (s.length > 1) return this.keyMap[s.toLowerCase()] == code;
    return (s.toUpperCase().charCodeAt(0) == code || s.toLowerCase().charCodeAt(0) == code);
};


Input.prototype.specialKey = function(s) {
    if (this.state.key[this.keyMap[s.toLowerCase()]]) {
        return true;
    }
    return !!this.state.key[this.keyMap[s.toLowerCase()]];
};


Input.prototype.keyDisable = function() {
    this.reset();

    this.doc.onkeydown = function(e) {};

    this.doc.onkeyup = function(e) {};

    this.doc.onkeypress = function(e) {};

    this.doc.onblur = function(e) {};
};


Input.prototype.reset = function() {
    this.state = {
        mouse: {},
        key: {}
    };

    if (this.event && this.event.clear) {
        this.event.clear();
    }

    this.event = new yespix.class.eventHandler();
};


/*
Input.prototype.addState = function(entityName, keys) {
    // keys = { 'jump': 'up', 'goLeft': 'left', 'goRight': 'right'}
    this.states[entityName] = keys;
};

Input.prototype.state = function(entityName, actionName) {
    return this.key(this.states[entityName][actionName]);
};
*/


yespix.defineClass('input', Input);
