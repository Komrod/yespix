

/**
 * Loader class
 * Handle the load of external resources
 * @parent  no
 */


function Loader(properties, files) {

    // init the fileList
    // init the properties
    properties = properties || {};

    this.complete = properties['complete'] || function(event) {};
    this.error = properties['error'] || function(event) {};
    this.progress = properties['progress'] || function(event) {};
    this.success = properties['success'] || function(event) {};

    this.maxDownload = properties['maxDownload'] || 0;

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
        if (!this.files[index]) continue;
        
        var src = this.files[index];

        if (!this.fileStats[src] // src URL not previously loaded
            || !this.fileStats[src].state // src URL has no state 
            || this.fileStats[src].state == 'error' // src complete with an error
        ) {

            this.fileStats[src] = {
                state: 'pending',
                loaded: 0,
                total: 0,
                progress: 0,
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
            } catch (event) {}
        }
        // cancel load, nothing will work
        if (!client) {
            console.error("Loader: the browser does not support XMLHTTPRequest");
            return null;
        }
    }

    
    client.src = src;
    client.fileStat = this.fileStats[src];
    client.loader = this;
    client.onreadystatechange = this.onreadystatechange;

    client.addEventListener('progress', function(event) {
        if (!this.fileStat.done) {
            if (!event.lengthComputable) {
                // pending
                var newEvent = {
                    state: 'pending',
                    total: 0,
                    loaded: 0,
                    progress: 0,
                    src: this.src,
                    globalStats: this.loader.globalStats
                };
                this.fileStat.state = 'pending';
                this.fileStat.loaded = 0;
                this.fileStat.total = 0;
                this.fileStat.progress = 0;

                this.loader.update();
                if (this.loader.progress) this.loader.progress(newEvent);
            } else {
                if (event.total == event.loaded) {
                    // completed
                    var newEvent = {
                        state: 'loaded',
                        total: event.total,
                        loaded: event.loaded,
                        progress: 100,
                        src: this.src,
                        globalStats: this.loader.globalStats
                    };
                    this.fileStat.state = 'loaded'
                    this.fileStat.loaded = event.loaded;
                    this.fileStat.total = event.total;
                    this.fileStat.progress = 100;
                    this.fileStat.done = true;

                    this.loader.update();
                    if (this.loader.progress) this.loader.progress(newEvent);
                    if (this.loader.complete) this.loader.complete(newEvent);
                    if (this.loader.success) this.loader.success(newEvent);
                } else {
                    // in progress
                    var newEvent = {
                        state: 'loading',
                        total: event.total,
                        loaded: event.loaded,
                        progress: ((event.loaded * 10000) / event.total) / 100,
                        src: this.src
                    };
                    this.fileStat.state = 'loading'
                    this.fileStat.loaded = event.loaded;
                    this.fileStat.total = event.total;
                    this.fileStat.progress = ((event.loaded * 10000) / event.total) / 100;

                    this.loader.update();
                    if (this.loader.progress) this.loader.progress(newEvent);
                }
            }
        }
    }, false);
    
    try {
        client.open('GET', src);
        client.send('');
    } catch (event) {
        console.error('Loader: '+event.name+': '+event.message);

        var newEvent = {
            state: 'error',
            total: 0,
            loaded: 0,
            progress: 0,
            src: src,
            globalStats: this.globalStats
        };
        this.fileStats[src].state = 'error';
        this.fileStats[src].done = true;

        this.update();
        if (this.error) this.error(newEvent);
        if (this.progress) this.progress(newEvent);
    }
};


Loader.prototype.onreadystatechange = function(event) {
    
    // currently downloading
    event.src = this.src;

    // check the state
    var state = this.readyState || event.type;

    // The event "onreadystatechange" can be triggered by browsers several times with the same state. To check if the
    // file has already been processed, check the value of fileStat.done
    if (!this.fileStat.done && (/load|loaded|complete|error/i.test(state) || state == 4)) {
        // the file is complete, might also returned an error.
        // we do not put the content in the memory because it would take too much space for big files
        this.fileStat.done = true;

        // exclude error status 4xx & 5xx
        if (this.status >= 400) { // @todo this do not handle other error codes like 310 ...
            var newEvent = {
                state: 'error',
                total: this.fileStat.total || 0,
                loaded: 0,
                progress: 0,
                src: this.src,
                globalStats: this.loader.globalStats
            };
            this.fileStat.state = 'error';
            this.fileStat.loaded = 0;
            this.fileStat.progress = 0;
    
            this.loader.update();
            if (this.loader.error) this.loaded.error(newEvent);
            if (this.loader.progress) this.loader.progress(newEvent);
            return;
        }

        // success and complete
        var newEvent = {
            state: 'loaded',
            total: this.fileStat.total || 0,
            loaded: this.fileStat.loaded || 0,
            progress: 100,
            src: this.src,
            globalStats: this.loader.globalStats
        };
        
        this.fileStat.state = 'loaded';
        this.fileStat.progress = 100;
        this.fileStat.done = true;

        this.loader.update();
        if (this.loader.progress) this.loader.progress(newEvent);
        if (this.loader.complete) this.loader.complete(newEvent);
        if (this.loader.success) this.loader.success(newEvent);

    }
};


Loader.prototype.update = function() {
    var index = 0;
    var len = this.files.length;

    this.globalStats = {
        byteLoaded: 0,
        byteProgress: 0,
        byteTotal: 0,
        countLoaded: 0,
        countProgress: 0,
        countTotal: 0,
        countError: 0,
        allComplete: false,
        allSuccess: false,
        computableLength: false,
    };
    
    if (len > 0) {
        this.globalStats.allComplete = true;
        this.globalStats.allSuccess = true;
        this.globalStats.computableLength = true;
    }

    for (; index < len; index++) {
        if (!this.files[index]) continue;
        
        this.globalStats.countTotal++;
        var src = this.files[index];
        if (this.fileStats[src]) {
            if (this.fileStats[src].loaded > 0) {
                this.globalStats.byteLoaded += this.fileStats[src].loaded;
            }
            if (this.fileStats[src].total > 0) {
                this.globalStats.byteTotal += this.fileStats[src].total;
            }
            if (this.fileStats[src].state == 'pending')  {
                this.globalStats.allComplete = false;
                this.globalStats.allSuccess = false;
                this.globalStats.computableLength = false;
            } else if (this.fileStats[src].state == 'loading')  {
                this.globalStats.allComplete = false;
                this.globalStats.allSuccess = false;
            } else if (this.fileStats[src].state == 'loaded')  {
                this.globalStats.countLoaded++;
            } else if (this.fileStats[src].state == 'error')  {
                this.globalStats.allSuccess = false;
                this.globalStats.countError++;
                this.globalStats.countLoaded++;
            }

        } else {
            // not started
            this.globalStats.allComplete = false;
            this.globalStats.allSuccess = false;
        }
    }
    if (this.globalStats.computableLength && this.globalStats.byteTotal > 0) this.globalStats.byteProgress = ((this.globalStats.byteLoaded * 10000) / this.globalStats.byteTotal) / 100;
    if (this.globalStats.countTotal > 0) this.globalStats.countProgress = ((this.globalStats.countLoaded * 10000) / this.globalStats.countTotal) / 100;
    this.globalStats.mixedProgress = (this.globalStats.countProgress + this.globalStats.byteProgress) / 2;
};


yespix.defineClass('loader', Loader);

