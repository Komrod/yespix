yespix.define('collision', {

    colOffsetX: 0,
    colOffsetY: 0,

    colType: 'all', // "all" / "passive" / "active" / "none"
    colClass: [],

    init: function() {
        if (yespix.isUndefined(this.colWidth)) this.colWidth = this.width;
        if (yespix.isUndefined(this.colHeight)) this.colHeight = this.height;
    },

    collisionWith: function(entity) {
        if (this.colClass.length == 0) return true;
        if (entity.typeof(this.colClass)) return true;
        return false;
    },

    collisionBox: function(absolute) {

        var pos = this.getPosition(absolute);

        return {
            x: pos.x + this.colOffsetX * this.imageScale,
            y: pos.y + this.colOffsetY * this.imageScale,
            width: this.colWidth * this.imageScale,
            height: this.colHeight * this.imageScale,
            offsetX: this.colOffsetX * this.imageScale,
            offsetY: this.colOffsetY * this.imageScale,
        };
    },

    collision: function() {
        if (this.colType == 'all' || this.colType == 'active') yespix.collision(this);
    },

    collisionOccupy: function() {
        if (this.colType != 'none') yespix.collisionOccupy(this);
    },

    over: function(entity) {
        if (!this.intersect(entity)) return false;
        if (this.z > entity.z) return true;
        if (this.z == entity.z && this.globalZ > entity.globalZ) return true;
        return false;
    },

    under: function() {
        if (!this.intersect(entity)) return false;
        if (this.z < entity.z) return true;
        if (this.z == entity.z && this.globalZ < entity.globalZ) return true;
        return false;
    },

    touch: function(entity) {
        return yespix.collisionTouch(this, entity);
    },

    intersect: function(entity) {
        return yespix.collisionCheck(this, entity);
    },

    inside: function(entity) {
        return yespix.collisionInside(this, entity);
    },

    drawDebugCollision: function(context, drawBox) {
        if (this.collisionBox) {
            drawBox = drawBox || this.collisionBox();
            context.globalAlpha = 1;
            context.lineWidth = 2;
            context.strokeStyle = "#000099";
            // @TODO draw a better debug collision
            context.strokeRect(drawBox.x - 0.5, drawBox.y - 0.5, drawBox.width + 1, drawBox.height + 1);
            //} else {
            //    context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width * this.imageScale + 1 * scaleX, box.height * this.imageScale + 1 * scaleY);
            //}
        }
    }


});
