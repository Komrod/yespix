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

    collisionBox: function(relative) {

        var pos = this.getPosition(relative);

        if (yespix.isUndefined(this.imageScale)) {
            return {
                x: pos.x + this.colOffsetX,
                y: pos.y + this.colOffsetY,
                width: this.colWidth,
                height: this.colHeight,
                offsetX: this.colOffsetX,
                offsetY: this.colOffsetY,
            };
        } else {
            return {
                x: pos.x + this.colOffsetX * this.imageScale,
                y: pos.y + this.colOffsetY * this.imageScale,
                width: this.colWidth * this.imageScale,
                height: this.colHeight * this.imageScale,
                offsetX: this.colOffsetX * this.imageScale,
                offsetY: this.colOffsetY * this.imageScale,
            };
        }
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
            var box = drawBox || this.collisionBox();
            context.globalAlpha = 1;
            context.lineWidth = 0.5;
            context.strokeStyle = "#000099";
            // @TODO draw a better debug collision
            context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width + 1 * scaleX, box.height + 1 * scaleY);
            //} else {
            //    context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width * this.imageScale + 1 * scaleX, box.height * this.imageScale + 1 * scaleY);
            //}
        }
    }


});
