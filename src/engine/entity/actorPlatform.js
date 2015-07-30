

yespix.define('actorPlatform', {


    inheritClass: 'actor',


    init: function(options, entity) {
        this.super(options, entity);

        if (yespix.isUndefined(this.speed)) {
            this.speed = 1;
        }

        if (yespix.isUndefined(this.waypoints)) {
            this.waypoints = new Array();
            this.selectedWaypoint = 0;
            this.addWaypoint(0, 0);
            if (this.to) {
                this.addWaypoint(this.to.x, this.to.y);
            }
        }
    },

    createPhysics: function(collision) {
        return collision.physics.create(collision);
    },


    resetWaypoint: function() {
        this.waypoints = new Array();
        this.selectedWaypoint = 0;
    },


    addWaypoint: function(x, y) {
        x = x || 0;
        y = y || 0;
        this.waypoints.push({x: x + this.entity.position.x, y: y + this.entity.position.y});
    },


    prepare: function() {
        if (!this.entity.collision || !this.entity.collision.isReady || this.waypoints.length <= 1) {
            return false;
        }

        var position = this.getWaypoint();
        var nextPosition = this.getNextWaypoint();

        if (this.entity.position.x-1 < position.x 
            && this.entity.position.x+1 > position.x
            && this.entity.position.y-1 < position.y
            && this.entity.position.y+1 > position.y) {
            this.nextWaypoint();
            position = this.getWaypoint();
            nextPosition = this.getNextWaypoint();
        }
        var vec = this.entity.collision.vec2((position.x - this.entity.position.x), (position.y - this.entity.position.y));
        vec.Normalize();
        vec.x *= this.speed;
        vec.y *= this.speed;
        this.entity.collision.setLinearVelocity(vec);
    },


    nextWaypoint: function() {
        this.selectedWaypoint++;
        if (this.selectedWaypoint>=this.waypoints.length) {
            this.selectedWaypoint = 0;
        }
    },


    getWaypoint: function() {
        return this.waypoints[this.selectedWaypoint];
    },


    getNextWaypoint: function() {
        var index = this.selectedWaypoint+1;
        if (index>=this.waypoints.length) {
            index = 0;
        }
        return this.waypoints[index];
    },


    getPreviousWaypoint: function() {
        var index = this.selectedWaypoint-1;
        if (index<0) {
            index = this.waypoints.length-1;
        }
        return this.waypoints[index];
    },


});

