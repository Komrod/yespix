(function(undefined) {

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
            // the function always return an object
            if (!(this instanceof yespix)) return new yespix(options);

            // process the options
            this.init(options);

            window.yespix = this;
            //this.trigger('ready');
        }

        /**
         * YESPIX prototype
         */
        yespix.fn = yespix.prototype;

        window.yespix = yespix;
        