yespix.define('canvas', {

    inheritClass: 'base',

    init: function(properties) {
        // call ancestor class function
        this.super(properties);

        // init properties
        if (properties === true) {
            properties = {
                autoAppend: true,
                width: 640,
                height: 480
            };
        } else {
            properties = properties || {};
        }

        properties.width = properties.width || 0;
        properties.height = properties.height || 0;

        this.document = properties.document || yespix.document;
        this.window = properties.window || yespix.window;

        // apply relative width and height
        if (yespix.contains(properties.width, '%') || yespix.contains(properties.height, '%')) {
            if (yespix.contains(properties.width, '%')) {
                var defaultWidth = this.window.innerWidth || this.document.documentElement.clientWidth || this.document.body.clientWidth;
                properties.width = defaultWidth * parseFloat(width.replace('%', '')) / 100;
            }
            if (yespix.contains(properties.height, '%')) {
                var defaultHeight = this.window.innerWidth || this.document.documentElement.clientHeight || this.document.body.clientHeight;
                properties.height = defaultHeight * parseFloat(height.replace('%', '')) / 100;
            }
        }

        // more init
        properties.className = properties.className || '';
        properties.id = properties.id || '';

        // create aspect
        this.aspect = new Aspect();

        // create element
        this.element = properties.canvas || this.create(properties);

        // append
        if (this.element) {
            if (properties.autoAppend) this.append();
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

    create: function(properties) {
        var canvas = this.document.createElement('canvas');
        if (this.aspect) {
            canvas.width = this.aspect.width;
            canvas.height = this.aspect.height;
        }
        if (properties) {
            if (properties.id) canvas.id = properties.id;
            if (properties.className) canvas.className = properties.className;
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
