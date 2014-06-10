yespix.define('roundrect', 'rect', {

    borderRadius: 5,

    init: function() {},

    getBorderRadius: function()
    {
        if (this.width >= this.borderRadius * 2 || this.height >= this.borderRadius * 2) return this.borderRadius;
        if (this.height < this.width) return this.height / 2;
        return this.width / 2;
    },

    drawPath: function(context) {
        var radius = this.getBorderRadius();
        context.beginPath();
        context.moveTo(this.x + radius, this.y);
        context.lineTo(this.x + this.width - radius, this.y);
        context.quadraticCurveTo(this.x + this.width, this.y, this.x + this.width, this.y + radius);
        context.lineTo(this.x + this.width, this.y + this.height - radius);
        context.quadraticCurveTo(this.x + this.width, this.y + this.height, this.x + this.width - radius, this.y + this.height);
        context.lineTo(this.x + radius, this.y + this.height);
        context.quadraticCurveTo(this.x, this.y + this.height, this.x, this.y + this.height - radius);
        context.lineTo(this.x, this.y + radius);
        context.quadraticCurveTo(this.x, this.y, this.x + radius, this.y);
    },

    drawLine: function(context, box) {
        this.drawAlpha(context, 'line');
        context.stroke();
    },

    drawFill: function(context, box) {
        this.drawAlpha(context, 'fill');
        context.fill();
    },

});