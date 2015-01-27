
yespix.define('circle', 'path', {

    circleRadius: 5,

    init: function() {
        yespix.listen(this, ['circleRadius'], function(obj, e) {
            if (obj.prerender) obj._changed = true;
        });

    },

    drawPath: function(context, contextDrawBox) {
        //console.log('drawPath');
        //console.log(contextDrawBox);
        context.beginPath();
        context.arc(contextDrawBox.o_x + this.circleRadius, contextDrawBox.o_y + this.circleRadius, this.circleRadius, 0, 2 * Math.PI, false);
    },

    getDrawBox: function(relative) {
        var position = this.getPosition(relative);

        return {
            x: position.x,
            y: position.y,
            width: this.circleRadius * 2 + this.lineWidth * 2,
            height: this.circleRadius * 2 + this.lineWidth * 2,
            type: this._class
        };
    },

    drawDebugPosition: function(context, drawBox) {
        //console.log('drawDebugPosition');
        //console.log(drawBox);
        var box = drawBox || this.getDrawBox();
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
