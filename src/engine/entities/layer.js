
yespix.define('layer', {
    data: {},

    isVisible: true,

    isReady: false,

    canvas: null,
    data: null,
    level: null,
    
    registerInstance: false,
    
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
        this._context = this.canvas.getContext('2d');
        
        this.canvas.width = this.data.width * this.data.tilewidth;
        this.canvas.height = this.data.height * this.data.tileheight;
    },
    
    drawTile: function(tileIndex, cellX, cellY, width, height)
    {
    	console.log('drawTile :: tileIndex = '+tileIndex+', cellX = '+cellX+', cellY = '+cellY+', width = '+width+', height = '+height);
    },
    
    clear: function()
    {
        if (this.canvas) this.canvas.width = this.canvas.width;
    },
    
    
    make: function() {
        console.log('layer :: make');
        console.log('this = ');
        console.log(this);
        
        this.clear();
        if (!this.isVisible) return;
        if (!this._context) return;
        if (!this.data || !this.level) return;
        
        console.log('layer :: make :: start');
        console.log('data = ');
        console.log(this.data);
        
        var index = 0;
        
        for (var y = 0; y < this.level.data.height; y++) {
            for (var x = 0; x < this.data.width; x++) {
                var tileIndex = this.data.data[index];
                if (tileIndex > 1) {
                    //entity.context.fillStyle = colors[tileIndex];
                    console.log('layer :: make :: x=' + x + ', y=' + y + ', tileIndex=' + tileIndex);
                    this.drawTile(tileIndex, x, y, this.level.data.width, this.level.data.height);
                }
                index++;
            }
        }
        entity.isReady = true;
    },
});
