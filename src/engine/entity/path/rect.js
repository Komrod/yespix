
yespix.define('rect', {

    inheritClass: 'path',

    init: function() {
        this.super();
    },

    drawRender: function(context) {
console.log('rect:drawRender');
    }
});
