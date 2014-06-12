
yespix.define('layer', 'gfx', {
    data: {},

    isVisible: true,

    isReady: false,

    canvas: null,
    drawContext: null,
    data: null,
    level: null,
    
    create: function()
    {
    	
    },
    
    setLevel: function(level)
    {
    	this.level = level;
    },
    
    load: function(data)
    {
    	this.data = data;
    	this.update();
    },
    
    update: function()
    {
    	if (!this.data) return false;
    	
        this.canvas = document.createElement('canvas');
        this.drawContext = this.canvas.getContext('2d');
        
        this.width = this.data.width * this.data.tilewidth;
        this.height = this.data.height * this.data.tileheight;
        console.log('layer :: update :: width = '+this.width+', height = '+this.height);
        console.log(this);
        console.log(this.data);
    },
    
    getPosition: function(cellX, cellY)
    {
    	return {
//    		x: cellX * this.
    		};
    },
    
    drawTile: function(spriteIndex, cellX, cellY)
    {
    	console.log('drawTile :: spriteIndex = '+spriteIndex+', cellX = '+cellX+', cellY = '+cellY);
        /*context.drawImage(img.element, //image element
                x, // x position on image
                y, // y position on image
                frame.width * this.pixelSize, // width on image
                frame.height * this.pixelSize, // height on image
                canvasX, // x position on canvas
                canvasY, // y position on canvas
                frame.width * this.pixelSize, // width on canvas
                frame.height * this.pixelSize // height on canvas
            );*/
    	
    },
    
    clear: function()
    {
        if (this.canvas) this.canvas.width = this.canvas.width;
    },
    
    
    make: function() {
        console.log('layer :: make');
        
        this.clear();
        if (!this.data || !this.level) return;
        
        console.log('layer :: make :: start');
        console.log('data = ');
        console.log(this.data);
        
        var index = 0;
        
        for (var y = 0; y < this.level.data.height; y++) {
            for (var x = 0; x < this.data.width; x++) {
                var spriteIndex = this.data.data[index];
                if (spriteIndex > 1) {
                    //entity.context.fillStyle = colors[tileIndex];
                    console.log('layer :: make :: x=' + x + ', y=' + y + ', spriteIndex=' + spriteIndex);
                    this.drawTile(spriteIndex, x, y);
                }
                index++;
            }
        }
        this.isReady = true;
    },
});
