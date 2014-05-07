/**
 ************************************************************************************************************
 ************************************************************************************************************
 * SUPPORT
 */

/**
 * Media support detection. The function support(type) return true if the requested audio or video is supported
 * by the current browser.
 * @method support
 * @example support('audio') detects if audio is supported
 * @example support('.mp3') detects if mp3 extension is supported, assuming ".mp3" file has an audio/mpeg mimetype
 * @example support('audio/wav') detects if mimetype audio/wav is supported
 * @example support('audio/ogg; codecs="vorbis"') detects if mimetype audio/ogg is supported with codec Vorbis.
 * Note: Some browsers are completely ignoring the codecs and always return True
 *
 */
yespix.fn.support = function(type) {
	//console.log('yespix.support :: type='+type);
	if (!type) return null;
	var types = type.split('/');

	// type can be a media type or an extension
	if (types.length == 1) {
		// check if the type is a media type
		if (this.data.support.types[type]) {
			if (!this.data.support.elements[type]) {
				this.data.support.elements[type] = document.createElement(type);
			}
			return !!this.data.support.elements[type].canPlayType;
		}
		// check if the type is an extension
		if (this.data.support.extensions[type]) {
			type = this.data.support.extensions[type];
			types = type.split('/');
		} else return null;
	}


	if (this.data.support[types[0]] !== undefined && this.data.support[types[0]][types[1]] !== undefined) return this.data.support[types[0]][types[1]];

	// create element if needed
	if (this.data.support.elements[types[0]] === undefined) {
		//console.log('type='+type+', types[0]='+types[0]+', types[1]='+types[1]);
		this.data.support.elements[types[0]] = document.createElement(types[0]);
//		if ( !! this.data.support.elements[types[0]] == false) this.data.support.elements[types[0]] = false;
		if ( this.data.support.elements[types[0]] === false) this.data.support.elements[types[0]] = false;
	}

	var e = this.data.support.elements[types[0]];
//	if (!e || !! e.canPlayType == false) return false;
	if (!e || e.canPlayType === false) return false;

	var str = e.canPlayType(type);
	if (str.toLowerCase() == 'no' || str === '') this.data.support[types[0]][types[1]] = false;
	else this.data.support[types[0]][types[1]] = true;

	return this.data.support[types[0]][types[1]];
};


/**
 ************************************************************************************************************
 ************************************************************************************************************
 * BROWSERS SUPPORT
 */


yespix.fn.isMobile = function() {
	if (!this.data.browser.initiated) this.browser();
	return this.data.browser.mobile;
};

yespix.fn.browser = function(type) {
	var yespix = this;

	if (!yespix.data.browser.initiated) {
		function findBrowser(str) {
			var data = yespix.data.browser.browserList;
			for (var i = 0; i < data.length; i++) {
				if (str.indexOf(data[i].subString) != -1) {
					yespix.data.browser.found = data[i];
					return data[i].identity;
				}
			}
		}

		function findOs(str) {
			var data = yespix.data.browser.osList;
			for (var i = 0; i < data.length; i++) {
				if (str.indexOf(data[i].subString) != -1) {
					yespix.data.browser.found = data[i];
					return data[i].identity;
				}
			}
		}

		function findVersion(str) {
			if (!yespix.data.browser.found) return;
			var find = yespix.data.browser.found.version || yespix.data.browser.infos.name;
			var index = str.indexOf(find);
			if (index == -1) return;
			return str.substring(index + find.length + 1).split(' ').shift();
		}

		function findMobile(str) {
			if (!yespix.data.browser.found) return;
			return /iPhone|iPod|Android|opera mini|blackberry|palm os|palm| Mobile|hiptop|avantgo|plucker|xiino|blazer|elaine|iris|3g_t|windows ce|opera mobi| smartphone;|;iemobile/i.test(str);
		}

		yespix.data.browser.infos.initiated = true;
		yespix.data.browser.infos.name = findBrowser(navigator.userAgent) || findBrowser(navigator.vendor) || "Unknown browser";
		yespix.data.browser.infos.version = findVersion(navigator.userAgent) || findVersion(navigator.appVersion) || "Unknown version";
		if (yespix.data.browser.infos.version != "Unknown version") {
			var version = yespix.data.browser.infos.version;
			yespix.data.browser.infos.versionMajor = parseInt(version);
			if (version.indexOf(".") != -1) yespix.data.browser.infos.versionMinor = version.substring(version.indexOf(".") + 1);
			else yespix.data.browser.infos.versionMinor = '';
		}
		yespix.data.browser.infos.os = findOs(navigator.platform) || findOs(navigator.userAgent) || "Unknown OS";
		yespix.data.browser.infos.mobile = findMobile(navigator.userAgent) || findMobile(navigator.platform) || false;
	}
	yespix.data.browser.initiated = true;

	if (type) return yespix.data.browser.infos[type];
	return yespix.data.browser.infos;
};