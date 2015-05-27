
function Loader(options, files) {

    // init the fileList
    // init the options
    options = options || {};

    this.complete = options['complete'] || function(event) {};
    this.error = options['error'] || function(event) {};
    this.progress = options['progress'] || function(event) {};
    this.success = options['success'] || function(event) {};

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
            console.error("Load: the browser does not support XMLHTTPRequest");
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
                if (this.fileStat) this.fileStat.state = 'pending';
                event.state = 'pending';

                this.fileStat.loaded = 0;
                this.fileStat.total = 0;
                this.fileStat.progress = 0;

                if (this.loader.progress) this.loader.progress(event);
            } else {
                if (event.total == event.loaded) {
                    // completed
                    if (this.fileStat) this.fileStat.state = 'loaded'
                    event.state = 'loaded';
                    this.fileStat.loaded = event.loaded;
                    this.fileStat.total = event.total;
                    this.fileStat.progress = 100;
                    this.fileStat.done = true;
                    if (this.loader.progress) this.loader.progress(event);
                    if (this.loader.complete) this.loader.complete(event);
                    if (this.loader.success) this.loader.success(event);
                } else {
                    // in progress
                    if (this.fileStat) this.fileStat.state = 'inprogress'
                    event.state = 'inprogress';
                    this.fileStat.loaded = event.loaded;
                    this.fileStat.total = event.total;
                    this.fileStat.progress = ((event.loaded * 10000) / event.total) / 100;
                    if (this.loader.progress) this.loader.progress(event);
                }
            }
        }
    }, false);

    client.open('GET', src);
    client.send('');
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

        // exclude error HTML status 400 & 500
        if (this.status >= 400) { // @todo this do not handle other error codes like 310 ...
            event.state = 'error';
            event.loaded = 0;
            event.progress = 0;
            event.total = this.fileStat.total;

            this.fileStat.state = 'error';
            this.fileStat.loaded = 0;
            this.fileStat.progress = 0;

            if (this.loader.error) this.loaded.error(event);
            return;
        }

        // success and complete
        event.state = 'loaded';
        event.loaded = this.fileStat.loaded;
        event.progress = 100;
        
        this.fileStat.state = 'loaded';
        this.fileStat.progress = 100;

        if (this.loader.progress) this.loader.progress(event);
        if (this.loader.complete) this.loader.complete(event);
        if (this.loader.success) this.loader.success(event);
    }
};


Loader.prototype.update = function() {
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
    
    if (len > 0) {
        this.globalStats.allComplete = true;
    }

    for (; index < len; index++) {
        if (!this.files[index]) continue;
        
        var src = this.files[index];
        if (this.fileStats[src]) {

            if (this.fileStats[src].state == 'pending')  {
                this.globalStats.allComplete = false;
            }
            
        } else {

        }
    }
};

