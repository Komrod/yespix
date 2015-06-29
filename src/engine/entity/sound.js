

yespix.define('sound', {


    inheritClass: 'base',


    init: function(options) {
        var options = options || {};
        if (yespix.isString(options)) {
            options = {sound: {src: options}};
        }
        this.super(options);
        this.sound = new Sound(options.sound || {}, this);

    },


    load: function() {
        this.sound.load();
    },
    


    getAssets: function() {
        var list = this.super();
        if (this.sound && this.sound.src) {
            list = list.concat([this.sound.src]);
        }
        return list;
    },

});

