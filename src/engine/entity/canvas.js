yespix.define('canvas', {

    inheritClass: 'base',

    element: null,

    aspect: null,

    document: null,
    window: null,

    init: function(options) {
        // call ancestor class function
        this.super(options);

        // init options
        if (options === true) {
            options = {
                autoAppend: true,
                width: 640,
                height: 480
            };
        } else {
            options = options || {};
        }

        options.width = options.width || 0;
        options.height = options.height || 0;

        this.document = options.document || yespix.document;
        this.window = options.window || yespix.window;

        // apply relative width and height
        if (yespix.contains(options.width, '%') || yespix.contains(options.height, '%')) {
            if (yespix.contains(options.width, '%')) {
                var defaultWidth = this.window.innerWidth || this.document.documentElement.clientWidth || this.document.body.clientWidth;
                options.width = defaultWidth * parseFloat(width.replace('%', '')) / 100;
            }
            if (yespix.contains(options.height, '%')) {
                var defaultHeight = this.window.innerWidth || this.document.documentElement.clientHeight || this.document.body.clientHeight;
                options.height = defaultHeight * parseFloat(height.replace('%', '')) / 100;
            }
        }

        // more init
        options.className = options.className || '';
        options.id = options.id || '';

        // create aspect
        this.aspect = new Aspect();

        // create element
        this.element = options.canvas || this.create(options);

        // append
        if (this.element) {
            if (options.autoAppend) this.append();
        }
    },

    append: function(htmlElement) {
        if (!this.element) return false;

        if (!htmlElement) htmlElement = this.document.getElementsByTagName("body")[0];
        htmlElement.appendChild(this.element);

        return true;
    },

    change: function(type, object) {
        if (yespix.isUndefined(type)) {
            return aspect.isChanged;
        } else if (type == 'aspect') {
            if (object.width || object.width === 0) this.element.width = object.width;
            if (object.height || object.height === 0) this.element.height = object.height;
        }
    },

    create: function(options) {
        var canvas = this.document.createElement('canvas');
        if (this.aspect) {
            canvas.width = this.aspect.width;
            canvas.height = this.aspect.height;
        }
        if (options) {
            if (options.id) canvas.id = options.id;
            if (options.className) canvas.className = options.className;
        }
        return canvas;
    },

    clear: function() {
        this.element.width = this.element.width;
    },

    getElement: function() {
        return this.element;
    }
});
