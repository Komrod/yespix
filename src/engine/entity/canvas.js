yespix.define('canvas', {

    inheritClass: 'base',
    
    element: null,

    aspect: null,

    document: null,
    window: null,

    defaultOptions: {
        autoAppend: true,
        width: 640,
        height: 480
    },

    init: function(options) {
        options = options || {};
    
        options.width = options.width || 0;
        options.height = options.height || 0;

        this.document = options.document || yespix.document;
        this.window = options.window || yespix.window;

        // apply relative width and height
        if (yespix.contains(options.width, '%') || yespix.contains(options.height, '%')) {
            if (yespix.contains(options.width, '%')) {
                var defaultWidth = this.window.innerWidth
                    || this.document.documentElement.clientWidth
                    || this.document.body.clientWidth;
                options.width = defaultWidth * parseFloat(width.replace('%', '')) / 100;
            }
            if (yespix.contains(options.height, '%')) {
                var defaultHeight = this.window.innerWidth
                    || this.document.documentElement.clientHeight
                    || this.document.body.clientHeight;
                options.height = defaultHeight * parseFloat(height.replace('%', '')) / 100;
            }
        }

        options.className = options.className || '';
        options.id = options.id || '';

        this.aspect = new Aspect();

        this.element = options.canvas || this.create(options);
        
        if (canvas) {
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

    create: function() {
        var canvas = this.document.createElement('canvas');
        canvas.id = this.options.id;
        canvas.width = this.aspect.width;
        canvas.height = this.aspect.height;
        canvas.className = this.options.className;
        return canvas;
    },

    clear: function() {
        this.element.width = this.element.width;
    },

    getElement: function() {
        return this.element;
    }
});
