yespix.define('circle', 'path', {

    circleRadius: 5,

    init: function() {},

    drawPath: function(context, box) {
        context.beginPath();
        context.arc(box.x + this.circleRadius, box.y + this.circleRadius, this.circleRadius, 0, 2 * Math.PI, false);
    },

    getDrawBox: function(relative) {
        var position = this.getPosition(relative);

        return {
            x: position.x,
            y: position.y,
            width: this.circleRadius * 2,
            height: this.circleRadius * 2,
            type: this._class
        };
    },

    drawDebugPosition: function(context, drawBox) {
        var box = drawBox || this.getDrawBox();
        context.lineWidth = 0.5;
        context.strokeStyle = "#cc3333";
        context.strokeRect(box.x - 0.5, box.y - 0.5, this.circleRadius * 2 + 1, this.circleRadius * 2 + 1);

        context.strokeStyle = "#ff0000";
        context.beginPath();
        context.moveTo(box.x - 2, box.y - 2);
        context.lineTo(box.x + 2, box.y + 2);
        context.stroke();
        context.moveTo(box.x + 2, box.y - 2);
        context.lineTo(box.x - 2, box.y + 2);
        context.stroke();
    },

});
