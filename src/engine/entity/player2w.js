

yespix.defineEntity('player2w', {


    inheritClass: 'animation',


    init: function(properties) {
        properties = properties || {};
        this.super(properties);

        this.actor = new yespix.class.player2w(properties.actor, this);
    },


    step: function(time) {
        this.actor.step(time);
        this.super(time);
    }


});

