

yespix.defineEntity('fps', {

    inheritClass: 'gfx',

    init: function(properties) {
        properties = properties || {};

        if (yespix.isUndefined(properties.position)) {
            properties.position = {
                x: 10,
                y: 10
            };
        }

        if (yespix.isUndefined(properties.aspect)) {
            properties.aspect = {
                width: 160,
                height: 60
            };
        }

        this.super(properties);

        if (yespix.isUndefined(this.recordMax)) {
            this.recordMax = 1000;
        }
        if (yespix.isUndefined(this.updateTime)) {
            this.updateTime = 250;
        }
        if (yespix.isUndefined(this.border)) {
            this.border = 5;
        }

        if (this.background !== false) {
            this.background = new yespix.entity.path({
                position:{
                    x: this.position.x,
                    y: this.position.y,
                },
                aspect: {
                    width: this.aspect.width,
                    height: this.aspect.height
                },
                path: {
                    lineColor: '#ffffff',
                    fillColor: '#000000',
                    fillAlpha: 0.5,
                    borderRadius: 4,
                }
            });
        }

        if (this.textFps !== false) {
            this.textFps = new yespix.entity.text({
                position:{
                    x: this.position.x + 5,
                    y: this.position.y + 5,
                },
                text: {
                    fillColor: '#000000',
                    size: 8
                }
            });
        }

        if (this.textMinMax !== false) {
            this.textMinMax = new yespix.entity.text({
                position:{
                    x: this.position.x + 5,
                    y: this.position.y + 17,
                },
                text: {
                    fillColor: '#000000',
                    size: 8
                }
            });
        }

        if (this.textAvg !== false) {
            this.textAvg = new yespix.entity.text({
                position:{
                    x: this.position.x + 5,
                    y: this.position.y + 29,
                },
                text: {
                    fillColor: '#000000',
                    size: 8
                }
            });
        }

        this.data = [];

    },


    /**
     * Return True if something has changed (position, aspect ...)
     * @return {bool} 
     */
    getChanged: function() {
        return true;
    },


    addRecord: function(ms) {
        this.data.push(1000 / ms);
        if (this.data.length > this.recordMax) {
            this.data.shift();
        }

    },


    drawRender: function(context, ms) {
        if (ms) {
            this.addRecord(ms);
        }
        if (this.background) {
            this.background.drawRender(context);
        }

        var max = 0,
            min = 0,
            x = this.position.x + this.border,
            y = this.position.y + this.aspect.height - this.border,
            total = 0,
            count = 0,
            width = this.aspect.width - 10,
            height = this.aspect.height - 10;

        for (var t = 0; t<this.data.length; t++) {
            if (this.data[t] > 0) {
                if (this.data[t] < min || min == 0) {
                    min = this.data[t];
                }
                if (this.data[t] > max) {
                    max = this.data[t];
                }
                total += this.data[t];
                count++;
            }
        }
//if (ms<9) { console.log(ms); this.fuck(); }

        context.lineWidth = 1;
        context.strokeStyle = '#ff0000';

        context.beginPath();
        context.moveTo(x, y);
        context.lineTo(x + width, y);
        context.stroke();

        // fill blank
        x = x + (this.recordMax - this.data.length) / this.recordMax * width;

        var stats = {
            lineWidth: 0,
            count: 0,
            total: 0
        };

        if (max != 0) {
            for (t = 0; t < this.data.length; t++) {
                stats.lineWidth += width / this.recordMax;
                stats.count++;
                stats.total += this.data[t] / max;

                if (stats.lineWidth >= 0.1) {
                    context.lineWidth = stats.lineWidth;
                    context.beginPath();
                    context.moveTo(x, y);
                    context.lineTo(x, y - (height * (stats.total / stats.count)));
                    context.stroke();
                    x += stats.lineWidth;

                    stats = {
                        lineWidth: 0,
                        count: 0,
                        total: 0
                    };
                }
            }
        }

        if (!this.text) {
            this.text = {
                time: +new Date(),
                minMax: min.toFixed(1) + ' < ' + max.toFixed(1),
                avg: (total / count).toFixed(1) + ' fps'
            };
            if (ms <= 0) {
                this.text.fps = '0 fps';
            } else {
                this.text.fps = (1000 / ms).toFixed(1) + ' fps';
            }
        }

        this.textFps.text.content = this.text.fps;
        this.textFps.drawRender(context);

        this.textMinMax.text.content = this.text.minMax;
        this.textMinMax.drawRender(context);

        this.textAvg.text.content = this.text.avg;
        this.textAvg.drawRender(context);

        if (this.text.time + this.updateTime < +new Date()) {
            this.text = null;
        }
    }


});

