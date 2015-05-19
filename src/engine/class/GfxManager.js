

function GfxManager(canvas, list) {
	
	// init
	this.canvas = null;
	this.context = null;

	// set the canvas
	if (canvas === true) this.setCanvas(yespix.createCanvas(true));
	else if (canvas) this.setCanvas(canvas);

	// set the list
    this.list = list || [];

    this.zSorted = false;
}


GfxManager.prototype.setCanvas = function(canvas) {
	this.canvas = canvas;
	if (this.canvas) {
		this.context = this.canvas.getContext('2d');
	} else {
		this.context = null;
	}
}


GfxManager.prototype.draw = function() {

    if (!this.zSorted) this.sort();
    var length = this.list.length,
    	t=0;
    for (; t<length; t++) {
    	this.list[t].draw(this.canvas);
    }
}


GfxManager.prototype.add = function(entity) {
    this.list.push(entity);
    this.zSorted = false;
    return this.list.length - 1;
}


GfxManager.prototype.remove = function(entity) {
}


GfxManager.prototype.destroy = function(entity) {

}


GfxManager.prototype.sort = function() {

    this.zSorted = true;
}
