yespix.define('scene', {
    sceneOptions: null,
    document: null,

    init: function(options) {
        this.create(options);
    },

    create: function(options) {
        options = options || {};
        options.document = options.document || yespix.document;

        this.sceneOptions = options;
    },

});
