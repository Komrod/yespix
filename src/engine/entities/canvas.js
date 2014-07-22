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
