yespix.define('level', 'gfx,move', {
    levelData: null,
    levelCollision: [],

    isVisible: true,
    isReady: false,

    layers: [],

    canvas: null,
    context: null,
    tilesets: null,
    levelDir: '',
    followOptions: null,

    isUnique: true,
    canApplyGravity: false,


    init: function()
    {
        this.readyFunctions.push(this.checkReadyStateLevel);
    },

    checkReadyStateLevel: function()
    {
        // @todo
        return false;
    },

    buildLevelCollision: function() {
        for (var t = 0; t < this.levelData.layers.length; t++) {
            var layer = this.levelData.layers[t];
            if (layer.properties && layer.properties['type'] && (layer.properties['type'] == 'decor' || layer.properties['type'] == 'parallax')) {
                continue;
            }
            if (layer.data) for (var u = 0; u < layer.data.length; u++) {
                if (!this.levelCollision[u]) this.levelCollision[u] = 0;
                this.levelCollision[u] = this.levelCollision[u] + layer.data[u];
            }
        }
    },

    block: function(cellX, cellY) {
        var index = cellY * this.levelData.width + cellX;
        var tileIndex = this.levelCollision[index];
        if (tileIndex && tileIndex > 0) return true;
        return false;
    },

    hit: function(cellX, cellY, direction, speed) {
        return true;
    },

    collisionRight: function(entity, box, cellX, cellY) {
        //console.log('collisionRight :: cellX: '+cellX+', cellY: '+cellY);
        this.hit(cellX, cellY, 'right', entity.speedX);
        entity.x = cellX * this.levelData.tilewidth - 0.0001 - box.offsetX - box.width;
        entity.speedX = 0;
    },

    collisionLeft: function(entity, box, cellX, cellY) {
        //console.log('collisionLeft :: cellX: '+cellX+', cellY: '+cellY);
        this.hit(cellX, cellY, 'left', entity.speedX);
        entity.x = (cellX + 1) * this.levelData.tilewidth + 0.0001 - box.offsetX;
        entity.speedX = 0;
    },

    collisionUp: function(entity, box, cellX, cellY) {
        //console.log('collisionUp :: cellX: '+cellX+', cellY: '+cellY);
        this.hit(cellX, cellY, 'up', entity.speedY);
        var posY = (cellY + 1) * this.levelData.tileheight + 1 - box.offsetY;
        entity.y = posY;
        entity.speedY = 0;
    },

    collisionDown: function(entity, box, cellX, cellY) {
        //if (yespix.frameIndex<100) console.log('collisionDown :: tileheight: '+this.levelData.tileheight+', cellY: '+cellY+', entity.y: '+entity.y+', box.y: '+box.y+', box.offsetY: '+box.offsetY+', box.height: '+box.height);
        this.hit(cellX, cellY, 'down', entity.speedY);
        var delta = box.y - entity.y;
        entity.y = cellY * this.levelData.tileheight - box.offsetY - box.height - 1;
        entity.speedY = 0;
        entity.isOnGround = true;
        entity.isJumping = false;
        entity.isFalling = false;
        this.accelY = 0;
    },

    collision: function(entity) {
        if (entity.speedX == 0 && entity.speedY == 0) return;
        if (!entity.collisionBox) return;

        var left = false,
            right = false,
            up = false,
            down = false;

        var box = entity.collisionBox(true);

        if (entity.speedX > 0) {
            // check every collision on the right
            var cellRight = Math.floor((box.x + box.width) / this.levelData.tilewidth);

            // cellNext is the final cell on the right of the entity
            var cellNext = Math.floor((box.x + box.width + entity.speedX) / this.levelData.tilewidth);

            if (cellNext > cellRight) {

                right = true;

                var cellTop = Math.floor(box.y / this.levelData.tileheight);
                var cellBottom = Math.floor((box.y + box.height) / this.levelData.tileheight);
                var stopped = false;
                for (var x = cellRight; x <= cellNext; x++) {
                    for (var y = cellTop; y <= cellBottom; y++) {
                        if (this.block(x, y)) {
                            this.collisionRight(entity, box, x, y);
                            //var posX = this.x + (x) * this.levelData.tilewidth - 0.0001 - box.offsetX - box.width;
                            //entity.x = posX;
                            //entity.speedX = 0;
                            stopped = true;
                            break;
                        }
                    }
                    if (stopped) break;
                }
            }
        } else if (entity.speedX < 0) {
            // check every collision on the left
            var cellLeft = Math.floor((box.x) / this.levelData.tilewidth);

            // cellNext is the final cell on the left of the entity
            var cellNext = Math.floor((box.x + entity.speedX) / this.levelData.tilewidth);

            if (cellNext < cellLeft) {

                left = true;

                var cellTop = Math.floor(box.y / this.levelData.tileheight);
                var cellBottom = Math.floor((box.y + box.height) / this.levelData.tileheight);
                var stopped = false;
                for (var x = cellLeft; x >= cellNext; x--) {
                    for (var y = cellTop; y <= cellBottom; y++) {
                        if (this.block(x, y)) {
                            this.collisionLeft(entity, box, x, y);
                            stopped = true;
                            break;
                        }
                    }
                    if (stopped) break;
                }
            }
        }

        if (entity.speedY > 0) {
            // check every collision on the floor
            var cellBottom = Math.floor((box.y + box.height) / this.levelData.tileheight);

            // cellNext is the final cell under the entity
            var cellNext = Math.floor((box.y + box.height + entity.speedY) / this.levelData.tileheight);

            if (cellNext > cellBottom) {

                down = true;

                var cellLeft = Math.floor(box.x / this.levelData.tilewidth);
                var cellRight = Math.floor((box.x + box.width) / this.levelData.tilewidth);
                var stopped = false;
                for (var y = cellBottom; y <= cellNext; y++) {
                    for (var x = cellLeft; x <= cellRight; x++) {
                        if (this.block(x, y)) {
                            this.collisionDown(entity, box, x, y);
                            /*
									var posY = this.y + (y) * this.levelData.tileheight - box.offsetY - box.height - 1;
									//console.log('block :: x = '+x+', y = '+y+', poxY = '+posY);
									console.log('entity posY from ' + entity.y + ' to ' + posY);
									entity.y = posY;
									entity.speedY = 0;
									entity.isOnGround = true;
									entity.isJumping = false;
									entity.isFalling = false;
									this.accelY = 0;*/
                            stopped = true;
                            break;
                        }
                    }
                    if (stopped) break;
                }
            }
        } else if (entity.speedY < 0) {
            // check every collision on the ceiling
            var cellTop = Math.floor(box.y / this.levelData.tileheight);

            // cellNext is the final cell on the top of the entity
            var cellNext = Math.floor((box.y + entity.speedY) / this.levelData.tileheight);

            if (cellNext < cellTop) {

                up = true;

                var cellLeft = Math.floor(box.x / this.levelData.tilewidth);
                var cellRight = Math.floor((box.x + box.width) / this.levelData.tilewidth);
                var stopped = false;
                for (var y = cellTop; y >= cellNext; y--) {
                    for (var x = cellLeft; x <= cellRight; x++) {
                        if (this.block(x, y)) {
                            this.collisionUp(entity, box, x, y);
                            stopped = true;
                            break;
                        }
                    }
                    if (stopped) break;
                }
            }
        }

        if (!up && !right && entity.speedX > 0 && entity.speedY < 0) {
            var cellRight = Math.floor((box.x + box.width + entity.speedX) / this.levelData.tilewidth);
            var cellTop = Math.floor((box.y + entity.speedY) / this.levelData.tileheight);
            if (this.block(cellRight, cellTop)) {
                this.collisionUp(entity, box, cellRight, cellTop);
                this.collisionRight(entity, box, cellRight, cellTop);
            }
        } else if (!down && !right && entity.speedX > 0 && entity.speedY > 0) {
            var cellRight = Math.floor((box.x + box.width + entity.speedX) / this.levelData.tilewidth);
            var cellBottom = Math.floor((box.y + box.height + entity.speedY) / this.levelData.tileheight);
            if (this.block(cellRight, cellBottom)) {
                //this.collisionDown(entity, box, cellRight, cellBottom);
                this.collisionRight(entity, box, cellRight, cellBottom);
            }
        } else if (!down && !left && entity.speedX < 0 && entity.speedY > 0) {
            var cellLeft = Math.floor((box.x + entity.speedX) / this.levelData.tilewidth);
            var cellBottom = Math.floor((box.y + box.height + entity.speedY) / this.levelData.tileheight);
            if (this.block(cellLeft, cellBottom)) {
                //this.collisionDown(entity, box, cellLeft, cellBottom);
                this.collisionLeft(entity, box, cellLeft, cellBottom);
            }
        } else if (!up && !left && entity.speedX < 0 && entity.speedY < 0) {
            var cellLeft = Math.floor((box.x + entity.speedX) / this.levelData.tilewidth);
            var cellTop = Math.floor((box.y + entity.speedY) / this.levelData.tileheight);
            if (this.block(cellLeft, cellTop)) {
                this.collisionUp(entity, box, cellLeft, cellTop);
                this.collisionLeft(entity, box, cellLeft, cellTop);
            }
        }

        if (entity.speedY == 0) {
            // check if the entity is on ground
            var cellBottom = Math.floor((box.y + box.height) / this.levelData.tileheight);
            var cellNext = Math.floor((box.y + box.height + 1) / this.levelData.tileheight);
            if (cellNext == cellBottom) {
                entity.isOnGround = false;
            } else {
                entity.isOnGround = false;
                var cellLeft = Math.floor(box.x / this.levelData.tilewidth);
                var cellRight = Math.floor((box.x + box.width) / this.levelData.tilewidth);
                var stopped = false;
                for (var y = cellBottom; y <= cellNext; y++) {
                    for (var x = cellLeft; x <= cellRight; x++) {
                        if (this.block(x, y)) {
                            //console.log('entity on ground');
                            entity.isOnGround = true;
                            entity.isJumping = false;
                            entity.isFalling = false;
                            this.accelY = 0;
                            stopped = true;
                            break;
                        }
                    }
                    if (stopped) break;
                }
            }
        } else entity.isOnGround = false;

    },


    load: function(src) {
        this.levelDir = yespix.getDir(src);

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');

        yespix.load(src, {
            'complete': function(e) {
                var entity = e.entity;
                entity.levelData = JSON.parse(e.content);

                entity.canvas.width = entity.levelData.width * entity.levelData.tilewidth;
                entity.canvas.height = entity.levelData.height * entity.levelData.tileheight;

                entity.width = entity.canvas.width;
                entity.height = entity.canvas.height;

                entity.buildLevelCollision();

                if (entity.levelData.layers) {
                    // load tilesets
                    var images = [];
                    var count = entity.levelData.tilesets.length;
                    for (var t = 0; t < count; t++) {
                        images.push(entity.levelDir + entity.levelData.tilesets[t].image);
                    }
                    entity.tilesets = yespix.spawn(
                        'image', {
                            registerInstance: false,
                            images: images,
                        });
                    entity.tilesets.on('imageReady', function() {
                        console.log('level :: imageReady for ' + entity.name);
                        entity.tilesetsReady();
                        yespix.level = entity;
                    }, entity);

                }
            },
            'entity': this,
        });
        return this;
    },

    tilesetsReady: function() {
        if (this._deleting) {
            return;
        }
        // load layers
        var layer = null;
        var count = this.levelData.layers.length;

        for (var t = 0; t < count; t++) {
            layer = yespix.spawn('layer');
            this.childAdd(layer);
            layer.setLevel(this);

            this.levelData.layers[t].tilewidth = this.levelData.tilewidth;
            layer.load(this.levelData.layers[t]);
            layer.make();
            this.layers.push(layer);
        }
        this.ready();
    },

    follow: function(entity, options) {
        if (!entity) {
            console.error('follow :: invalid entity to follow')
            return false;
        }

        this.childAdd(entity);

        options = options || {};
        if (yespix.isUndefined(options.positionX)) options.positionX = 0.5;
        if (yespix.isUndefined(options.positionY)) options.positionY = 0.5;
        if (yespix.isUndefined(options.speedX)) options.speedX = 1;
        if (yespix.isUndefined(options.speedY)) options.speedY = 0.02;

        this.followOptions = options;

        if (options.reset) this.followReset(entity);

        entity.on('moveEnd', function(e) {
            if (e.entity && e.entity._parent) e.entity._parent.followEntity(e.entity);
        });
    },

    followReset: function(entity) {
        if (!entity.isReady)
        {
            entity.on('entityReady', function() {
                this._parent.followReset(this);
            });
            return false;
        }

        var delta = this.followEntityDelta(entity);
        if (delta)
        {
            this.moveTo(this.x + delta.x, this.y + delta.y);
            return true;
        }
        return false;
    },

    followEntityDelta: function(entity, context)    
    {
        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }
        var boxEntity = entity.getDrawBox(true);
        var centerX = context.canvas.width * this.followOptions.positionX - boxEntity.width / 2;
        var centerY = context.canvas.height * this.followOptions.positionY - boxEntity.height / 2;
        var deltaX = centerX - boxEntity.x - this.x;
        var deltaY = centerY - boxEntity.y - this.y;
        if (isNaN(deltaX) && isNaN(deltaY)) return false;
        return {x: deltaX, y: deltaY};
    },

    followEntity: function(entity, context) {
        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }
        var delta = this.followEntityDelta(entity, context);
        if (delta) this.moveTo(this.x + delta.x * this.followOptions.speedX, this.y + delta.y * this.followOptions.speedY);
    },
    
    unfollow: function() {
        this.followOptions = null;
        this.moveStop();
    },


});
