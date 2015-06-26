
function Loop(fps) {
    this.frame = 0;         // frame index starting at 0
    this.ms = 1;            // minimum milliSecPerFrame
    this.request = null;    // fonction to call for each frame (frameRequest)
    this.requestId = null;  // requestId to stop the loop
    this.tick = null;       // fonction to call for each tick
    this.tickNext = (new Date()).getTime();  // nextGameTick

    this.time = +new Date(); // currentTime
    this.fps = fps || 60;   // maximum frames in 1 second

    this.frameFunction = null;
    this.tickFunction = null;
}


Loop.prototype.start = function() {
    // Init the requestAnimationFrame in this.frameRequest
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

    if (this.request) {
        this.stop();
    }

    this.ms = 1000 / this.fps;
    var loop = this;
    this.tick = function() {
        loop.step();
        loop.request.call(window, loop.tick);
    };

    this.tick();
};


Loop.prototype.stop = function() {
    // Cancel the setInterval
    clearInterval(this.requestId);
    this.tick = null;
};

Loop.prototype.step = function() {
    
    var loops = false; // set to true if frame loop is called at least once

    this.time = +new Date();

    if (this.time - this.tickNext > 60 * this.ms) {
        this.tickNext = this.time - this.ms;
    }
    while (this.time > this.tickNext) {
        this.frame++;
        this.frameTickNext += this.frameMs;
        loops = true;
    }
};

Loop.prototype.register = function(frameFunction, tickFunction) {
    this.frameFunction = frameFunction;
    this.tickFunction = tickFunction;
}