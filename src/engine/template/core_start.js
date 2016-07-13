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
         * YESPIX contructor. Handles the engine initialisation with properties and trigger the "ready" event
         */
        function yespix(properties) {
            // the function always return an object
            if (!(this instanceof yespix)) return new yespix(properties);

            // process the properties
            this.init(properties);

            window.yespix = this;
            //this.trigger('ready');
        }


        /**
         * YESPIX prototype
         */
        yespix.fn = yespix.prototype;

        window.yespix = yespix;
        