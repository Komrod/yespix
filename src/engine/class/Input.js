

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
    }

    if (elements.key) {
        this.enableKey(elements.key);
    }
    if (elements.mouse) {
        this.enableMouse(elements.mouse);
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


/*
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
*/

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
 * If you want to trigger an event on a click, use input.on('click'), yespix.on('keydown'), yespix.on('keyup'). The operators
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
    return !!this.state.mouse[this.mouseMap[s.toLowerCase()]];
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
