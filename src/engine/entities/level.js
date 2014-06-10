
yespix.define('level', 'gfx', {
    data: null,

    isVisible: true,

    isReady: false,

    layers: [],

    canvas: null,
    context: null,
    tilesets: null,
    levelDir: '',
    
    block: function(x, y) {
        var index = y * this.data.width + x;
        var tileIndex = this.data.layers[0].data[index];
        //console.log('block :: index = ' + index + ', tileIndex = ' + tileIndex);
        if (tileIndex > 1) return true;
        return false;
    },

    hit: function(cellX, cellY, direction, speed) {
        return true;
    },

    collisionRight: function(entity, box, cellX, cellY) {
        this.hit(cellX, cellY, 'right', entity.speedX);
        entity.x = this.x + cellX * this.data.tilewidth - 0.0001 - box.offsetX - box.width;
        entity.speedX = 0;
    },

    collisionLeft: function(entity, box, cellX, cellY) {
        this.hit(cellX, cellY, 'left', entity.speedX);
        entity.x = this.x + (cellX + 1) * this.data.tilewidth + 0.0001 - box.offsetX;
        entity.speedX = 0;
    },

    collisionUp: function(entity, box, cellX, cellY) {
        this.hit(cellX, cellY, 'up', entity.speedY);
        var posY = this.y + (cellY + 1) * this.data.tileheight + 1 - box.offsetY;
        entity.y = posY;
        entity.speedY = 0;
    },

    collisionDown: function(entity, box, cellX, cellY) {
        this.hit(cellX, cellY, 'down', entity.speedY);
        entity.y = this.y + (cellY) * this.data.tileheight - box.offsetY - box.height - 1;
        entity.speedY = 0;
        entity.isOnGround = true;
        entity.isJumping = false;
        entity.isFalling = false;
        this.accelY = 0;
    },

    collision: function(entity) {
        if (entity.speedX == 0 && entity.speedY == 0) return;

        var left = false,
            right = false,
            up = false,
            down = false;

        //console.log('level.collision :: #1 speedX = ' + entity.speedX + ', speedY = ' + entity.speedY);

        var box = entity.collisionBox();


        if (entity.speedX > 0) {
            // check every collision on the right
            var cellRight = Math.floor((box.x + box.width) / this.data.tilewidth);

            // cellNext is the final cell on the right of the entity
            var cellNext = Math.floor((box.x + box.width + entity.speedX) / this.data.tilewidth);

            if (cellNext > cellRight) {

                right = true;

                var cellTop = Math.floor(box.y / this.data.tileheight);
                var cellBottom = Math.floor((box.y + box.height) / this.data.tileheight);
                var stopped = false;
                for (var x = cellRight; x <= cellNext; x++) {
                    for (var y = cellTop; y <= cellBottom; y++) {
                        if (this.block(x, y)) {
                            this.collisionRight(entity, box, x, y);
                            //var posX = this.x + (x) * this.data.tilewidth - 0.0001 - box.offsetX - box.width;
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
            var cellLeft = Math.floor(box.x / this.data.tilewidth);

            // cellNext is the final cell on the left of the entity
            var cellNext = Math.floor((box.x + entity.speedX) / this.data.tilewidth);

            //console.log('cellLeft = '+cellLeft+', cellNext = '+cellNext);

            if (cellNext < cellLeft) {

                left = true;

                var cellTop = Math.floor(box.y / this.data.tileheight);
                var cellBottom = Math.floor((box.y + box.height) / this.data.tileheight);
                var stopped = false;
                for (var x = cellLeft; x >= cellNext; x--) {
                    for (var y = cellTop; y <= cellBottom; y++) {
                        if (this.block(x, y)) {
                            this.collisionLeft(entity, box, x, y);
                            /*var posX = this.x + (x + 1) * this.data.tilewidth + 0.0001 - box.offsetX;
									entity.x = posX;
									entity.speedX = 0;*/
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
            var cellBottom = Math.floor((box.y + box.height) / this.data.tileheight);

            // cellNext is the final cell on the right of the entity
            var cellNext = Math.floor((box.y + box.height + entity.speedY) / this.data.tileheight);

            //console.log('cellBottom = '+cellBottom+', cellNext = '+cellNext);

            if (cellNext > cellBottom) {

                down = true;

                var cellLeft = Math.floor(box.x / this.data.tilewidth);
                var cellRight = Math.floor((box.x + box.width) / this.data.tilewidth);
                var stopped = false;
                for (var y = cellBottom; y <= cellNext; y++) {
                    for (var x = cellLeft; x <= cellRight; x++) {
                        if (this.block(x, y)) {
                            this.collisionDown(entity, box, x, y);
                            /*
									var posY = this.y + (y) * this.data.tileheight - box.offsetY - box.height - 1;
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
            var cellTop = Math.floor(box.y / this.data.tileheight);

            // cellNext is the final cell on the right of the entity
            var cellNext = Math.floor((box.y + entity.speedY) / this.data.tileheight);

            //console.log('cellTop = ' + cellTop + ', cellNext = ' + cellNext);

            if (cellNext < cellTop) {

                up = true;

                var cellLeft = Math.floor(box.x / this.data.tilewidth);
                var cellRight = Math.floor((box.x + box.width) / this.data.tilewidth);
                var stopped = false;
                for (var y = cellTop; y >= cellNext; y--) {
                    for (var x = cellLeft; x <= cellRight; x++) {
                        //console.log('level.collision :: x=' + x + ', y=' + y + ', block=' + this.block(x, y));
                        if (this.block(x, y)) {
                            this.collisionUp(entity, box, x, y);
                            /*
									var posY = this.y + (y + 1) * this.data.tileheight + 1 - box.offsetY;
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
            var cellRight = Math.floor((box.x + box.width + entity.speedX) / this.data.tilewidth);
            var cellTop = Math.floor((box.y + entity.speedY) / this.data.tileheight);
            if (this.block(cellRight, cellTop)) {
                console.log('Double collision right top');
                this.collisionUp(entity, box, cellRight, cellTop);
                this.collisionRight(entity, box, cellRight, cellTop);
            }
        } else if (!down && !right && entity.speedX > 0 && entity.speedY > 0) {
            var cellRight = Math.floor((box.x + box.width + entity.speedX) / this.data.tilewidth);
            var cellBottom = Math.floor((box.y + box.height + entity.speedY) / this.data.tileheight);
            if (this.block(cellRight, cellBottom)) {
                console.log('Double collision right down');
                //this.collisionDown(entity, box, cellRight, cellBottom);
                this.collisionRight(entity, box, cellRight, cellBottom);
            }
        } else if (!down && !left && entity.speedX < 0 && entity.speedY > 0) {
            var cellLeft = Math.floor((box.x + entity.speedX) / this.data.tilewidth);
            var cellBottom = Math.floor((box.y + box.height + entity.speedY) / this.data.tileheight);
            if (this.block(cellLeft, cellBottom)) {
                console.log('Double collision left down');
                //this.collisionDown(entity, box, cellLeft, cellBottom);
                this.collisionLeft(entity, box, cellLeft, cellBottom);
            }
        } else if (!up && !left && entity.speedX < 0 && entity.speedY < 0) {
            var cellLeft = Math.floor((box.x + entity.speedX) / this.data.tilewidth);
            var cellTop = Math.floor((box.y + entity.speedY) / this.data.tileheight);
            if (this.block(cellLeft, cellTop)) {
                console.log('Double collision left up');
                this.collisionUp(entity, box, cellLeft, cellTop);
                this.collisionLeft(entity, box, cellLeft, cellTop);
            }
        }

        if (entity.speedY == 0) {
            // check if the entity is on ground
            var cellBottom = Math.floor((box.y + box.height) / this.data.tileheight);
            var cellNext = Math.floor((box.y + box.height + 1) / this.data.tileheight);
            if (cellNext == cellBottom) {
                entity.isOnGround = false;
                //console.log('entity NOT on ground');
            } else {
                entity.isOnGround = false;
                var cellLeft = Math.floor(box.x / this.data.tilewidth);
                var cellRight = Math.floor((box.x + box.width) / this.data.tilewidth);
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
    	console.log('level :: load :: dir = '+this.levelDir);

        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext('2d');
        
        yespix.load(src, {
            'complete': function(e) {
            	var entity = e.entity;
            	entity.data = JSON.parse(e.content);

                entity.canvas.width = entity.data.width * entity.data.tilewidth;
                entity.canvas.height = entity.data.height * entity.data.tileheight;
        
                console.log(entity.data);
                if (entity.data.layers)
                {
                	// load tilesets
                	var images = [];
                	var count = entity.data.tilesets.length; 
            		console.log('level :: complete :: tilesets count '+count);
                	for (var t = 0; t < count; t++)
               		{
                		console.log('level :: complete :: t = '+t);
                		images.push(entity.levelDir+entity.data.tilesets[t].image);
                		//tileset.on('');
               		}
                	console.log('images = ');
                	console.log(images);
                	entity.tilesets = yespix.spawn(
                			'image', 
                			{
                				registerInstance: false,
                				images: images,
                			});
                	console.log('level :: complete :: adding imaeReady event');
                    entity.tilesets.on('imageReady', function()
                	{
                        console.log('trigger imageReady :: this = ')
                        console.log(this);
                        console.log('trigger imageReady :: entity = ')
                        console.log(entity);
                		entity.tilesetsReady();
                	}, entity);
                	
                }
            },
            'entity': this,
        });
    },
    
    tilesetsReady: function()
    {
        console.log('imageReady :: ----------------------');
    	
    	// load layers
    	var layer = null;
    	var count = this.data.layers.length; 
		console.log('level :: complete :: layers count '+count);
    	for (var t = 0; t < count; t++)
   		{
    		console.log('level :: complete :: t = '+t);
    		layer = yespix.spawn('layer');
    		layer.setLevel(this);
    		layer.load(this.data.layers[t]);
    		layer.make();
    		this.layers.push(layer);

            break;
   		}
    	this.isReady = true;
    },
    
    draw: function(context) {
        //console.log('level draw');
        if (!this.isVisible) return;

        //console.log('level draw #2');
        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }

        //console.log('level draw #3 context = '+context+', isReady = '+this.isReady);
        if (context && this.isReady) {
            context.globalAlpha = this.alpha;
            console.log('level draw #4');
            for (var t=0; t<this.layers.length; t++)
            {
                console.log('this = ');
                console.log(this);
                this.context.drawImage(this.layers[t].canvas, //image element
                    0, // x position on image
                    0, // y position on image
                    this.canvas.width, // width on image
                    this.canvas.height, // height on image
                    0, // x position on canvas
                    0, // y position on canvas
                    this.canvas.width, // width on canvas
                    this.canvas.height // height on canvas
                );
            }

            context.drawImage(this.canvas, //image element
                0, // x position on image
                0, // y position on image
                this.canvas.width, // width on image
                this.canvas.height, // height on image
                0, // x position on canvas
                0, // y position on canvas
                this.canvas.width, // width on canvas
                this.canvas.height // height on canvas
            );
        }
    },
});
