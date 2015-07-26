/**
 ***********************************************************************************************************
 ***********************************************************************************************************
 * YESPIX HELPER
 */

/**
 * Create a canvas to add to the page document
 * @method init
 */
yespix.fn.createCanvas = function(options) {

    // init options
    if (options === true) options = {
        autoAppend: true,
        width: 640,
        height: 480
    };
    else options = options || {};


    myDocument = options.document || this.document;
    myWindow = options.window || this.window;

    var canvas = myDocument.createElement('canvas');
    if (options.id) canvas.id = options.id;
    if (options.className) canvas.className = options.className;

    options.width = options.width || 0;
    options.height = options.height || 0;

    // apply relative width and height
    if (this.contains(options.width, '%') || this.contains(options.height, '%')) {
        if (yespix.contains(options.width, '%')) {
            var defaultWidth = myWindow.innerWidth || myDocument.documentElement.clientWidth || myDocument.body.clientWidth;
            options.width = defaultWidth * parseFloat(width.replace('%', '')) / 100;
        }
        if (yespix.contains(options.height, '%')) {
            var defaultHeight = myWindow.innerWidth || myDocument.documentElement.clientHeight || myDocument.body.clientHeight;
            options.height = defaultHeight * parseFloat(height.replace('%', '')) / 100;
        }
    }

    // more init
    canvas.width = options.width;
    canvas.height = options.height;

    // append to body
    if (options.autoAppend) {
        var body = this.document.getElementsByTagName("body")[0];
        if (body) body.appendChild(canvas);
    }

    return canvas;
}
