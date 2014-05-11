yespix.define('canvas', {
    canvasOptions: null,
    element: null,
    context: null,
    document: null,

    init: function(options) {
        this.create(options);
    },

    create: function(options) {
        options = options || {};
        options.document = options.document || yespix.document;
        options.width = options.width || 800; // @todo default must be set to client width
        options.height = options.height || 600; // @todo default must be set to client height
        options.style = options.style || {};
        options.id = options.id || 'canvas' + this._id;
        options.class = options.class || '';
        options.autoAppend = options.autoAppend || true;

        this.canvasOptions = options;
        this.document = options.document;

        var canvas = this.document.createElement('canvas');
        canvas.id = options.id;
        canvas.width = options.width;
        canvas.height = options.height;
        canvas.className = options.className;
        for (var n in options.style) canvas.style[n] = options.style[n];

        if (options.autoAppend) {
            var body = this.document.getElementsByTagName("body")[0];
            body.appendChild(canvas);
        }

        this.use(canvas, options);
    },

    use: function(canvasElement, options) {
        options = options || {};
        options.backgroundColor = options.backgroundColor || '#ffffff';
        options.clearOnEnterFrame = options.clearOnEnterFrame || true;

        this.element = canvasElement;
        this.context = this.element.getContext('2d');

        var canvas = this;

        if (options.clearOnEnterFrame) yespix.on('enterFrame', function() {
            canvas.clear();
        });
    },

    clear: function() {
        //			this.context.clearRect(0,0,this.element.width, this.element.height);
        if (this.element) this.element.width = this.element.width;
    },
});


yespix.define('scene', {
    sceneOptions: null,
    document: null,

    init: function(options) {
        this.create(options);
    },

    create: function(options) {
        options = options || {};
        options.document = options.document || yespix.document;

        this.sceneOptions = options;
    },

});



yespix.define('move', {
    speedX: 0,
    speedY: 0,
    accelX: 0,
    accelY: 0,
    moveFriction: 0.05,

    moveStop: function() {
        this.speedX = this.speedY = this.accelX = this.accelY = 0;
    },


    init: function() {
        yespix.on('enterFrame', this.move, this, yespix);
    },

    move: function() {
        if (this.applyGravity && yespix.gravity) this.applyGravity();
        this.speedX += this.accelX;
        this.speedY += this.accelY;
        this.speedX *= 1 - this.moveFriction;
        this.speedY *= 1 - this.moveFriction;
        if (yespix.level) yespix.level.collision(this);
        this.x += this.speedX;
        this.y += this.speedY;
    },

    applyGravity: function() {
        /*
				if (!this.isOnGround && yespix.gravity) {
					console.log('this.isOnGround = '+this.isOnGround+', apply gravity')
					if (yespix.gravity.x) this.accelX += yespix.gravity.x / 20;
					if (yespix.gravity.y) this.accelY += yespix.gravity.y / 20;
				}
				*/
    },

});
