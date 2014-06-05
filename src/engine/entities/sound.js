/**
 *
 */
yespix.define('sound', {
    // sounds
    sounds: [],

    soundDefaults: {
        isInitiated: false, // true if soundInit() was called
        isSupported: false, // 
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
