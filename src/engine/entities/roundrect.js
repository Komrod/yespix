yespix.define('roundrect', 'rect', {

    borderRadius: 5,

    
    init: function() {},
    
    getBorderRadius: function() {
        if (this.width >= this.borderRadius * 2 || this.height >= this.borderRadius * 2) return this.borderRadius;
        if (this.height < this.width) return this.height / 2;
        return this.width / 2;
    },
    
    drawPath: function(context, contextDrawBox) {
        var radius = this.getBorderRadius();
        context.beginPath();

        contextDrawBox.o_width = contextDrawBox.o_width - this.lineWidth;
        contextDrawBox.o_height = contextDrawBox.o_height - this.lineWidth;

        context.moveTo(contextDrawBox.o_x + radius, contextDrawBox.o_y);
        context.lineTo(contextDrawBox.o_x + contextDrawBox.o_width - radius, contextDrawBox.o_y);
        context.quadraticCurveTo(contextDrawBox.o_x + contextDrawBox.o_width, contextDrawBox.o_y, contextDrawBox.o_x + contextDrawBox.o_width, contextDrawBox.o_y + radius);
        context.lineTo(contextDrawBox.o_x + contextDrawBox.o_width, contextDrawBox.o_y + contextDrawBox.o_height - radius);
        context.quadraticCurveTo(contextDrawBox.o_x + contextDrawBox.o_width, contextDrawBox.o_y + contextDrawBox.o_height, contextDrawBox.o_x + contextDrawBox.o_width - radius, contextDrawBox.o_y + contextDrawBox.o_height);
        context.lineTo(contextDrawBox.o_x + radius, contextDrawBox.o_y + contextDrawBox.o_height);
        context.quadraticCurveTo(contextDrawBox.o_x, contextDrawBox.o_y + contextDrawBox.o_height, contextDrawBox.o_x, contextDrawBox.o_y + contextDrawBox.o_height - radius);
        context.lineTo(contextDrawBox.o_x, contextDrawBox.o_y + radius);
        context.quadraticCurveTo(contextDrawBox.o_x, contextDrawBox.o_y, contextDrawBox.o_x + radius, contextDrawBox.o_y);
    },
    
    drawLine: function(context, box) {
        this.drawAlpha(context, 'line');
        if (context.strokeStyle != this.lineColor) context.strokeStyle = this.lineColor;
        if (context.lineWidth != this.lineWidth) context.lineWidth = this.lineWidth;
        context.stroke();
    },

    drawFill: function(context, box) {
        this.drawAlpha(context, 'fill');
        if (context.fillStyle != this.fillColor) context.fillStyle = this.fillColor;
        context.fill();
    },

});
