

function Loop(fps) {
    this.frame = 0;         // frame index starting at 0
    this.ms = 1;            // minimum theorical milliSecPerFrame
    this.requestId = null;  // requestId to stop the loop
    this.tick = null;       // fonction to call for each tick
    this.tickNext = (new Date()).getTime();  // nextGameTick

    this.time = +new Date(); // currentTime
    this.startTime = +new Date(); // time the Loop is created
    this.setFps(fps || 60);   // maximum frames in 1 second

    this.frameFunction = null;
    this.stepFunction = null;

    this.stepTime = 0;
    this.frameTime = 0;
}


Loop.prototype.start = function() {
    // Init the requestAnimationFrame in this.frameRequest
    var looper = this;
    this.tick = function() {
        looper.step();
        if (looper.tick) looper.request.call(window, looper.tick);
    };

    this.stepTime = yespix.getTime();
    this.frameTime = yespix.getTime();
    this.tick();
    return this;
};


Loop.prototype.setFps = function(fps) {
    this.fps = fps;
    this.ms = 1000 / this.fps;
    if (!this.request) this.request = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback, element) {
                return window.setInterval(callback, 1000 / this.fps);
            };
    })();
    return this;
};


Loop.prototype.stop = function() {
    // Cancel the setInterval
    clearInterval(this.requestId);
    this.tick = null;
    return this;
};


Loop.prototype.step = function() {
    var loops = false; // set to true if frame loop is called at least once

    this.time = yespix.getTime();
    if (this.time - this.tickNext > 60 * this.ms) {
        this.tickNext = this.time - this.ms;
    }
    while (this.time > this.tickNext) {
        this.tickNext += this.ms;
        loops = true;
        this.stepDeltaTime = yespix.getTime()-this.stepTime;
        this.stepTime = yespix.getTime();
        if (this.stepFunction) this.stepFunction(this, this.stepDeltaTime, this.frame);
    }

    if (loops) {
        this.frameDeltaTime = yespix.getTime()-this.frameTime;
        this.frameTime = yespix.getTime();
        if (this.frameFunction) this.frameFunction(this, this.frameDeltaTime, this.frame);
        this.frame++;
    }
};


Loop.prototype.register = function(frameFunction, stepFunction) {
    this.frameFunction = frameFunction;
    if (stepFunction) this.stepFunction = stepFunction;
    return this;
};

