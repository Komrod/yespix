/*******************************************************************************************************************************
 ********************************************************************************************************************************
 * Collision detection
 */

/**
 * clear the collision map
 * @chainable
 */
yespix.fn.collisionClear = function() {
    this.data.collisionMap = [];
    return this;
};

/**
 * Change the cell size of the collision map and clear the collision map
 * @param  {Number} size Cell size in pixels
 */
yespix.fn.collisionCellSize = function(size) {
    if (size < 1) size = 32;
    this.collisionSize = size;
    this.collisionClear();
    return this;
};

/**
 * Returns an array of cell objects that matches with the collision map of the entity
 */
yespix.fn.collisionCell = function(x, y, type) {
    if (type == 'canvas') {
        var x = Math.floor(x / this.collisionSize);
        var y = Math.floor(y / this.collisionSize);
    }

    var line = this.data.collisionMap[x];
    if (!line) line = this.data.collisionMap[x] = [];
    if (!line[y]) line[y] = [];
    return line[y];
};


/**
 * Add the entity in the collision map according to the collision box
 * @chainable
 * @todo shouldnt always be a box (cirle, elipse ...)
 * @todo multiple box for an entity
 */
yespix.fn.collisionOccupy = function(entity) {
    var box = entity.collisionBox();
    if (box.width <= 0 || box.height <= 0) return;

    var cellX = minCellX = Math.floor(box.x / this.collisionSize);
    var cellY = minCellY = Math.floor(box.y / this.collisionSize);
    var maxCellX = Math.floor((box.x + box.width) / this.collisionSize);
    var maxCellY = Math.floor((box.y + box.height) / this.collisionSize);

    while (cellX <= maxCellX) {
        cellY = minCellY;
        while (cellY <= maxCellY) {
            this.collisionAdd(entity, cellX, cellY);
            cellY++;
        }
        cellX++;
    }
    return this;
};

yespix.fn.collisionAdd = function(entity, x, y, type) {
    if (type == 'canvas') {
        var x = Math.floor(x / this.collisionSize);
        var y = Math.floor(y / this.collisionSize);
    }

    var line = this.data.collisionMap[x];
    if (!line) {
        line = this.data.collisionMap[x] = [];
        line[y] = [entity];
        return this;
    }
    if (!line[y]) {
        line[y] = [];
    }
    line[y].push(entity);
    this.unique(line[y]);
    return this;
};

yespix.fn.collisionCheck = function(entity1, entity2) {
    var box1 = entity1.collisionBox();
    var box2 = entity2.collisionBox();

    // check if box1 is left of box2
    if (box1.x + box1.width - 1 < box2.x) return false;

    // check if box1 is right of box2
    if (box1.x + 1 > box2.x + box2.width) return false;

    // check if box1 is above box2
    if (box1.y + box1.height - 1 < box2.y) return false;

    // check if box1 is under box2
    if (box1.y + 1 > box2.y + box2.height) return false;

    // else box1 intersects box2
    return true;
};

yespix.fn.collisionTouch = function(entity1, entity2, pixel) {
    if (this.isUndefined(pixel)) pixel = 1;
    var box1 = entity1.collisionBox();
    var box2 = entity2.collisionBox();
    //this.dump(box1, 'box1');
    //this.dump(box2, 'box2');
    // check if box1 is left of box2
    if (box1.x + box1.width > box2.x - pixel && box1.x + box1.width < box2.x + pixel) return true;

    // check if box1 is right of box2
    if (box1.x > box2.x + box2.width - pixel && box1.x < box2.x + box2.width + pixel) return true;

    // check if box1 is above box2
    if (box1.y + box1.height > box2.y - pixel && box1.y + box1.height < box2.y + pixel) return true;

    // check if box1 is under box2
    if (box1.y > box2.y + box2.height - pixel && box1.y < box2.y + box2.height + pixel) return true;

    // else box1 intersects box2
    return false;
};

yespix.fn.collisionInside = function(entity1, entity2) {
    var box1 = entity1.collisionBox();
    var box2 = entity2.collisionBox();

    // check if box1 is inside of box2
    if (box2.x <= box1.x && box2.x + box2.width >= box1.x + box1.width && box2.y <= box1.y && box2.y + box2.height >= box1.y + box1.height) return true;
    return false;
};

/**
 * @chainable
 */
yespix.fn.collision = function(entity) {
    var entities = []; // store checked entities to check for collision only once

    var box = entity.collisionBox();
    if (box.width <= 0 || box.height <= 0) {
        return;
    }
    var cellX = minCellX = Math.floor(box.x / this.collisionSize);
    var cellY = minCellY = Math.floor(box.y / this.collisionSize);
    var maxCellX = Math.floor((box.x + box.width) / this.collisionSize);
    var maxCellY = Math.floor((box.y + box.height) / this.collisionSize);

    while (cellX <= maxCellX) {
        cellY = minCellY;
        while (cellY <= maxCellY) {
            var cell = this.collisionCell(cellX, cellY);
            for (var t = 0; t < cell.length; t++) {
                if (cell[t] !== entity && !this.inArray(entities, cell[t])) {
                    if (entity.collisionWith(cell[t]) && this.collisionCheck(entity, cell[t])) {
                        entity.trigger('collide', {
                            entity: cell[t]
                        });
                    }
                }
                entities.push(cell[t]);
            }
            cellY++;
        }
        cellX++;
    }
    return this;
};
