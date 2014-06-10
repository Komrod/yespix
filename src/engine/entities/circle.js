yespix.define('circle', 'path', {

    circleRadius: 5,
    
    init: function() { },

    drawPath: function(context) {
        context.beginPath();
        context.arc(this.x + this.circleRadius, this.y + this.circleRadius, this.circleRadius, 0, 2 * Math.PI, false);
    },

});
