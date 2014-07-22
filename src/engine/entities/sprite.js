yespix.define('sprite', 'image', {

    spriteWidth: 32,
    spriteHeight: 32,

    getSpriteCount: function(imageIndex) {
        if (!this.isReady || !this.images[imageIndex] || !this.images[imageIndex].isReady) return false;
        var cols = Math.floor(this.images[imageIndex].realWidth / this.spriteWidth);
        var rows = Math.floor(this.images[imageIndex].realHeight / this.spriteHeight);
        return cols * rows;
    },

    getSpriteImage: function(globalIndex) {
        var count;
        if (!this.isReady || !this.images) return false;
        for (var t = 0; t < this.images.length; t++) {
            if (!this.images[t] || !this.images[t].isReady) return false;
            count = this.getSpriteCount(t);
            if (count > globalIndex) return this.images[t];
            globalIndex = globalIndex - count;
        }
        return false;
    },

    getSpriteImageIndex: function(globalIndex) {
        var count;
        if (!this.isReady || !this.images) return false;
        for (var t = 0; t < this.images.length; t++) {
            if (!this.images[t] || !this.images[t].isReady) return false;
            count = this.getSpriteCount(t);
            if (count > globalIndex) return globalIndex;
            globalIndex = globalIndex - count;
        }
        //        console.log('getSpriteImage :: not found');
        return false;
    }

});
