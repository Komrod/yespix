
yespix.define('layer', 'gfx', {
	
    isVisible: true,

    isReady: false,

    canvas: null,
    drawContext: null,
    
    layerData: null,
    
    level: null,
    
    create: function()
    {
    	
    },
    
    setLevel: function(level)
    {
    	this.level = level;
    },
    
    load: function(layerData)
    {
    	this.layerData = layerData;
    	this.update();
    },
    
    update: function()
    {
    	if (!this.layerData) return false;
    	
        this.canvas = document.createElement('canvas');
        this.drawContext = this.canvas.getContext('2d');
        
        this.width = this.layerData.width * this.layerData.tilewidth;
        this.height = this.layerData.height * this.layerData.tilewidth;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        console.log('layer :: update :: width = '+this.width+', height = '+this.height);
        console.log(this);
        console.log(this.layerData);
    },
    
    drawTile: function(spriteIndex, cellX, cellY)
    {
    	//console.log('drawTile :: spriteIndex = '+spriteIndex+', cellX = '+cellX+', cellY = '+cellY);
    	var img = this.level.tilesets.image(0);
    	if (!img.isReady)
  		{
    		console.error('layer::drawTile :: image [0] of the tile set is not ready');
    		return false;
  		}
    	var infos = this.level.levelData.tilesets[0];
    	var max = Math.floor(img.element.width / infos.tilewidth);
    	var line = Math.floor(spriteIndex / max);
    	var col = spriteIndex - (line * max);
    	/*console.log('max = '+max);
    	console.log('img.element.width = '+img.element.width+', infos.tilewidth = '+infos.tilewidth+', line = '+line),
    	console.log('col = '+col);
    	console.log('drawTile :: infos = ');
    	console.log(infos);*/
    	
    	console.log('drawTile: line = '+line+', col = '+col+', max = '+max+', tilewidth = '+this.layerData.tilewidth+', pox = '+(line * this.layerData.tilewidth));
    	
        this.drawContext.drawImage(img.element, //image element
                col * this.layerData.tilewidth, // x position on image
                line * this.layerData.tilewidth, // y position on image
                this.layerData.tilewidth, // width on image
                this.layerData.tilewidth, // height on image
                cellX * this.layerData.tilewidth, // x position on canvas
                cellY * this.layerData.tilewidth, // y position on canvas
                this.layerData.tilewidth, // width on canvas
                this.layerData.tilewidth // height on canvas
            );
    },
    
    clear: function()
    {
        if (this.canvas) this.canvas.width = this.canvas.width;
    },
    
    
    make: function() {
        console.log('layer :: make');
        
        this.clear();
        if (!this.layerData || !this.level) return;
        
        console.log('layer :: make :: start');
        console.log('layerData = ');
        console.log(this.layerData);
        
        var index = 0;
        
        for (var y = 0; y < this.layerData.height; y++) {
            for (var x = 0; x < this.layerData.width; x++) {
                var spriteIndex = this.layerData.data[index]-1;
                if (spriteIndex >= 0) {
                	this.drawTile(spriteIndex, x, y);
                }
                index++;
            }
        }
        this.isReady = true;
    },
    
    draw: function(context)
    {
        if (!this.isVisible) return;

        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }

        if (context && this.drawContext) {
            context.globalAlpha = this.alpha;
            context.drawImage(this.canvas, //image element
                0, // x position on image
                0, // y position on image
                this.canvas.width, // width on image
                this.canvas.height // height on image
            );
        }
    },
});
