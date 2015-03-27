/**
 ************************************************************************************************************
 ************************************************************************************************************
 * TIMER, TICK and FPS
 */


yespix.fn.frameIndex = 0; // frame
yespix.fn.frameTime = 0;
yespix.fn.frameMs = 1; // minimum milliSecPerFrame
yespix.fn.frameRequest = null; // onFrame
yespix.fn.frameRequestId = null; // requestId
yespix.fn.frameTick = null;
yespix.fn.frameTickNext = (new Date()).getTime(); // nextGameTick

yespix.fn.time = +new Date(); // currentTime
yespix.fn.fps = 60; // maximum frames in 1 second

yespix.fn.timerStart = function() {
    // Init the requestAnimationFrame in this.frameRequest
    if (!this.frameRequest) this.frameRequest = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element) {
                return window.setInterval(callback, 1000 / this.fps);
            };
    })();

    this.frameMs = 1000 / this.fps;
    var yespix = this;
    this.frameTick = function() {
        yespix.timerStep();
        yespix.frameRequest.call(window, yespix.frameTick);
    };

    // clear collision 
    this.collisionClear();

    this.frameTick();

    // trigger the timerStart event
    this.trigger("timerStart");
};

yespix.fn.timerResume = function() {
    // @todo
};


yespix.fn.timerStop = function() {
    // Cancel the setInterval
    clearInterval(this.frameRequestId);
    this.frameTick = null;

    // trigger the timerStop event
    this.trigger("timerStop");
};

yespix.fn.timerStep = function() {
    var loops = false;
    this.frameTime = +new Date();
    if (this.frameTime - this.frameTickNext > 60 * this.frameMs) {
        this.frameTickNext = this.frameTime - this.frameMs;
    }
    while (this.frameTime > this.frameTickNext) {
        this.frameIndex++;
        this.trigger("enterFrame", {
            frameIndex: this.frameIndex
        });

        if (this.collisionEnabled) {
            this.collisionClear();
            var list = this.find('/collision');
            if (list.length > 0) list.collisionOccupy().collision();
        }
        this.frameTickNext += this.frameMs;
        loops = true;
    }
    if (loops) {
        this.trigger("draw", {
            frameIndex: this.frameIndex
        });
        this.trigger("exitFrame", {
            frameIndex: this.frameIndex
        });
    }
};

yespix.fn.currentFps = function() {

};

yespix.fn.getFps = function() {
    return this.fps;
};

yespix.fn.setFps = function(fps) {
    this.fps = fps;
    this.frameMs = 1000 / this.fps;
};
