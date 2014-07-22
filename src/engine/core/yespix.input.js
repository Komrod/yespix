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
