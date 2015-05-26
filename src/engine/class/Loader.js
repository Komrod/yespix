
function Loader(options, files) {

    // init the fileList
    // init the options
    options = options || {};

    this.complete = options['complete'] || function() {};
    this.error = options['error'] || function() {};
    this.progress = options['progress'] || function() {};
    this.skip = options['skip'] || function() {};
    this.success = options['success'] || function() {};

    this.maxDownload = options['maxDownload'] || 0;

    this.files = files || [];

    this.fileStats = {};
    this.globalStats = {};
}


Loader.prototype.add = function(src) {
    this.files.push(src);
    return true;
};


Loader.prototype.remove = function(src) {
    var len = this.files.length;
    for (var t=0; t<len; t++) {
        if (this.files[t] == src) {
            this.files.splice(t, 1);
            return true;
        }
    }
    return false;
};


Loader.prototype.execute = function() {
    var index = 0;
    var len = this.files.length;

    this.globalStats = {
        loaded: 0,
        progress: 0,
        size: 0,
        allComplete: false,
        allSuccess: false,
        errorCount: 0,
        downloadCount: 0,
    };

    for (; index < len; index++) {
        if (!this.files[0]) continue;
        
        var src = this.files[0];

        if (!this.fileStats[src] // src URL not previously loaded
            || !this.fileStats[src].state // src URL has no state 
            || this.fileStats[src].state == 'error' // src complete with an error
        ) {

            this.fileStats[src] = {
                state: 'pending',
                loaded: 0,
                progress: 0,
                size: 0,
                done: false,
                lengthComputable: false,
                src: src
            };

            this.xmlhttp(src);
        }
    }
};


Loader.prototype.xmlhttp = function(src) {
    // start XMLHttpRequest client
    var client = null;

    // create XMLHttpRequest
    if (window.XMLHttpRequest) client = new XMLHttpRequest();
    else if (window.ActiveXObject) {
        var names = ["Msxml2.XMLHTTP.6.0", "Msxml2.XMLHTTP.3.0", "Msxml2.XMLHTTP", "Microsoft.XMLHTTP"];
        for (var i in names) {
            try {
                client = new ActiveXObject(names[i]);
                break;
            } catch (e) {}
        }
        // cancel load, nothing will work
        if (!client) {
            console.error("Load: the browser does not support XMLHTTPRequest");
            return null;
        }
    }

    
    client.src = src;
    client.stat = this.fileStats[src];

    client.progress = function(event) {
console.log('progress: this = ', this);
        event.src = this.src;
        event.stat = this.stat;
console.log('progress: avant: event = ', event);

        // check if the event.stat is already finished and do not call progress anymore
        if (event.stat.done) {
            event.size = event.stat.size;
            event.totalSize = event.stat.size;
            event.loaded = event.stat.loaded;
            event.progress = event.stat.progress;
console.log('progress: apres: event = ', event);
            return event;
        }


        if (!event.stat.lengthComputable && !event.lengthComputable) {
            // the event.stat did not start download and we dont know its size
            event.stat.state = 'pending';
            event.stat.loaded = 0;
            event.stat.progress = 0;
            event.stat.size = 0;
            event.stat.lengthComputable = false;
        } else {
            // process progress for the event.stat
            event.stat.lengthComputable = true;
            if (event.stat.loaded < event.loaded) event.stat.loaded = event.loaded;
            if (event.stat.size < event.totalSize) event.stat.size = eevent.totalSize;
            if (event.stat.size > 0) event.stat.progress = parseInt(event.stat.loaded / event.stat.size * 10000) / 100;
            else event.stat.progress = 100;
            if (event.stat.progress > 100) event.stat.progress = 100;
            if (event.stat.progress == 100) event.stat.state = 'loaded';
            else event.stat.state = 'processing';
        }

        var newEvent = {
            size: event.stat.size,
            loaded: event.stat.loaded,
            progress: event.stat.progress,
            lengthComputable: event.stat.lengthComputable,
            state: event.stat.state,
            src: event.stat.src,
            stat: event.stat,
            //                    entity: options['entity'],
        };

console.log('progress: apres: newEvent = ', newEvent);
        return newEvent;

    };


    client.onreadystatechange = this.onreadystatechange;


    client.addEventListener('progress', function(e) {
console.log('addEventListener:progress : this.stat = ', this.stat);
        if (!this.stat.done) {
            var newEvent = this.progress(e);
        }
    }, false);

    client.open('GET', src);
    client.send('');
console.log('addEventListener:progress : client = ', client);
};


Loader.prototype.onreadystatechange = function(event) {
console.log('onreadystatechange: avant: event = ', event);
    
    // currently downloading
    event.src = this.src;

    // check the state
    var state = this.readyState || event.type;

    // process the progress of the file
    var newEvent = this.progress(event);
    var newEvent = this.progress.call(this, event);
    var newEvent = this.progress.apply(this, [event]);
console.log('onreadystatechange: this = ', this);
console.log('onreadystatechange: this.progress = ', this.progress);
console.log('onreadystatechange: newEvent = ', newEvent);
console.log('onreadystatechange: state = '+state);

    // The event "onreadystatechange" can be triggered by browsers several times with the same state. To check if the
    // file has already been processed, check the value of file.done
    if (!newEvent.stat.done && (/load|loaded|complete/i.test(state) || state == 4)) {
        // the file is complete, might also returned an error.
        // we do not put the content in the memory because it would take too much space for big files
        newEvent.content = this.responseText;

        newEvent.src = this.src;
        newEvent.status = this.status;
        newEvent.stat.done = true;

        // exclude error HTML status 400 & 500
        if (this.status >= 400) { // @todo this do not handle other error codes like 310 ...
            newEvent.state = newEvent.stat.state = 'error';

console.log('onreadystatechange: apres: newEvent = ', newEvent);
console.log('onreadystatechange: apres: this = ', this);
            return;
        }

        // executes success and complete functions
        newEvent.state = file.state = 'loaded';
    }
console.log('onreadystatechange: apres: newEvent = ', newEvent);
console.log('onreadystatechange: apres: this = ', this);
};


