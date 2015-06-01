

yespix.define('sound', {


    inheritClass: 'base',


    init: function(options) {
        var options = options || {};
        this.super(options);
        this.sound = new Sound(options.sound || {}, this);

    },


    event: function(event) {
        this.super(event);
    },


    getAssets: function() {
        var list = this.super();
        if (this.sound && this.sound.src) {
            if (yespix.isArray(this.sound.src)) {
                list = list.concat(this.sound.src);
            } else {
                list = list.concat([this.sound.src]);
            }
        }
        return list;
    },

    getSound: function(index) {
        return this.sound.select(index);
    },
    

});

