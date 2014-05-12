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
            if (!(this instanceof yespix)) return new yespix(options);
            this.init(options);
            this.trigger('ready');
        }

        /**
         * YESPIX prototype
         */
        yespix.fn = yespix.prototype;

        