

function Input(elements) {

    // init the properties
    elements = elements || {};

    
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
        left: 1,
        wheel: 2,
        right: 3
    };

    this.gamepadMap = {
        standard: {
            a: 0,
            b: 1,
            x: 2,
            y: 3,
            lb: 4,
            rb: 5,
            lt: 6,
            rt: 7,
            back: 8,
            start: 9,
            ls: 10,
            rs: 11,
            up: 12,
            down: 13,
            left: 14,
            right: 15
        },
        other:{
            x: 0,
            a: 1,
            b: 2,
            y: 3,
            lb: 4,
            rb: 5,
            lt: 6,
            rt: 7,
            back: 8,
            start: 9,
            ls: 10,
            rs: 11
        }
    };
    this.gamepadAxeValues = {
        'up': -1.000,
        'up,right': -0.7142,
        'right': -0.4285,
        'right,down': -0.1428,
        'down': 0.1428,
        'down,left': 0.4285,
        'left': 0.7142,
        'left,up': 1.0000,
        'delta': 0.1
    };

    if (elements.key) {
        this.enableKey(elements.key);
    }
    if (elements.mouse) {
        this.enableMouse(elements.mouse);
    }
    if (elements.gamepad) {
        this.enableGamepad();
    } else {
       this.disableGamepad();
    }
}


/************************************************************************************************
 * Key functions
 ************************************************************************************************/

Input.prototype.enableKey = function(element) {

    if (this.keyElement) {
        this.disableKey(this.keyElement);
    }

    this.keyElement = element;
    var input = this;

    this.keyElement.onkeydown = function(e) {
        return input.onKey(e, true);
    };

    this.keyElement.onkeyup = function(e) {
        return input.onKey(e, false);
    };

    this.keyElement.onkeypress = function(e) {
        return input.onKey(e, true);
    };

    this.keyElement.onblur = function(e) {
        return this.reset();
    };

};


Input.prototype.disableKey = function(element) {

    element.onkeydown = function(e) {};
    element.onkeyup = function(e) {};
    element.onkeypress = function(e) {};
    element.onblur = function(e) {};

};



Input.prototype.onKey = function(e, b) {
    // get the event
    e = e || window.event;

    // get the key code
//    e.inputCode = e.which || e.keyCode || e.charCode || e.key.charCodeAt(0);
    e.inputCode = e.key.toLowerCase().charCodeAt(0);

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



/************************************************************************************************
 * Events
 ************************************************************************************************/

Input.prototype.trigger = function(event, name) {
    this.event.trigger(event, name);
};

Input.prototype.when = function(eventName, fct, name) {
    this.event.link(eventName, fct, name);
};

Input.prototype.unlink = function(eventName, name) {
    this.event.unlink(eventName, name);
};


/************************************************************************************************
 * Mouse functions
 ************************************************************************************************/

Input.prototype.enableMouse = function(element) {
    
    if (this.mouseElement) {
        this.disableMouse(this.mouseElement);
    }

    //this.setCanvas(canvas);
    var input = this;
    this.mouseElement = element;

    this.state.mouse = {
        x: 0,
        y: 0
    }

    this.mouseElement.onmousedown = function(e) {
        return input.onMouse(e, true);
    };
    this.mouseElement.onclick = function(e) {
        return input.onMouse(e);
    };
    this.mouseElement.oncontextmenu = function(e) {
        return input.onMouse(e);
    };
    this.mouseElement.ondblclick = function(e) {
        return input.onMouse(e);
    };
    this.mouseElement.onmouseup = function(e) {
        return input.onMouse(e, false);
    };
    this.mouseElement.onmousemove = function(e) {
        return input.onMouse(e);
    };
    this.mouseElement.onmouseleave = function(e) {
        return input.onMouse(e);
    };
    this.mouseElement.onmousewheel = function(e) {
        return input.onMouse(e);
    };
    this.mouseElement.onwheel = function(e) {
        return input.onMouse(e);
    };
};

Input.prototype.disableMouse = function(element) {
    
    this.mouseElement.onmousedown = function(e) {};
    this.mouseElement.onclick = function(e) {};
    this.mouseElement.ondblclick = function(e) {};
    this.mouseElement.onmouseup = function(e) {};
    this.mouseElement.onmousemove = function(e) {};
    this.mouseElement.onmouseleave = function(e) {};
    this.mouseElement.onmousewheel = function(e) {};
    this.mouseElement.onwheel = function(e) {};
    this.mouseElement.oncontextmenu = function(e) {};

};


Input.prototype.onMouse = function(e, b) {

//console.log(e); 
    if (e.stopPropagation) {
        e.stopPropagation();
    }

    e.cancelBubble = true;

//if (e.type!="mousemove") console.log(e); 
//return false;
//        input.onMouse('move', {x: e.x - input.canvasOffset.x, y: e.y - input.canvasOffset.y});

    this.state.mouse.x = e.offsetX || e.layerX;
    this.state.mouse.y = e.offsetY || e.layerY;

    e.inputCode = e.which;

    // main key 
    if (!yespix.isUndefined(b) && e.inputCode != 0) {
        this.state.mouse[parseInt(e.inputCode)] = b;
    }
//console.log('onMouse: type='+e.type+', mouse['+e.inputCode+']='+b);
    this.trigger(e);

    if (e.type == 'mouseleave') {
        this.state = {
            mouse: {x: null, y: null},
            key: {}
        };
    }

    return false;
};


/**
 * Returns True if some mouse buttons are pressed for this frame.
 */
Input.prototype.mouse = function(s) {
    var t;

    if (yespix.isString(s)) {
        s = s.toLowerCase();
        if (s.indexOf('|') != -1 && s.charAt(s.indexOf('|') - 1) != '\\' && s.length > 1) {
            var arr = s.split('|', 2);
            for (t = 0; t < arr.length; t++)
                if (this.mouse(arr[t])) return true;
            return false;
        }
        if (s.indexOf('-') != -1 && s.charAt(s.indexOf('-') - 1) != '\\' && s.length > 1) return this.mouse(s.split('-'));
        if (s.length > 1) return this.mouseButton(s);
        return !!this.state.mouse[s.charCodeAt(0)];
    }

    if (yespix.isArray(s)) {
        for (t = 0; t < s.length; t++)
            if (!this.mouse(s[t])) {
                return false;
            }
        return true;
    }
    if (yespix.isInt(s)) {
        return !!this.state.mouse[s];
    }
    return false;
};

Input.prototype.mouseButton = function(s) {
    if (this.state.mouse[this.mouseMap[s.toLowerCase()]]) {
        return true;
    }
    return false;
};




/************************************************************************************************
 * Gamepad functions
 ************************************************************************************************/

Input.prototype.enableGamepad = function() {
    this.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);
};

Input.prototype.disableGamepad = function() {
    this.gamepads = [];
};

Input.prototype.gamepadCount = function() {
    if (!this.gamepads || !this.gamepads.length) {
        return 0;
    }
    var count = 0;
    for (var t=0; t<this.gamepads.length; t++) {
        if (this.gamepads[t]) count++;
    }
    return count;
};



Input.prototype.gamepad = function(s, n) {
    
    if (!n) n=0;

    this.gamepads = navigator.getGamepads ? navigator.getGamepads() : (navigator.webkitGetGamepads ? navigator.webkitGetGamepads : []);

    if (!this.gamepads[n] || !this.gamepads[n].buttons) {
        return false;
    }
    var t;

    if (yespix.isString(s)) {
        s = s.toLowerCase();
        if (s.indexOf('|') != -1 && s.charAt(s.indexOf('|') - 1) != '\\' && s.length > 1) {
            var arr = s.split('|', 2);
            for (t = 0; t < arr.length; t++)
                if (this.gamepad(arr[t]), n) return true;
            return false;
        }
        if (s.indexOf('-') != -1 && s.charAt(s.indexOf('-') - 1) != '\\' && s.length > 1) return this.gamepad(s.split('-'), n);
        return this.gamepadButton(s, n);
    }

    if (yespix.isArray(s)) {
        for (t = 0; t < s.length; t++)
            if (!this.gamepad(s[t])) {
                return false;
            }
        return true;
    }
    if (yespix.isInt(s)) {
        return this.gamepads[n].buttons[s].pressed;
    }
    return false;
};

Input.prototype.gamepadButton = function(s, n) {
    if (!n) {
        n=0;
    }
    if (!this.gamepads[n] || !this.gamepads[n].buttons) {
        return false;
    }

    var mapping = this.gamepads[n].mapping;
    if (mapping == '') mapping = 'other';
    if (mapping == 'other' && (s == 'left' || s == 'right' || s == 'up' || s == 'down')) {
        //console.log(this.gamepads[n].buttons[this.gamepadMap[mapping][s.toLowerCase()]]);
        if (this.gamepadDirections(n).indexOf(s) >= 0) return true;
        return false;
    }

    if (yespix.isUndefined(this.gamepadMap[mapping]) || yespix.isUndefined(this.gamepadMap[mapping][s.toLowerCase()]) 
        || yespix.isUndefined(this.gamepads[n].buttons[this.gamepadMap[mapping][s.toLowerCase()]])) {
        return false;
    }

    if (this.gamepads[n].buttons[this.gamepadMap[mapping][s.toLowerCase()]].pressed) {
        return true;
    }
    return false; //!!this.state.mouse[this.mouseMap[s.toLowerCase()]];
};

Input.prototype.gamepadAxes = function(n, axisIndex) {
};

// get 8 directions from last axe
Input.prototype.gamepadDirections = function(n) {
    if (!this.gamepads[n] || !this.gamepads[n].axes.length) {
        return '';
    }

    var axeValue = this.gamepads[n].axes[this.gamepads[n].axes.length-1];
    for (var dir in this.gamepadAxeValues) {
        if (dir != 'delta' && axeValue >= this.gamepadAxeValues[dir] - this.gamepadAxeValues['delta'] && axeValue <= this.gamepadAxeValues[dir] + this.gamepadAxeValues['delta']) {
            return dir;
        }
    }
    return '';
};







Input.prototype.reset = function() {
    this.state = {
        mouse: {x: null, y: null},
        key: {}
    };

    if (this.event && this.event.clear) {
        this.event.clear();
    }

    this.event = new yespix.class.eventHandler();

    return false;
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
