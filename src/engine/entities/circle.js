
yespix.define('circle', 'path', {

    circleRadius: 5,
    prerender: true,

    init: function() {
        yespix.listen(this, ['circleRadius'], function(obj, e) {
            if (obj.prerender) obj._changed = true;
        });

    },

    drawPath: function(context) {
        context.beginPath();
        context.arc(this._box.path.x + this.circleRadius, 
            this._box.path.y + this.circleRadius, 
            this.circleRadius, 
            0, 
            2 * Math.PI, 
            false);
    },

    getDrawBox: function(absolute) {
        var position = this.getPosition(absolute);

        return {
            x: position.x,
            y: position.y,
            width: this.circleRadius * 2 + this.lineWidth,
            height: this.circleRadius * 2 + this.lineWidth
        };
    },

    drawDebugPosition: function(context, box) {
        box = box || this._box.draw;

        context.lineWidth = 0.5;
        context.strokeStyle = "#cc3333";
        context.strokeRect(box.x, box.y, this.circleRadius * 2 + this.lineWidth, this.circleRadius * 2 + this.lineWidth);

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
