/**
 ************************************************************************************************************
 ************************************************************************************************************
 * TIMER, TICK and FPS
 */


yespix.fn.frameIndex = 0; // frame
yespix.fn.frameTime= 0;
yespix.fn.frameMs = 1; // milliSecPerFrame
yespix.fn.frameRequest = null; // onFrame
yespix.fn.frameRequestId = null; // requestId
yespix.fn.frameTick = null;
yespix.fn.frameTickNext = (new Date()).getTime(); // nextGameTick

yespix.fn.time = +new Date(); // currentTime
yespix.fn.fps = 60;

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

	//console.log('timer.start, onFrame = '+this.onFrame);

	this.frameMs = 1000 / this.fps;
	var yespix = this;
	this.frameTick = function() {
		yespix.timerStep();
		if (yespix.frameTick) yespix.frameRequest.call(window, yespix.frameTick);
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
	loops = 0;
	this.frameTime = +new Date();
	if (this.frameTime - this.frameTickNext > 60 * this.frameMs) {
		this.frameTickNext = this.frameTime - this.frameMs;
	}
	while (this.frameTime > this.frameTickNext) {
		this.frameIndex++;
		this.trigger("enterFrame", {
			frameIndex: this.frameIndex
		});

		this.collisionClear();
		//console.log('collision length = '+this.find('/collision').length);
		//				this.dump(this.find('/collision'), 'find(/collision)');
		var list = this.find('/collision');
		if (list.length > 0) list.collisionOccupy().collision();

		this.frameTickNext += this.frameMs;
		loops++;
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