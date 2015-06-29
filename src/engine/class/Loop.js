

function Loop(fps) {
    this.frame = 0;         // frame index starting at 0
    this.ms = 1;            // minimum milliSecPerFrame
    this.request = null;    // fonction to call for each frame (requestAnimationFrame)
    this.requestId = null;  // requestId to stop the loop
    this.tick = null;       // fonction to call for each tick
    this.tickNext = (new Date()).getTime();  // nextGameTick

    this.time = +new Date(); // currentTime
    this.fps = fps || 60;   // maximum frames in 1 second

    this.frameFunction = null;
    this.stepFunction = null;

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
}


Loop.prototype.start = function() {
    // Init the requestAnimationFrame in this.frameRequest

    this.ms = 1000 / this.fps;
    var looper = this;
    this.tick = function() {
        looper.step();
        if (looper.tick) looper.request.call(window, looper.tick);
    };

    this.tick();
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

    this.time = +new Date();

    if (this.time - this.tickNext > 60 * this.ms) {
        this.tickNext = this.time - this.ms;
    }
    while (this.time > this.tickNext) {
        this.frame++;
        this.tickNext += this.ms;
        loops = true;
        if (this.frameFunction) this.frameFunction(this);
    }

    if (loop) {
        if (this.stepFunction) this.stepFunction(this);
    }
};


Loop.prototype.register = function(frameFunction, stepFunction) {
    this.frameFunction = frameFunction;
    if (stepFunction) this.stepFunction = stepFunction;
    return this;
};

