yespix.define('fps', 'text', {

    textAlign: 'left', // "left" / "right" / "center"
    textFont: 'sans-serif',
    textSize: 9,
    textColor: '#FFFFFF',

    text: '',
    textMinMax: '',
    textAverage: '',

    lineWidth: 1,
    lineColor: '#000000',
    lineAlpha: 1.0,

    fillColor: '#303030',
    fillAlpha: 0.9,

    isVisible: true,

    fpsLastTime: 0,
    fpsAverageTime: 200,
    fpsAverageFrames: 0,
    fpsAverage: 0,

    fpsColors: ['#ffffff', '#FF0000', '#FF8C00', '#F9F900','#5EFC32'],

    fpsData: [],

    width: 124,
    height: 50,

    z: 1000000,
    
    init: function() {
        this.fpsData = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    },

    canDraw: function() {
        return this.isVisible && this.alpha > 0;
    },

    canDrawLine: function() {
        return this.lineWidth > 0 && this.lineColor != '' && this.lineAlpha > 0;
    },

    canDrawFill: function() {
        return this.fillColor != '' && this.fillAlpha > 0;
    },

    drawFill: function(context, box) {
        context.fillStyle = this.fillColor;
        context.fillRect(
            this.x, // x position on canvas
            this.y, // y position on canvas
            this.width, // width on canvas
            this.height // height on canvas
        );
    },

    drawLine: function(context, box) {
        context.lineWidth = this.lineWidth;
        context.strokeStyle = this.lineColor;
        context.strokeRect(this.x, this.y, this.width, this.height);
    },

    getDrawBox: function(relative) {
        var position = this.getPosition(relative);
        var context = this.getContext();
        if (!context) return {
            x: position.x,
            y: position.y - this.textSize,
            width: 0,
            height: 0,
            type: this._class
        };

        return {
            x: position.x,
            y: position.y - this.textSize,
            width: this.width,
            height: this.height,
            type: this._class
        };
    },
    
    draw: function() {
        if (!this.isVisible) return;

        var context = this.getContext();

        if (context) {
            context.globalAlpha = this.alpha;
            var box = this.getDrawBox();
            if (this.canDrawFill()) this.drawFill(context, box);
            if (this.canDrawLine()) this.drawLine(context, box);

            if (this.fpsLastTime == 0)
            {
                this.fpsLastTime = yespix.frameTime;
                return;
            }
            
            if (this.fpsAverageTime > 0)
            {
                this.fpsAverageFrames++;
                this.fpsAverage += yespix.frameTime - this.fpsLastTime;
                if (this.fpsAverage>this.fpsAverageTime && this.fpsAverageFrames > 0)
                {
                    var fps = 1 / (this.fpsAverage / this.fpsAverageFrames / 1000);
                    if (this.fps > 60) fps = 60;
                    this.fpsAverage = 0;
                    this.fpsAverageFrames = 0;
                    this.text = parseInt(fps * 100) / 100;
                    this.fpsData.shift();
                    this.fpsData.push(fps);
                }
                this.fpsLastTime = yespix.frameTime;
            } else
            {
                var fps = 1 / ((yespix.frameTime - this.fpsLastTime) / 1000);
                if (this.fps > 60) fps = 60;
                this.fpsLastTime = yespix.frameTime;
                this.text = parseInt(fps * 100) / 100;
                this.fpsData.shift();
                this.fpsData.push(fps);
            }

            var min = max = average = 0;
            for (var t=0; t<120; t++) {
                if (min > this.fpsData[t] || min == 0) min = this.fpsData[t];
                if (max < this.fpsData[t]) max = this.fpsData[t];
                average += this.fpsData[t];
            }
            average = average / 120;

            context.lineWidth = this.lineWidth;
            context.strokeStyle = this.lineColor;
            for (var t=0; t<120; t++) {
                var scale = 0;
                if (max > 0) scale = (this.height - 4) / max;
                if (this.fpsData[t] <= 0) context.strokeStyle = this.fpsColors[0];
                else if (this.fpsData[t] < 10) context.strokeStyle = this.fpsColors[1];
                else if (this.fpsData[t] < 20) context.strokeStyle = this.fpsColors[2];
                else if (this.fpsData[t] < 30) context.strokeStyle = this.fpsColors[3];
                else context.strokeStyle = this.fpsColors[4];

                context.beginPath();
                context.moveTo(this.x + t + 2, this.y + this.height - 2);
                context.lineTo(this.x + t + 2, this.y + this.height - 3 - this.fpsData[t] * scale);
                context.stroke();
            }

            // drawing fps
            context.fillStyle = this.textColor;
            context.font = this.textSize+'px '+this.textFont;
            context.fillText(this.text, this.x + 2, this.y + this.textSize + 2);

            // drawing min/max
            this.textMinMax = '(' + (parseInt(min * 10) / 10) + '-' + (parseInt(max * 10) / 10) + ')';
            //context.globalAlpha = this.alpha * 0.8;
            //context.fillStyle = this.textColor;
            //context.font = this.textSize+'px '+this.textFont;
            context.fillText(this.textMinMax, this.x + 2, this.y + this.textSize * 2 + 4);

            // drawing average
            this.textAverage = parseInt(average * 100) / 100 + '';
            //context.globalAlpha = this.alpha * 0.8;
            //context.fillStyle = this.textColor;
            //context.font = this.textSize+'px '+this.textFont;
            context.fillText(this.textAverage, this.x + 2, this.y + this.textSize * 3 + 6);
        }
    },

});
