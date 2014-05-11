(function(undefined) {

        /**
         *
         * TODO:
         * - rearranging folders
         * - first(), first(50), last(), last(5), not(id), not(this), filter('even'), filter('odd')
         * - switch speed to pixel-per-second and optionnaly pixel-per-frame
         * - function visible() returns true if gfx entity is visible on canvas
         * - make drawDebug(), drawDebugPosition(), drawDebugCollision(), derawDebugMove();
         * - make a debug panel where you can change variables and see entities
         * - Zombie Sim
         * - limit image draw to visible canvas when an image try to draw partialy outside the canvas
         * - animate properties
         * - tiled level import
         * - draw text
         * - draw polygon, line, rectangle, circle, elipse
         * - rotation
         * - Arkanoid game
         * - parent position and rotation affect children
         * - font from image
         * - typewritter: text showing letter by letter with sound
         * - panel
         * - button
         * - Steel Sky game (raiden)
         * - duplicate, add, remove image
         * - use Object.create in the mixin() function
         * - function key() detects if any key is pressed
         * - function keyCapture() stops the propagation of the pressed key
         * - Bunch must concat, splice, push with arrays
         * - create temporary class with space, not only with "," like yespix.spawn('rect move')
         * - check if all YESPIX classes are fully loaded on first frame
         * - Raider game (platform indiana)
         *
         * DONE:
         * x gravity and objects colliding on floor // 2013-12-19
         * x fix diagonal collision
         * x create actor and player entity
         * x fix pixelSize bug with animation and collision
         * x function clone() on entity
         * x function over() under() inside() outside() intersect() touch() // 2013-12-05
         * x use alpha transparency
         * x Pong Tennis game
         * x collision and function to get the hit box // 2013-12-04
         * x chainable function calls on Bunch
         * x function prop() to change an entity property (to use it with Bunch)
         * x Call entity functions on a Bunch // 2013-11-28
         * x Bunch entities must be unique
         * x function to get the draw box coordinates
         * x show some debug on image // 2013-11-26
         * x on change z or zGlobal, sort on the next draw
         * x on insert or delete gfx entities, change the draw list
         * x change the YESPIX draw to sort instances by z
         * x change an image width and height // 2013-11-26
         * x pixel scale of an image
         * x extends animation // 2013-11-25
         * x Snap image to pixel grid on entity // 2013-11-25
         * x Make a basic 4 ways player // 2013-11-25
         * x animation entity // 2013-11-22
         * x complete the find method and the bunch // 2013-11-21
         * x do the variable listener // 2013-11-18
         * x handle keys // 2013-11-14
         * x do the children manager // 2013-11-13
         * x make functions to handle instances in YESPIX engine and _instances in entity
         * x change _name to name because it's not unique and private // 2013-11-13
         * x do not store the progress in the file object // 2013-11-11
         * x "cache" object switch to "file" object // 2013-11-11
         * x do not put content in memory cache // 2013-11-10
         * x make a YESPIX engine class to be instanciated
         * x build a system to make the unit tests
         *
         *
         * CANCELED:
         * + override the yespix function to do something else after init // cant instanciate new YESPIX object after that
         *
         *
         * PENDING:
         * - do real js classes with prototype for entity classes
         * - do a partial draw for each gfx entities
         * - prerender canvas for the partial draw
         * - function xload which try to do something with the loaded file (execute a .js script, add .css file to document ...)
         *
         *
         */

        /**
         * Credit:
         * Komrod
         *
         * Special Thanks:
         * Louis Stowasser for inspirational CraftyJS
         * Contributors of StackOverflow
         *
         */

        /**
         * @class yespix
         */

        /**
         * YESPIX contructor. Handles the engine initialisation with options and trigger the "ready" event
         */
        function yespix(options) {
            if (!(this instanceof yespix)) return new yespix(options);
            this.init(options);
            this.trigger('ready');
        }

        /**
         * YESPIX prototype
         */
        yespix.fn = yespix.prototype;
