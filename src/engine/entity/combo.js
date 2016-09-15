

yespix.defineEntity('combo', {


    inheritClass: 'gfx',


    init: function(properties) {
        properties = properties || {};
        if (yespix.isString(properties)) {
            properties = {image: {src: properties}};
        }
        this.super(properties);

        this.createCanvas();

        this.list = this.list || [];
        this.handler = new yespix.class.gfxManager(this.canvas, this.list);
        this.list = this.handler.list;

        this.checkReady();
    },

    
    add: function() {
        return this.handler.add(arguments);
    },


    createCanvas: function() {
        if (!this.aspect || !this.aspect.width || !this.aspect.height) {
            return false;
        }

        this.canvas = document.createElement('canvas');
        this.canvas.width  = this.aspect.width;
        this.canvas.height = this.aspect.height;
        this.context = this.canvas.getContext('2d');
        this.context.canvas = this.canvas;
    },


    /**
     * Return true if all the classes of the entity are ready
     * @return {boolean} Ready or not
     */
    checkReadyClasses: function() {
        if (this.handler && !this.handler.isReady) return false;
        return this.super();
    },


    step: function(time) {
        this.handler.step(time);
        this.super(time);
    },
   

    draw: function(context) {
        
        if (!this.isReady) {
            return false;
        }

        this.handler.draw(this.context);

        var contextSaved = false;
        if (this.position.rotation != 0) {
            var pivot = this.getPivot();
            contextSaved = true;
            context.save();
            context.translate(pivot.x, pivot.y);
            context.rotate(this.position.rotation * Math.PI / 180);
            context.translate(-pivot.x, -pivot.y);
        }
        if (this.aspect.flipX || this.aspect.flipY) {
            contextSaved = true;
            if (!contextSaved) {
                context.save();
            }
            context.scale( (this.aspect.flipX ? -1 : 1), (this.aspect.flipY ? -1 : 1) );
        }

        if (!this.boundary.image || this.isChanged || this.aspect.isChanged) {
            this.boundary.image = this.getBoundaryImage();        
        }
        if (!this.boundary.clip || this.isChanged || this.aspect.isChanged) {
            this.boundary.clip = this.getBoundaryClip();
        }

        context.globalAlpha = this.aspect.alpha;
        context.drawImage(this.canvas, //image element
            this.boundary.clip.x, // x position on image
            this.boundary.clip.y, // y position on image
            this.boundary.clip.width, // width on image
            this.boundary.clip.height, // height on image
            this.boundary.image.x, // x position on canvas
            this.boundary.image.y, // y position on canvas
            this.boundary.image.width, // width on canvas
            this.boundary.image.height // height on canvas
        );

        if (contextSaved) {
            context.restore();
        }

    },

 
    getBoundaryImage: function() {
        var pos = {
            x: this.position.x * (this.aspect.flipX ? -1 : 1) + (this.aspect.flipX ? -this.aspect.width : 0),
            y: this.position.y * (this.aspect.flipY ? -1 : 1) + (this.aspect.flipY ? -this.aspect.height : 0),
            width: this.aspect.width,
            height: this.aspect.height
        };
        if (this.position.snapToPixel) {
            pos.x = ~~ (0.5 + pos.x);
            pos.y = ~~ (0.5 + pos.y);
        }
        return pos;
    },


    getBoundaryClip: function() {
        var clip = {
            x: this.aspect.clipX,
            y: this.aspect.clipY,
            width: this.aspect.clipWidth,
            height: this.aspect.clipHeight
        };
        
        if (!clip.width) clip.width = this.aspect.width;
        if (!clip.height) clip.height = this.aspect.height;

        return clip;
    }

});

