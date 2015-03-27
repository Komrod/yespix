function GfxManager(context, list) {
    this.context = context;
    this.list = list || [];

    this.zSorted = true;
}

GfxManager.prototype.draw = function() {

    if (!this.zSorted) this.sort();
}



GfxManager.prototype.add = function(entity) {
    list.push(entity);
    this.zSorted = false;
}

GfxManager.prototype.remove = function(entity) {

}

GfxManager.prototype.sort = function() {

}
