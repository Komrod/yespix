yespix.define('roundrect', 'path', {

    borderRadius: 5,
    prerender: true,

    init: function() {},

    getBorderRadius: function() {
        if (this.width >= this.borderRadius * 2 || this.height >= this.borderRadius * 2) return this.borderRadius;
        if (this.height < this.width) return this.height / 2;
        return this.width / 2;
    },

    drawPath: function(context) {
        var radius = this.getBorderRadius();
        context.beginPath();

        context.moveTo(this._box.path.x + radius, this._box.path.y);
        context.lineTo(this._box.path.x + this._box.path.width - radius, this._box.path.y);
        context.quadraticCurveTo(this._box.path.x + this._box.path.width, this._box.path.y, this._box.path.x + this._box.path.width, this._box.path.y + radius);
        context.lineTo(this._box.path.x + this._box.path.width, this._box.path.y + this._box.path.height - radius);
        context.quadraticCurveTo(this._box.path.x + this._box.path.width, this._box.path.y + this._box.path.height, this._box.path.x + this._box.path.width - radius, this._box.path.y + this._box.path.height);
        context.lineTo(this._box.path.x + radius, this._box.path.y + this._box.path.height);
        context.quadraticCurveTo(this._box.path.x, this._box.path.y + this._box.path.height, this._box.path.x, this._box.path.y + this._box.path.height - radius);
        context.lineTo(this._box.path.x, this._box.path.y + radius);
        context.quadraticCurveTo(this._box.path.x, this._box.path.y, this._box.path.x + radius, this._box.path.y);
    },

});
