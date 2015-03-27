yespix.define('levelSprite', 'image', {

    ///////////////////////////////// Sprite functions //////////////////////////////////////

    getSpriteCount: function(imageIndex) {
        //console.log('getSpriteCount: imageIndex='+imageIndex+', image=', this.images[imageIndex]);        
        if (!this.isReady || !this.images[imageIndex] || !this.images[imageIndex].isReady) return false;
        var cols = Math.floor(this.images[imageIndex].width / this.spriteWidth);
        var rows = Math.floor(this.images[imageIndex].height / this.spriteHeight);
        //console.log('getSpriteCount: cols='+cols+', rows='+rows);        
        return cols * rows;
    },

    getSpriteImage: function(globalIndex) {
        //console.log('getSpriteImage: globalIndex='+globalIndex+', this.images=', this.images);
        var count;
        if (!this.isReady || !this.images) return false;
        for (var t = 0; t < this.images.length; t++) {
            if (!this.images[t] || !this.images[t].isReady) return false;
            count = this.getSpriteCount(t);
            //console.log('getSpriteImage: count = '+count);            
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
        return false;
    }

});
