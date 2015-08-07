

yespix.defineEntity('fps', {

    inheritClass: 'gfx',

    init: function(properties) {
        properties = properties || {};
        this.super(properties);

        this.background = new yespix.entity.path({
            position:{
                x: 10,
                y: 10,
            },
            aspect: {
                width: 120,
                height: 70
            },
            path: {
                lineColor: '#ffffff',
                fillColor: '#000000',
                fillAlpha: 0.5,
                borderRadius: 4,
            }
        });

        this.data = [];

        this.framesMax = 100;
    },

    /**
     * Return True if something has changed (position, aspect ...)
     * @return {bool} 
     */
    getChanged: function() {
        return true;
    },

    addFrame: function(ms) {
        this.data.push(ms);
        if (this.data.length > this.framesMax) {
            this.data.shift();
        }

    },

    drawRender: function(context, ms) {
//console.log('context = ', context, ', ms = '+this.data);
        if (ms) {
            this.addFrame(ms);
        }

        this.background.drawRender(context);

        var max = 0,
            min = 0,
            x = 20,
            y = 60,
            total = 0,
            count = 0;

        for (var t = 0; t<this.data.length; t++) {
            if (this.data[t] > 0) {
                if (this.data[t] < min) {
                    min = this.data[t];
                }
                if (this.data[t] > max) {
                    max = this.data[t];
                }
                total += this.data[t];
                count++;
            }
        }

        // fill blank
        x = x + this.framesMax - this.data.length;

        context.lineWidth = 1;
        context.strokeStyle = '#ff0000';

        if (max != 0) {
            for (t = 0; t < this.data.length; t++) {
                var height = 50 * (this.data[t] / max);
//console.log('x='+x+', y='+y+', height='+height);
                context.beginPath();
                context.moveTo(x, y);
                context.lineTo(x, y - height);
                context.stroke();
                x++;
            }
        }
//this.fuck();        


    }

});

