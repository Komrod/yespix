
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

    isUnique: true,
    applyGravity: false,
    
    buildLevelCollision: function()
    {
    	for (var t=0; t<this.levelData.layers.length; t++)
    	{
    		var layer = this.levelData.layers[t];
    		if (layer.properties['type'] && layer.properties['type'] == 'decor')
    		{
    			continue;
    		}
    		for (var u=0; u<layer.data.length; u++)
   			{
    			if (!this.levelCollision[u]) this.levelCollision[u] = 0;
    			this.levelCollision[u] = this.levelCollision[u] + layer.data[u];
   			}
    	}
    },
    
    block: function(cellX, cellY) {
        var index = cellY * this.levelData.width + cellX;
        var tileIndex = this.levelCollision[index];
        console.log('block :: ('+cellX+', '+cellY+') :: index = ' + index + ', tileIndex = ' + tileIndex);
        if (tileIndex > 0) return true;
        return false;
    },

    hit: function(cellX, cellY, direction, speed) {
        return true;
    },

    collisionRight: function(entity, box, cellX, cellY) {
        this.hit(cellX, cellY, 'right', entity.speedX);
        entity.x = this.x + cellX * this.levelData.tilewidth - 0.0001 - box.offsetX - box.width;
        entity.speedX = 0;
    },

    collisionLeft: function(entity, box, cellX, cellY) {
        this.hit(cellX, cellY, 'left', entity.speedX);
        entity.x = this.x + (cellX + 1) * this.levelData.tilewidth + 0.0001 - box.offsetX;
        entity.speedX = 0;
    },

    collisionUp: function(entity, box, cellX, cellY) {
        this.hit(cellX, cellY, 'up', entity.speedY);
        var posY = this.y + (cellY + 1) * this.levelData.tileheight + 1 - box.offsetY;
        entity.y = posY;
        entity.speedY = 0;
    },

    collisionDown: function(entity, box, cellX, cellY) {
        this.hit(cellX, cellY, 'down', entity.speedY);
        entity.y = this.y + (cellY) * this.levelData.tileheight - box.offsetY - box.height - 1;
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

        var box = entity.collisionBox(this);

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

            //console.log('level.x = '+this.x+', level.y = '+this.y+', entity.x = '+entity.x+', entity.y = '+entity.y+', box.x = '+box.x+', box.y = '+box.y+', cellLeft = '+cellLeft+', cellNext = '+cellNext);

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
            // check every collision on the bottom
            var cellBottom = Math.floor((box.y + box.height) / this.levelData.tileheight);

            // cellNext is the final cell on the right of the entity
            var cellNext = Math.floor((box.y + box.height + entity.speedY) / this.levelData.tileheight);

            //console.log('cellBottom = '+cellBottom+', cellNext = '+cellNext);

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
            // check every collision on the bottom
            var cellTop = Math.floor(box.y / this.levelData.tileheight);

            // cellNext is the final cell on the right of the entity
            var cellNext = Math.floor((box.y + entity.speedY) / this.levelData.tileheight);

            //console.log('cellTop = ' + cellTop + ', cellNext = ' + cellNext);

            if (cellNext < cellTop) {

                up = true;

                var cellLeft = Math.floor(box.x / this.levelData.tilewidth);
                var cellRight = Math.floor((box.x + box.width) / this.levelData.tilewidth);
                var stopped = false;
                for (var y = cellTop; y >= cellNext; y--) {
                    for (var x = cellLeft; x <= cellRight; x++) {
                        //console.log('level.collision :: x=' + x + ', y=' + y + ', block=' + this.block(x, y));
                        if (this.block(x, y)) {
                            this.collisionUp(entity, box, x, y);
                            /*
									var posY = this.y + (y + 1) * this.levelData.tileheight + 1 - box.offsetY;
									console.log('entity posY from ' + entity.y + ' to ' + posY);
									entity.y = posY;
									entity.speedY = 0;
									*/
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
                console.log('Double collision right top');
                this.collisionUp(entity, box, cellRight, cellTop);
                this.collisionRight(entity, box, cellRight, cellTop);
            }
        } else if (!down && !right && entity.speedX > 0 && entity.speedY > 0) {
            var cellRight = Math.floor((box.x + box.width + entity.speedX) / this.levelData.tilewidth);
            var cellBottom = Math.floor((box.y + box.height + entity.speedY) / this.levelData.tileheight);
            if (this.block(cellRight, cellBottom)) {
                console.log('Double collision right down');
                //this.collisionDown(entity, box, cellRight, cellBottom);
                this.collisionRight(entity, box, cellRight, cellBottom);
            }
        } else if (!down && !left && entity.speedX < 0 && entity.speedY > 0) {
            var cellLeft = Math.floor((box.x + entity.speedX) / this.levelData.tilewidth);
            var cellBottom = Math.floor((box.y + box.height + entity.speedY) / this.levelData.tileheight);
            if (this.block(cellLeft, cellBottom)) {
                console.log('Double collision left down');
                //this.collisionDown(entity, box, cellLeft, cellBottom);
                this.collisionLeft(entity, box, cellLeft, cellBottom);
            }
        } else if (!up && !left && entity.speedX < 0 && entity.speedY < 0) {
            var cellLeft = Math.floor((box.x + entity.speedX) / this.levelData.tilewidth);
            var cellTop = Math.floor((box.y + entity.speedY) / this.levelData.tileheight);
            if (this.block(cellLeft, cellTop)) {
                console.log('Double collision left up');
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
                //console.log('entity NOT on ground');
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
        // destroy other loaded levels @todo
        //yespix.find('/level').not(this).destroy();
    	this.levelDir = yespix.getDir(src);
    	//console.log('level :: load :: dir = '+this.levelDir);

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        
        //console.log('level :: load :: loading level data for '+this.name);
        yespix.load(src, {
            'complete': function(e) {
            	var entity = e.entity;
                //console.log('complete for '+entity.name);
            	entity.levelData = JSON.parse(e.content);

                entity.canvas.width = entity.levelData.width * entity.levelData.tilewidth;
                entity.canvas.height = entity.levelData.height * entity.levelData.tileheight;
                entity.buildLevelCollision();
                
                //console.log(entity.levelData);
                if (entity.levelData.layers)
                {
                	// load tilesets
                	var images = [];
                	var count = entity.levelData.tilesets.length; 
                	for (var t = 0; t < count; t++)
               		{
                		//console.log('level :: complete :: t = '+t);
                		images.push(entity.levelDir+entity.levelData.tilesets[t].image);
                		//tileset.on('');
               		}
                	//console.log('images = ');
                	//console.log(images);
                    //console.log('level :: load / complete for '+entity.name+' :: tileset images count '+count);
                	entity.tilesets = yespix.spawn(
                			'image', 
                			{
                				registerInstance: false,
                				images: images,
                			});
                    entity.tilesets.on('imageReady', function()
                	{
                        console.log('level :: imageReady for '+entity.name);
                		entity.tilesetsReady();
                		yespix.level = entity;
                	}, entity);
                	
                }
            },
            'entity': this,
        });
    },
    
    tilesetsReady: function()
    {
        if (this._deleting)
        {
            console.log('Level currently deleting '+this.name+' ... '+this._deleting);
            return;
        }
    	// load layers
    	var layer = null;
    	var count = this.levelData.layers.length; 
		
    	console.log('level :: tilesetsReady :: layers count '+count);
    	for (var t = 0; t < count; t++)
   		{
    		//console.log('level :: tilesetsReady :: making layer t = '+t);
    		layer = yespix.spawn('layer');
            this.attach(layer);
    		layer.setLevel(this);
    		
    		//console.log('level :: tilesetsReady :: this.levelData = ');
    		//console.log(this.levelData);
    		
    		this.levelData.layers[t].tilewidth = this.levelData.tilewidth;
    		layer.load(this.levelData.layers[t]);
    		layer.make();
    		this.layers.push(layer);
   		}
    	this.isReady = true;
    },
    
});
