

/**
 * Game class
 * Handle the canvas, gfx manager and loop
 * @parent  no
 */


function Game(properties) {

    // init the properties
    properties = properties || {};

    if (!yespix.isUndefined(properties.fps)) {
        this.fps = properties.fps;
    }

    if (!yespix.isUndefined(properties.fullscreen)) {
        this.fullscreen = properties.fullscreen;
    }

    if (!yespix.isUndefined(properties.debug)) {
        this.debug = properties.debug;
    }

    if (properties.canvas) {
        this.canvas = properties.canvas;
        if (yespix.isString(this.canvas)) {
            this.setCanvas(document.getElementById(this.canvas));
        }
    }

    if (properties.gfxManager !== false) {
        this.gfxManager = new yespix.class.gfxManager(this.canvas);
    }

    this.loop = new yespix.class.loop(this.fps);
    this.loop.game = this;
    
    (function(game) {
        var onFrame, onStep;

        if (yespix.isUndefined(properties.onFrame)) {
            onFrame = function(loop, time) { 
                if (game.physics) {
                    game.physics.drawDebug();
                    game.physics.world.ClearForces();
                }
                game.render(time);
            };
        } else {
            onFrame = properties.onFrame;
        }
        if (yespix.isUndefined(properties.onStep)) {
            properties.onStep = function(loop, time) {
                if (game.physics) {
                    game.physics.step(time);
                }
                game.step(time);
            };
        } else {
            onStep = properties.onStep;
        }

        game.loop.register(onFrame, onStep);

        /*
        game.loop.register(
            function(loop, time) { 
                if (game.physics) {
                    game.physics.drawDebug();
                    game.physics.world.ClearForces();
                }
                game.render(time);
            }, 
            function(loop, time) {
                if (game.physics) {
                    game.physics.step(time);
                }
                game.step(time);
            }
        );
        */
    })(this);

    if (properties.physics === true) {
        this.physics = new yespix.class.physicsBox2d({manager: this.gfxManager, debug: this.debug});
        if (this.gfxManager) {
            this.gfxManager.setPhysics(this.physics);
        }
//console.log(this);        
    }

    if (properties.input) {
        if (properties.input === true) {
            properties.input = {
                key: document,
                mouse: this.canvas,
                gamepad: true
            };
        }
        this.input = new yespix.class.input(properties.input);
    }

    if (properties.autostart !== false) {
        this.loop.start();
    }
}

Game.prototype.setCanvas = function(canvas) {
    this.canvas = canvas;

    if (this.fullscreen) {
        this.setFullscreen();
    }
};


Game.prototype.setFullscreen = function() {
    if (!this.canvas) {
        return false;
    }

    window.moveTo(0, 0);

    var html = document.getElementsByTagName('html')[0];
    html.style.padding = '0px';
    html.style.margin = '0px';
    html.style.width = '100%';
    html.style.height = '100%';
    html.style.overflow = 'hidden';
    html.style.border = '0';

    document.body.style.padding = '0px';
    document.body.style.margin = '0px';
    document.body.style.width = '100%';
    document.body.style.height = '100%';
    document.body.style.overflow = 'hidden';
    document.body.style.border = '0';

    this.canvas.style.position = 'absolute';
    this.canvas.style.top = '0px';
    this.canvas.style.left = '0px';
    this.canvas.style.zIndex = '100000';

    this.canvas.style.padding = '0px';
    this.canvas.style.margin = '0px';
    this.canvas.style.border = '0';
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;

    var game = this;
    window.onresize = function(event) {
        game.setFullscreen();
    };

    return true;
};


Game.prototype.setFps = function(fps) {
    this.fps = fps;
    this.loop.setFps(fps);
};


Game.prototype.step = function(time) {
    this.gfxManager.step(time);
};


Game.prototype.stop = function() {
    this.loop.stop();
};


Game.prototype.render = function(time) {
    this.gfxManager.clear(); // clear canvas
    this.gfxManager.draw(); // draw debug
    if (this.debug) {
        this.gfxManager.drawFps(time, this.fps);
    }
};

Game.prototype.getFpsEntity = function() {
    if (this.gfxManager && this.gfxManager.fps) {
        return this.gfxManager.fps;
    }
    return null;
};



yespix.defineClass('game', Game);

