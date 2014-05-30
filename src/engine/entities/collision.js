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

    collisionBox: function() {
    	if (yespix.isUndefined(this.pixelSize))
    	{
	        return {
	            x: this.x + this.colOffsetX,
	            y: this.y + this.colOffsetY,
	            width: this.colWidth,
	            height: this.colHeight,
	            offsetX: this.colOffsetX,
	            offsetY: this.colOffsetY,
	        };
    	} else
   		{
	        return {
	            x: this.x + this.colOffsetX * this.pixelSize,
	            y: this.y + this.colOffsetY * this.pixelSize,
	            width: this.colWidth * this.pixelSize,
	            height: this.colHeight * this.pixelSize,
	            offsetX: this.colOffsetX * this.pixelSize,
	            offsetY: this.colOffsetY * this.pixelSize,
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
    }



});
