yespix.define('canvas', {
    
    canvasOptions: null,
    element: null,
    context: null,
    document: null,

    init: function(options) {
        options = options || {};

        options.document = options.document || yespix.document;
        options.width = options.width || 800; // @todo default must be set to client width
        options.height = options.height || 600; // @todo default must be set to client height
        options.style = options.style || {};
        options.id = options.id || 'canvas' + this._id;
        options.class = options.class || '';
        options.autoAppend = options.autoAppend || true;

        this.document = options.document;

        // apply relative width and height
        if (yespix.contains(options.width, '%'))
        {
            var clientWidth = 800;
            if (this.document.body && this.document.body.clientWidth) clientWidth = this.document.body.clientWidth;
            else if (this.document.width) clientWidth = this.document.width;
            else if (this.document.documentElement && this.document.documentElement.clientWidth) clientWidth = this.document.documentElement.clientWidth;
            options.width = clientWidth * parseFloat(options.width.replace('%', '')) / 100;
        }
        if (yespix.contains(options.height, '%'))
        {
            var clientHeight = 600;
            var delta = 4;
            if (this.document.body && this.document.body.clientHeight) clientHeight = this.document.body.clientHeight - delta;
            else if (this.document.height) clientHeight = this.document.height - delta;
            else if (this.document.documentElement && this.document.documentElement.clientHeight) clientHeight = this.document.documentElement.clientHeight - delta;
            options.height = clientHeight * parseFloat(options.height.replace('%', '')) / 100;
        }
        this.canvasOptions = options;

        var canvas = null;
        if (!options.canvas) canvas = this.create(options);
        else if (options.canvas) canvas = options.canvas;
        
        if (canvas) {
            if (options.autoAppend) {
                var body = this.document.getElementsByTagName("body")[0];
                body.appendChild(canvas);
            }

            this.use(canvas, options);
            yespix.canvas = canvas;
            yespix.context = canvas.getContext('2d');
        }
    },

    create: function(options) {
        var canvas = this.document.createElement('canvas');
        canvas.id = options.id;
        canvas.width = options.width;
        canvas.height = options.height;
        canvas.className = options.class;
        return canvas;
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
        this.element.width = this.element.width;
    },
});
