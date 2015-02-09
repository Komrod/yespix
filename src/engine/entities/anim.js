yespix.define('anim', 'image', {

    animDefault: {
        width: 32, // default tile width
        height: 32, // default tile height
        name: '', // default animation name to run
        duration: 200,
    },

    animSelected: '',
    animFrame: 0,
    animSpeed: 1,
    animWait: false,
    animNext: '',

    init: function() {
        this.animInit();
        this.on('imageReady', function() {
            this.animFramesInit();
        });
        this.animSelected = this.animDefault.name;
    },


    /**
     * Array of anim informations:
     * name: Name of the animation
     * imageIndex: Image index of the sprite
     * frameIndex; Index of the frame
     * imageName: Image name of the sprite
     * image: Image reference
     * width: pixel width
     * height: pixel height
     * x: position X in the image
     * y: position Y in the image
     */
    anims: {},

    /**
     * When an image is ready, this function will initiated the correspondant frames
     * @return {[type]} [description]
     */
    animFramesInit: function() {

        // check every animation
        for (var name in this.anims) {
            var anim = this.anims[name];

            // only animation that is not ready
            if (!anim.isReady) {
                // init the ready variable
                var ready = true;
                if (anim.frames && anim.frames.length)
                    for (var t = 0; t < anim.frames.length; t++) {
                        var frame = anim.frames[t];
                        if (frame.isReady) continue;
                        if (!frame.image || !frame.image.isReady) {
                            frame.isReady = false;
                            ready = false;
                            break;
                        }
                    }

                // If all the images are ready, we must complete the frame objects
                if (ready) {
                    // animation is ready
                    anim.isReady = true;

                    var maxLine;
                    // maximum frame in one line
                    if (anim.frames && anim.frames.length)
                        for (var t = 0; t < anim.frames.length; t++) {
                            var frame = anim.frames[t];

                            // frame initiated and ready
                            if (frame.isReady) continue;

                            if (yespix.isUndefined(frame.frameIndex)) frame.frameIndex = t;
                            anim.from = anim.from || 0;

                            // process maximum number of frames in one line for this frame and image. Each frame can have its own image
                            // so we need to update this variable on each frame
                            maxLine = Math.floor(frame.image.width / frame.width) / this.imageScale;
                            if (maxLine > 0) {
                                frame.x = (anim.offsetX || 0) * this.imageScale + (frame.frameIndex + anim.from % maxLine) * frame.width * this.imageScale;
                                frame.y = (anim.offsetY || 0) * this.imageScale + Math.floor((frame.frameIndex + anim.from) / maxLine) * frame.height * this.imageScale;
                                frame.isReady = true;
                            }
                        }
                    if (anim.extendsTo) {
                        for (var t = 0; t < anim.extendsTo.length; t++) {
                            if (this.anims[anim.extendsTo[t]]) {
                                this.anims[anim.extendsTo[t]].isReady = true;
                                this.anims[anim.extendsTo[t]].length = anim.length;
                                if (this.anims[anim.extendsTo[t]].frames) this.anims[anim.extendsTo[t]].oldFrames = yespix.clone(this.anims[anim.extendsTo[t]].frames);

                                this.anims[anim.extendsTo[t]].frames = []; //anim.frames;
                                for (var u = 0; u < anim.frames.length; u++) {
                                    this.anims[anim.extendsTo[t]].frames[u] = yespix.clone(anim.frames[u]);
                                    if (this.anims[anim.extendsTo[t]].flipX) this.anims[anim.extendsTo[t]].frames[u].flipX = !this.anims[anim.extendsTo[t]].frames[u].flipX;
                                    if (this.anims[anim.extendsTo[t]].flipY) this.anims[anim.extendsTo[t]].frames[u].flipY = !this.anims[anim.extendsTo[t]].frames[u].flipY;
                                    if (this.anims[anim.extendsTo[t]].oldFrames && this.anims[anim.extendsTo[t]].oldFrames[u]) {
                                        for (var n in this.anims[anim.extendsTo[t]].oldFrames[u]) {
                                            this.anims[anim.extendsTo[t]].frames[u][n] = this.anims[anim.extendsTo[t]].oldFrames[u][n];
                                        }
                                    }
                                }
                                delete this.anims[anim.extendsTo[t]].oldFrames;
                            }
                        }
                    }
                }
            }
        }
    },

    animInit: function() {
        for (var name in this.anims) {

            var anim = this.anims[name];

            // check if all images are ready
            anim.name = name;
            anim.isReady = false;

            // init the default animation
            if (anim.isDefault) {
                this.animDefault['name'] = name;
                if (!this.animSelected) this.animSelected = name;
            }

            if (anim.extendsFrom) {
                if (this.anims[anim.extendsFrom]) {
                    if (!this.anims[anim.extendsFrom].extendsTo) this.anims[anim.extendsFrom].extendsTo = [name];
                    else this.anims[anim.extendsFrom].extendsTo.push(name);
                }
            }

            // "frames" is an array of frames
            else if (yespix.isArray(anim['frames'])) {
                // frames are already set
                if (!anim.length) anim.length = anim['frames'].length;

                for (var t = 0; t < anim.frames.length; t++) {
                    if (yespix.isInt(anim.frames[t])) {
                        var frame = {
                            index: t,
                            frameIndex: anim.frames[t],
                            anim: name,
                            duration: anim.duration || this.animDefault.duration,
                            flipX: anim.flipX || false,
                            flipY: anim.flipY || false,
                            isReady: false,
                            width: anim.width || this.animDefault.width,
                            height: anim.height || this.animDefault.height,
                        };

                        if (!yespix.isUndefined(anim.imageIndex)) frame.image = this.image(anim.imageIndex);
                        if (!frame.image && !yespix.isUndefined(anim.imageName)) frame.image = this.image(anim.imageName);
                        if (yespix.isUndefined(frame.image)) frame.image = this.image(0);

                        anim.frames[t] = frame;
                    } else {
                        if (!yespix.isUndefined(anim.imageIndex)) anim.frames[t].image = this.image(anim.imageIndex);
                        if (!anim.frames[t].image && !yespix.isUndefined(anim.imageName)) anim.frames[t].image = this.image(anim.imageName);
                        if (yespix.isUndefined(anim.frames[t].image)) anim.frames[t].image = this.image(0);
                    }
                }

            } else
            // "frames" is not set and must be initiated
            {
                if (!anim.length) anim.length = 1;
                if (!anim.from) anim.from = 0;
                anim['frames'] = [];

                for (var t = 0; t < anim.length; t++) {
                    var frame = {
                        index: t,
                        frameIndex: t,
                        anim: name,
                        duration: anim.duration || this.animDefault.duration,
                        flipX: anim.flipX || false,
                        flipY: anim.flipY || false,
                        isReady: false,
                        width: anim.width || this.animDefault.width,
                        height: anim.height || this.animDefault.height,
                    };

                    if (!yespix.isUndefined(anim.imageIndex)) frame.image = this.image(anim.imageIndex);
                    if (!yespix.isUndefined(anim.imageName)) frame.image = this.image(anim.imageName);
                    if (yespix.isUndefined(frame.image)) frame.image = this.image(0);
/*
                    if (this.imageScale && this.imageScale != 1) {
                        frame.x *= this.imageScale;
                        frame.y *= this.imageScale;
                        frame.width *= this.imageScale;
                        frame.height *= this.imageScale;
                    }
*/
                    anim['frames'].push(frame);
                }
            }
        }
        this.animFramesInit();
    },

    animPlay: function(name, speed, from) {

        if (this.animWait) return;
        if (!name) name = this.animDefault.name;
        if (this.animSelected == name) return this;
        if (!this.anims[name]) return null;

        from = from || 0;
        speed = speed || 1;
        var frame = this.anims[name].frames[from];
        if (!frame) return null;

        this.animSelected = name;
        this.animFrame = from;
        this.animSpeed = speed;
        this.animTime = +new Date() + frame.duration * speed;

        this.trigger('animStart', {
            name: this.animSelected,
            frame: this.animFrame
        });
        this.trigger('animFrame', {
            name: this.animSelected,
            frame: this.animFrame
        });

        return this;
    },

    animStop: function() {
        // @TODO
    },

    animStep: function() {
        if (!this.anims[this.animSelected] || !this.anims[this.animSelected].frames) return;
        if (this.anims[this.animSelected].frames.length <= 1) return;

        var animEnded = false;
        var now = +new Date();

        if (!this.animTime || isNaN(this.animTime)) this.animTime = now;

        if (!this.animTime || this.animTime <= now) {
            this.animFrame++;
            this._changed = true;
            if (this.animFrame >= this.anims[this.animSelected].frames.length) {
                this.animFrame = 0;
                animEnded = true;
            }

            this.trigger('animFrame', {
                name: this.animSelected,
                frame: this.animFrame
            });

            var frame = this.anims[this.animSelected].frames[this.animFrame];
            this.animTime = +new Date() + frame.duration * this.animSpeed;
            if (animEnded) {
                this.trigger('animEnd', {
                    name: this.animSelected,
                    frame: this.animFrame
                });
                this.animWait = false;
                if (this.animNext && this.animNext != '') {
                    this.animPlay(this.animNext);
                }
            }
        }
    },

    getFrame: function(animName, frameIndex) {
        animName = animName || this.animSelected;
        if (!this.anims[animName]) return false;
        frameIndex = frameIndex || this.animFrame;
        if (!this.anims[animName].frames || !this.anims[animName].frames[frameIndex]) return false;
        return this.anims[animName].frames[frameIndex];
    },

    /**
     * Get the draw box with absolute position or relative to the parent entity
     * @param  {bool} absolute If true, just get entity x and y. If false, get the position relative to the parent
     * @return {object} Result {x, y, width, height}
     */
     
    getDrawBox: function(absolute) {
        var position = this.getPosition(absolute);
        var frame = this.getFrame();

        return {
            x: position.x,
            y: position.y,
            width: frame.width * this.imageScale,
            height: frame.height * this.imageScale,
        };
    },


    getImageBoxDefault: function(imageBox) {
        var frame = this.getFrame();
        box = {
            x: 0,
            y: 0,
            width: frame.width * this.imageScale,
            height: frame.height * this.imageScale
        }
        if (imageBox.x) box.x = imageBox.x;
        if (imageBox.y) box.y = imageBox.y;
        return box;
    },


    /**
     * Try to draw the gfx entity on a canvas
     * @return {bool} True if drawn
     */
    draw: function(context) {
        
        this.animStep();

        this.call('gfx', 'draw', [context]);
        /*
        // get the context
        context = context || yespix.context;
        
        // if cannot draw, exit now
        if (!this.canDraw(context)) return this.drawExit(false);

        // get the draw box
        this._box = this.getBox(context);

        // if cannot draw from this draw box
        if (!this.canDrawBox(context)) return this.drawExit(false);

        // pre render on canvas
        if (this.prerender && this.prerenderCanvas && this.prerenderCanvas.width > 0) {

            // if changed, update the pre render canvas
            if (this._changed) this.prerenderUpdate(context);

            // use the pre render canvas
            this.prerenderUse(context);

            // draw debug
            if (this.debug) this.drawDebug(context);

            // exit
            return this.drawExit(true);
        }

        this.drawRender(context);

        // draw debug
        if (this.debug) this.drawDebug(context);

        // exit
        return this.drawExit(true);
        */
    },

    /**
     * Returns true if the entity can be drawn, get this information from basic properties of the entity
     * @return {bool} True if can be drawn
     */
    canDraw: function(context) {
        // @TODO put this line in init
        //if (!this.anims[this.animSelected]) this.animSelected = this.animDefault['name'];

        if (!this.anims[this.animSelected]) return false;

        if (!this.isActive 
            || !this.isVisible 
            || this.alpha <= 0
            || !context)
            return false;

        var frame = this.getFrame();

        if (!frame
            || !frame.image
            || !frame.image.element
            || !frame.image.isReady) 
            return false;

        return true;
    },

    drawRender: function(context) {

        // check if image outside canvas
        if (this._box.draw.x > context.canvas.clientWidth 
            || this._box.draw.y > context.canvas.clientHeight 
            || this._box.draw.x + this._box.draw.width < 0
            || this._box.draw.y + this._box.draw.height < 0)
            return;

        var frame = this.getFrame();        
        var img = frame.image;
        var scaleX = frame.flipX ? -1 : 1;
        var scaleY = frame.flipY ? -1 : 1;

        if (frame.flipX || frame.flipY) {
            context.save();
            context.scale(scaleX, scaleY);
        }
        
        if (!this._box.context || !this._box.img) this.getContextBox(context, frame);
        
        context.globalAlpha = this.alpha;

        context.drawImage(img.element, //image element
            this._box.img.x, // x position on image
            this._box.img.y, // y position on image
            this._box.img.width, // width on image
            this._box.img.height, // height on image
            this._box.context.x, // x position on canvas
            this._box.context.y, // y position on canvas
            this._box.context.width, // width on canvas
            this._box.context.height // height on canvas
        );

        if (frame.flipX || frame.flipY) {
            context.restore();
        }
    },

    
    ///////////////////////////////// Sprite functions //////////////////////////////////////
    
    getSpriteCount: function(imageIndex) {
        if (!this.isReady || !this.images[imageIndex] || !this.images[imageIndex].isReady) return false;
        var cols = Math.floor(this.images[imageIndex].width / this.spriteWidth);
        var rows = Math.floor(this.images[imageIndex].height / this.spriteHeight);
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
        return false;
    }

});
