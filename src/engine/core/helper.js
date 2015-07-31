/**
 ***********************************************************************************************************
 ***********************************************************************************************************
 * YESPIX HELPER
 */

/**
 * Create a canvas to add to the page document
 * @method init
 */
yespix.fn.createCanvas = function(properties) {

    // init properties
    if (properties === true) properties = {
        autoAppend: true,
        width: 640,
        height: 480
    };
    else properties = properties || {};


    myDocument = properties.document || this.document;
    myWindow = properties.window || this.window;

    var canvas = myDocument.createElement('canvas');
    if (properties.id) canvas.id = properties.id;
    if (properties.className) canvas.className = properties.className;

    properties.width = properties.width || 0;
    properties.height = properties.height || 0;

    // apply relative width and height
    if (this.contains(properties.width, '%') || this.contains(properties.height, '%')) {
        if (yespix.contains(properties.width, '%')) {
            var defaultWidth = myWindow.innerWidth || myDocument.documentElement.clientWidth || myDocument.body.clientWidth;
            properties.width = defaultWidth * parseFloat(width.replace('%', '')) / 100;
        }
        if (yespix.contains(properties.height, '%')) {
            var defaultHeight = myWindow.innerWidth || myDocument.documentElement.clientHeight || myDocument.body.clientHeight;
            properties.height = defaultHeight * parseFloat(height.replace('%', '')) / 100;
        }
    }

    // more init
    canvas.width = properties.width;
    canvas.height = properties.height;

    // append to body
    if (properties.autoAppend) {
        var body = this.document.getElementsByTagName("body")[0];
        if (body) body.appendChild(canvas);
    }

    return canvas;
}
