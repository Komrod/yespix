/**
 ************************************************************************************************************
 ************************************************************************************************************
 * FILE
 *
 */

/**
 * @method load
 * Load some files and call "complete" function. Options can also add some other function calls ("error",
 * "progress", "success", "skip") and "once" option. The methods "addjs" and "addcss" both use the "load"
 * method and the same kind of options. If you provide options['complete'], it will overrides the
 * "complete" parameter.
 * For each functions, an event object is returned as follow:
 * 		event['size']: size of the file, if
 * 		event['loaded']: size of the file, if
 * 		event['progress']: size of the file, if
 * 		event['state']: pending / processing / loaded / error
 * 		event['lengthComputable'] : true if the file size is known
 * 		event['stat'] : object that provides the overall informations for all the files requested (size, loaded ...)
 * @param {object} options Options of the file load, optional.
 *		options['complete']: function called on complete, remember that the file can be successfully
 *				downloaded or have an error, look at the event.status or use the "success" and "error" functions
 *		options['success']: function called on success, request returned an "ok" status (code 200)
 *		options['error']: function called on error
 *		options['progress']: function called on progress
 *		options['skip']: function called when a file is skipped
 *		options['ordered']: True if you want to execute the complete and success functions in the specified order the fileList
 *		options['once']: boolean, if file has been already downloaded successfully, the file will be skipped,
 *				default is False. Note that if the file was previously loaded with an error, the function will
 *				try another load process even if options['once'] is true.
 *		options[url]: This is the URL specific options where url is the URL string of the fileList and options[url]
 *				is the new options you want to apply to the url.
 * @example load('folder/file.ext') loads the file
 * @example load(['file1','file2','file3']) loads 'file1', 'file2' and 'file3'
 * @example load(files, complete) loads the files in the array "files" and call the function "complete"
 * @example load(files, options) loads the files and initialize with the options object
 */
yespix.fn.load = function(fileList, complete, options) {
    // do nothing if no fileList
    if (!fileList) return this;

    // init the fileList
    if (this.isString(fileList)) fileList = [fileList];
    if (this.isObject(complete)) {
        options = complete;
        complete = function() {};
    }

    // init the options
    options = options || {};
    options['complete'] = options['complete'] || complete || function() {};
    options['error'] = options['error'] || function() {};
    options['progress'] = options['progress'] || function() {};
    options['skip'] = options['skip'] || function() {};
    options['success'] = options['success'] || function() {};
    options['once'] = options['once'] || false;
    options['ordered'] = options['ordered'] || false;
    options['entity'] = options['entity'] || yespix;

    var len = fileList.length,
        index = 0,
        stat = {
            loaded: 0,
            progress: 0,
            size: 0,
            allComplete: false,
            allSuccess: false,
            errorCount: 0,
        },
        urlOptions;

    // loop fileList
    for (; index < len; index++) {

        if (!fileList[index]) continue;

        // init url specific options in urlOptions to store it in yespix.data.file[url]
        if (options[fileList[index]]) {
            urlOptions = options[fileList[index]];
            urlOptions = urlOptions || {};
            urlOptions['complete'] = urlOptions['complete'] || options['complete'] || complete || function() {};
            urlOptions['error'] = urlOptions['error'] || options['error'] || function() {};
            urlOptions['progress'] = urlOptions['progress'] || options['progress'] || function() {};
            urlOptions['skip'] = urlOptions['skip'] || options['skip'] || function() {};
            urlOptions['success'] = urlOptions['success'] || options['success'] || function() {};
            urlOptions['once'] = urlOptions['once'] || options['once'] || false;
        } else urlOptions = options;

        // if the file already exists and urlOptions['once'] is set to True
        if (urlOptions['once'] && this.data.file[fileList[index]]) {
            // skip the file
            if (this.options['debug']) console.warn('yespix.load: skip the file "' + fileList[index] + '"');
            urlOptions['skip']({
                file: this.data.file[fileList[index]],
                url: fileList[index],
                type: 'skip',
                entity: options['entity'],
            });
            continue;
        }

        // Setting new variables in urlOptions
        urlOptions.isLastFile = (index == fileList.length - 1);
        urlOptions.isFirstFile = (index == 0);
        urlOptions.fileList = fileList;

        // stat will store the overall progress of the files load
        urlOptions.stat = stat;


        // init the file object if not found with no state 
        if (!this.data.file[fileList[index]]) {
            this.data.file[fileList[index]] = {
                loaded: 0,
                progress: 0,
                size: 0,
                done: false,
                lengthComputable: false,
                options: [],
            };
        }

        // file will now refer to the current file URL object
        var file = this.data.file[fileList[index]];

        // starting a XMLHttpRequest client only if the file is not currently downloading.
        if (!this.data.file[fileList[index]] // file URL not previously loaded
            || !this.data.file[fileList[index]].state // file URL has no state 
            || this.data.file[fileList[index]].state == 'loaded' // file loaded but options['once'] is false
            || this.data.file[fileList[index]].state == 'error' // file complete with an error
        ) {

            // overriding previous file object
            this.data.file[fileList[index]] = {
                state: 'pending',
                loaded: 0,
                progress: 0,
                size: 0,
                done: false,
                lengthComputable: false,
                options: [urlOptions],
                url: fileList[index],
            };

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
                    console.error("yespix.load: the browser does not support XMLHTTPRequest");
                    return null;
                }
            }

            // add a reference to the yespix object in the XMLHttpRequest client
            client.yespix = this;

            // add URL to the XMLHttpRequest client
            client.url = fileList[index];
            client.file = this.data.file[fileList[index]];

            /**
             * Extract data from the event and process the progress for the file and the overall progress for
             * all the files in fileList array
             * @param {object} e The event object where e.url is the URL of the file loading
             */
            function progress(e) {
                var file = client.file;
                e.file = file;

                // check if the file is already finished and do not call progress anymore
                if (file.done) {
                    e.size = file.size;
                    e.totalSize = file.size;
                    e.loaded = file.loaded;
                    e.progress = file.progress;
                    return;
                }


                if (!file.lengthComputable && !e.lengthComputable) {
                    // the file did not start download and we dont know its size
                    file.state = 'pending';
                    file.loaded = 0;
                    file.progress = 0;
                    file.size = 0;
                    file.lengthComputable = false;
                } else {
                    // process progress for the file
                    file.lengthComputable = true;
                    if (file.loaded < e.loaded) file.loaded = e.loaded;
                    if (file.size < e.totalSize) file.size = e.totalSize;
                    if (file.size > 0) file.progress = parseInt(file.loaded / file.size * 10000) / 100;
                    else file.progress = 100;
                    if (file.progress > 100) file.progress = 100;
                    if (file.progress == 100) file.state = 'loaded';
                    else file.state = 'processing';
                }

                var newEvent = {
                    size: file.size,
                    loaded: file.loaded,
                    progress: file.progress,
                    lengthComputable: file.lengthComputable,
                    state: file.state,
                    url: file.url,
                    file: file,
                    entity: options['entity'],
                };
                console.log('file.options.entity: ' + file.options.entity);

                // loop inside file.options
                if (file.options)
                    for (var u = 0; u < file.options.length; u++) {

                        if (file.options[u]) {
                            // init the stat of the file object
                            file.options[u].stat.loaded = 0;
                            file.options[u].stat.progress = 0;
                            file.options[u].stat.size = 0;
                            file.options[u].stat.allComplete = true; // init to true and set to false when a file is not complete
                            file.options[u].stat.allSuccess = true; // init to true and set to false when a file have an error
                            file.options[u].stat.errorCount = 0;

                            // process progress for all the files in file.options[].fileList
                            if (file.options[u].fileList)
                                for (var t = 0; t < file.options[u].fileList.length; t++) {
                                    var otherFile = client.yespix.data.file[file.options[u].fileList[t]];
                                    if (otherFile && otherFile.lengthComputable) {
                                        // file started downloading and might be complete
                                        file.options[u].stat.loaded += otherFile.loaded;
                                        file.options[u].stat.size += otherFile.size;
                                        if (otherFile.loaded < otherFile.size) file.options[u].stat.allComplete = false;
                                    } else if (otherFile && otherFile.state == 'error') {
                                        // error
                                        file.options[u].stat.allSuccess = false;
                                    } else {
                                        // file pending
                                        file.options[u].stat.allComplete = false;
                                        file.options[u].stat.allSuccess = false;
                                        file.options[u].stat.errorCount++;
                                        break;
                                    }
                                }
                                // set progress to 100% if all files are complete
                            if (file.options[u].stat.allComplete == true) file.options[u].stat.progress = 100;
                            // process stat progress
                            else if (file.options[u].stat.loaded > 0) file.options[u].stat.progress = parseInt(file.options[u].stat.loaded / file.options[u].stat.size * 10000) / 100;
                            // no files started, set progress to 0%
                            else file.options[u].stat.progress = 0;

                        }
                    }
                return newEvent;
            }

            client.onreadystatechange = function(e) {
                var file = this.file;

                // currently downloading
                e.url = this.url;

                // check the state
                var state = this.readyState || e.type;

                // process the progress of the file
                var newEvent = progress(e);

                // The event "onreadystatechange" can be triggered by browsers several times with the same state. To check if the
                // file has already been processed, check the value of file.done
                if (!file.done && (/load|loaded|complete/i.test(state) || state == 4)) {
                    // the file is complete, might also returned an error.
                    // we do not put the content in the memory because it would take too much space for big files
                    newEvent.content = this.responseText;

                    newEvent.url = this.url;
                    newEvent.status = this.status;
                    file.done = true;

                    // exclude error HTML status 400 & 500
                    if (this.status >= 400) { // @todo this do not handle other error codes like 310 ...
                        if (this.yespix.options['debug']) console.error('Could not load the file "' + this.url + '"');
                        newEvent.state = file.state = 'error';

                        // executes error and complete functions
                        for (var t = 0; t < this.file.options.length; t++) {
                            newEvent.stat = this.file.options[t].stat;
                            newEvent.type = 'error';
                            this.file.options[t]['error'](newEvent);
                            newEvent.type = 'complete';
                            this.file.options[t]['complete'](newEvent);
                        }
                        this.file.options = [];
                        return;
                    }

                    // executes success and complete functions
                    newEvent.state = file.state = 'loaded';
                    for (var t = 0; t < this.file.options.length; t++) {
                        newEvent.stat = this.file.options[t].stat;
                        newEvent.type = 'success';
                        this.file.options[t]['success'](newEvent);
                        newEvent.type = 'complete';
                        this.file.options[t]['complete'](newEvent);
                    }
                    this.file.options = [];
                }
            };

            client.addEventListener('progress', function(e) {
                if (!file.done) {
                    var newEvent = progress(e);

                    // executes progress functions
                    newEvent.type = 'progress';
                    for (var t = 0; t < this.file.options.length; t++) {
                        newEvent.stat = this.file.options[t].stat;
                        this.file.options[t]['progress'](newEvent);
                    }
                }
            }, false);

            // 
            client.open('GET', client.url);
            client.send('');
        } else {
            // If the file object has a state == 'pending' or 'processing', it means it's still downloading and the 
            // current load options will be added to the file object
            if (!file.options || file.options.length == 0) file.options = [urlOptions];
            // or adding the urlOptions to the list
            else file.options.push(urlOptions);
        }

    }
    // end fileList loop

    return this;
};


/**
 * Loads a js script file and execute it
 * @method js
 * @param fileList {array|string} Array of the script files to load
 * @param complete {function} Called when the load of the whole list is complete
 * @param options {function} Called when a script load throw an error
 * @use addjs('my/js/file.js');
 * @use addjs(['file01.js', 'file02.js', 'file03.js'], function() { });
 * @use addjs(['file01.js', 'file02.js', 'file03.js'], { complete: ... , error: ... , once: true});
 */
yespix.fn.js = function(fileList, complete, options) {
    var e = null;

    if (!fileList) return this;
    if (this.isString(fileList)) fileList = [fileList];
    if (this.isObject(complete)) {
        options = complete;
        complete = function() {};
    }

    options = options || {};
    options['complete'] = options['complete'] || complete || function() {};
    options['error'] = options['error'] || function() {};
    options['progress'] = options['progress'] || function() {};
    options['success'] = options['success'] || function() {};
    options['skip'] = options['skip'] || function() {};
    options['once'] = options['once'] || false;
    options['ordered'] = options['ordered'] || false;

    success = options['success'];

    if (!options['ordered']) {
        options['success'] = function(e) {
            eval(e.content);
            success(e);
        };
        return this.load(fileList, options);
    } else {
        var token = 0;
        options['success'] = function(e) {
            if (fileList[token] == e.file) {
                eval(e.content);
                success(e);
                token++;
                while (fileList[token]) {
                    if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
                        eval(this.data.file[fileList[token]].content);
                        success(this.data.file[fileList[token]].eventComplete);
                        token++;
                    } else break;
                }
            } else this.data.file[fileList[token]].eventComplete;
        };

        return this.load(fileList, options);
    }
};

/**
 * @method css
 * Load a css file and add it to the document
 * @param list {array|string} Array of the script files to load
 * @param complete {function} Called when the load of the whole list is complete
 * @param error {function} Called when a script load throw an error
 * @param progress {function} Called on the progress of each script load
 * @chainable
 */
yespix.fn.css = function(fileList, complete, options) {

    var e = null;

    if (!fileList) return this;
    if (this.isString(fileList)) fileList = [fileList];
    if (this.isObject(complete)) {
        options = complete;
        complete = function() {};
    }

    options = options || {};
    options['complete'] = options['complete'] || complete || function() {};
    options['error'] = options['error'] || function() {};
    options['progress'] = options['progress'] || function() {};
    options['skip'] = options['skip'] || function() {};
    options['success'] = options['success'] || function() {};
    options['once'] = false;
    options['ordered'] = options['ordered'] || false;
    options['document'] = options['document'] || this.document || document;

    complete = options['complete'];
    var error = options['error'];

    if (!options['ordered']) {
        options['complete'] = function(e) {
            //console.log('addcss :: complete css, e.file = '+e.file);
            var s = document.createElement('link');
            s.type = 'text/css';
            s.rel = 'stylesheet';
            s.href = e.url;
            s.async = true;
            delete s.crossOrigin;
            document.getElementsByTagName('head')[0].appendChild(s);

            if ('sheet' in s) {
                sheet = 'sheet';
                cssRules = 'cssRules';
            } else {
                sheet = 'styleSheet';
                cssRules = 'rules';
            }

            var interval_id = setInterval(function() { // start checking whether the style sheet has successfully loaded
                    try {
                        //console.log('len = '+s[sheet][cssRules].length);
                        if (s[sheet] && s[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
                            clearInterval(interval_id); // clear the counters
                            clearTimeout(timeout_id);
                            //console.log('addcss :: load link success');
                            complete(e);
                        }
                    } catch (e) {} finally {}
                }, 10), // how often to check if the stylesheet is loaded
                timeout_id = setTimeout(function() { // start counting down till fail
                    clearInterval(interval_id); // clear the counters
                    clearTimeout(timeout_id);
                    //document.getElementsByTagName('head').removeChild(s); // since the style sheet didn't load, remove the link node from the DOM
                    error(e); // fire the callback with success == false
                }, 30000); // how long to wait before failing
        };
        return this.load(fileList, options);
    } else {
        var token = 0;
        options['complete'] = function(e) {
            //						console.log('complete::: token ='+token+', url = '+fileList[token]);
            if (fileList[token] == e.url) {
                //console.log('complete css '+e.file);
                var s = document.createElement('link');
                s.type = 'text/css';
                s.rel = 'stylesheet';
                s.href = e.url;
                s.async = true;
                delete s.crossOrigin;
                document.getElementsByTagName('head')[0].appendChild(s);

                if ('sheet' in s) {
                    sheet = 'sheet';
                    cssRules = 'cssRules';
                } else {
                    sheet = 'styleSheet';
                    cssRules = 'rules';
                }

                var interval_id = setInterval(function() { // start checking whether the style sheet has successfully loaded
                        try {
                            if (s[sheet] && s[sheet][cssRules].length) { // SUCCESS! our style sheet has loaded
                                clearInterval(interval_id); // clear the counters
                                clearTimeout(timeout_id);
                                complete(e);
                                token++;
                                while (fileList[token]) {
                                    if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
                                        eval(this.data.file[fileList[token]].content);
                                        complete(this.data.file[fileList[token]].eventComplete);
                                        token++;
                                    } else break;
                                }
                            }
                        } catch (e) {} finally {}
                    }, 20), // how often to check if the stylesheet is loaded
                    timeout_id = setTimeout(function() { // start counting down till fail
                        clearInterval(interval_id); // clear the counters
                        clearTimeout(timeout_id);
                        document.getElementsByTagName('head').removeChild(s); // since the style sheet didn't load, remove the link node from the DOM
                        error(e); // fire the callback with success == false
                        token++;
                        while (fileList[token]) {
                            if (this.data.file[fileList[token]] && this.data.file[fileList[token]].state == 'loaded') {
                                eval(this.data.file[fileList[token]].content);
                                complete(this.data.file[fileList[token]].eventComplete);
                                token++;
                            } else break;
                        }
                    }, 15000); // how long to wait before failing
            } else this.data.file[e.file].eventComplete = e;
        };

        return this.load(fileList, options);
    }

    return this.load(fileList, options);
};
