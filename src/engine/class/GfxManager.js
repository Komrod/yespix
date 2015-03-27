
function GfxManager(canvas, list) {
    this.canvas = canvas;
    this.list = list || [];

    this.zSorted = false;
}

GfxManager.prototype.draw = function() {

    if (!this.zSorted) this.sort();
    var length = this.list.length;
    for (var t=0; t<length; t++) {

    }
}



GfxManager.prototype.add = function(entity) {
    this.list.push(entity);
    this.zSorted = false;
}

GfxManager.prototype.remove = function(entity) {

}

GfxManager.prototype.sort = function() {

    this.zSorted = true;
}
