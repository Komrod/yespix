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
            console.log('anim.imageReady :: this.isReady = '+this.isReady);
            this.isReady = true;
            console.log('anim.imageReady :: this.isReady = '+this.isReady);
            console.log(this);
            this.animFramesInit();
        });
    },


    /**
     * Array of anim informations:
     * name: Name of the animation
     * imageIndex: Image index of the sprite
     * imageName: Image name of the sprite
     * image: Image reference
     * width: pixel width
     * height: pixel height
     * x: position X in the image
     * y: position Y in the image
     */
    anims: {},

    /**
     * When all anim frames are ready, animSetup will initiated the frames
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

                            if (yespix.isUndefined(frame.index)) frame.index = t;
                            if (yespix.isUndefined(frame.frameIndex)) frame.frameIndex = t;
                            anim.from = anim.from || 0;

                            // process maximum number of frames in one line for this frame and image. Each frame can have its own image
                            // so we need to update this variable on each frame
                            maxLine = Math.floor(frame.image.realWidth / frame.width) / this.pixelSize;

                            if (maxLine > 0) {
                                frame.x = (anim.offsetX || 0) * this.pixelSize + (frame.frameIndex + anim.from % maxLine) * frame.width * this.pixelSize;
                                frame.y = (anim.offsetY || 0) * this.pixelSize + Math.floor((frame.frameIndex + anim.from) / maxLine) * frame.height * this.pixelSize;
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
        //this.
    },

    animStep: function() {
        if (!this.anims[this.animSelected] || !this.anims[this.animSelected].frames) return;

        var animEnded = false;
        var now = +new Date();

        if (!this.animTime || isNaN(this.animTime)) this.animTime = now;

        if (!this.animTime || this.animTime <= now) {
            this.animFrame++;

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

    getFrame: function(animIndex, frameIndex) {
        animIndex = animIndex || this.animSelected;
        if (!this.anims[animIndex]) return false;
        frameIndex = frameIndex || this.animFrame;
        if (!this.anims[animIndex].frames[frameIndex]) return false;
        return this.anims[animIndex].frames[frameIndex];
    },

    getDrawBox: function() {
        if (this.snapToPixel) {
            var x = parseInt(this.x);
            var y = parseInt(this.y);
        } else {
            var x = this.x;
            var y = this.y;
        }
        var width = this.width;
        var height = this.height;

        var frame = this.getFrame();
        //if (yespix.key('a') && !frame) console.log('frame = ');
        //if (yespix.key('a')) console.log(frame);
        var type = 'anim';
        width = frame.width;
        height = frame.height;

        return {
            x: x,
            y: y,
            width: width,
            height: height,
            type: type
        };
    },

    draw: function(context) {

        this.animStep();
        if (!this.anims[this.animSelected]) this.animSelected = this.animDefault['name'];
        if (!this.anims[this.animSelected]) return;

        if (!this.isVisible) return;


        if (!context) {
            if (!this._context) {
                this.getContext();
                if (this._context) context = this._context;
            } else context = this._context;
        }

        var frame = this.anims[this.animSelected].frames[this.animFrame];
        var img = frame.image;

        var scaleX = frame.flipX ? -1 : 1;
        var scaleY = frame.flipY ? -1 : 1;

        if (this.snapToPixel) {
            var canvasX = parseInt(this.x * scaleX - frame.flipX * frame.width * this.pixelSize);
            var canvasY = parseInt(this.y * scaleY - frame.flipY * frame.height * this.pixelSize);
        } else {
            var canvasX = this.x * scaleX - frame.flipX * frame.width * this.pixelSize;
            var canvasY = this.y * scaleY - frame.flipY * frame.height * this.pixelSize;
        }
        var x = frame.x;
        var y = frame.y;

        if (context && img && img.element && img.isReady) {

            if (frame.flipX || frame.flipY) {
                context.save();
                context.scale(scaleX, scaleY);
            }
            context.globalAlpha = this.alpha;
            context.drawImage(img.element, //image element
                x, // x position on image
                y, // y position on image
                frame.width * this.pixelSize, // width on image
                frame.height * this.pixelSize, // height on image
                canvasX, // x position on canvas
                canvasY, // y position on canvas
                frame.width * this.pixelSize, // width on canvas
                frame.height * this.pixelSize // height on canvas
            );
            if (this.debug) {
                context.globalAlpha = 1;
                context.lineWidth = 0.5;
                context.strokeStyle = "#ff1111";
                context.strokeRect(canvasX - 0.5 * scaleX, canvasY - 0.5 * scaleY, frame.width * this.pixelSize + 1 * scaleX, frame.height * this.pixelSize + 1 * scaleY);
            }
            if (frame.flipX || frame.flipY) {
                context.restore();
            }
            if (this.debug) {
                context.globalAlpha = 1;
                context.fillStyle = '#999999';
                context.font = "10px sans-serif";
                context.fillText("Anim: " + this.animSelected + ' / ' + this.animFrame, parseInt(this.x), parseInt(this.y - 5));

                if (this.collisionBox) {
                    var box = this.collisionBox();
                    context.lineWidth = 0.5;
                    context.strokeStyle = "#000099";
                    context.strokeRect(box.x - 0.5 * scaleX, box.y - 0.5 * scaleY, box.width + 1 * scaleX, box.height + 1 * scaleY);
                }
            }
        }
    },

});
