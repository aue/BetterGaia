/*
bridge.js
cross browser framework for browser extension apis
inspired by xkit
Copyright (c) BetterGaia and Bowafishtech
*/
/*global localStorage: false, console: false, $: false, document: false, alert: false, chrome: false */
/*jshint sub:true */

//(function(){
//if (typeof BetterGaia !== 'undefined') return;

var BetterGaia = {
    version: chrome.runtime.getManifest().version,
    serverUrl: 'http://www.bettergaia.com/',

    console: {
        log: function(text) {
            console.log(text);
        },
        warn: function(text) {
            console.warn(text);
        }
    },

    extensions: {
        // objects of extensions
    },

    download: {
		try_count: 0,
        max_try_count: 4,
        extension: function(id, callback) {
            if (typeof callback !== 'function') throw new Error('Download has no callback.');

            // try to get data from server
            if (BetterGaia.download.try_count >= BetterGaia.download.max_try_count) {
                callback({error: true});
                return;
            }

            $.ajax({
                url: BetterGaia.serverUrl + 'framework/extensions/' + id + '/manifest.json',
                extensionId: id,
                dataType: 'json'
            }).done(function(data) {
                var extensionId = this.extensionId;
                var js = (typeof data.script === 'boolean' && data.script === true)? true:false;
                var css = (typeof data.css === 'boolean' && data.css === true)? true:false;

                function getCSS() {
                    return $.get(BetterGaia.serverUrl + 'framework/extensions/' + extensionId + '/style.css');
                }
                function getJS() {
                    return $.get(BetterGaia.serverUrl + 'framework/extensions/' + extensionId + '/script.js');
                }

                if (js && !css) {
                    BetterGaia.console.log('Need to download "' + id + '"\'s JS.');
                    $.when(getJS()).then(function(js) {
                        data['script'] = js;
                        if (typeof callback === 'function') callback(data);
                    }, function() {
                        callback({error: true});
                    });
                }
                else if (!js && css) {
                    BetterGaia.console.log('Need to download "' + id + '"\'s CSS.');
                    $.when(getCSS()).then(function(css) {
                        data['css'] = css;
                        if (typeof callback === 'function') callback(data);
                    }, function() {
                        callback({error: true});
                    });
                }
                else if (js && css) {
                    BetterGaia.console.log('Need to download "' + id + '"\'s CSS and JS.');
                    $.when(getCSS(), getJS()).then(function(css, js) {
                        data['css'] = css;
                        data['script'] = js;
                        if (typeof callback === 'function') callback(data);
                    }, function() {
                        callback({error: true});
                    });
                }
                else {
                    BetterGaia.console.log('No need to download "' + id + '"\'s extra files.');
                    if (typeof callback === 'function') callback(data);
                }

                BetterGaia.download.try_count = 0;
                return;
            }).fail(function(data) {
                BetterGaia.download.try_count++;
                return BetterGaia.download.extension(id, callback);
            });
        }
    },

    install: {
        extension: function(id, callback) {
            BetterGaia.console.log('Now fetching "' + id + '"\'s files from the server.');

            // Install extension
            BetterGaia.download.extension(id, function(data) {
                try {
                    BetterGaia.console.log('Successfully downloaded "' + id + '", now checking if JSON is valid.');
                    BetterGaia.console.log(data);

                    var errors = false;
                    var extension = {};

                    if (data.error == true) errors = true;

                    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                    var d = new Date();
                    extension.lastUpdated = monthNames[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();

                    // ID
                    // ------------- Should do conflict check here
                    extension.id = data.id;

                    // Name
                    if (typeof data.title !== 'undefined') extension.title = data.title;
                    else errors = true;

                    // Version
                    if (typeof data.version !== 'undefined') extension.version = data.version;
                    else errors = true;

                    // If Beta Version
                    if (typeof data.beta !== 'undefined' && data.beta === true) extension.beta = true;

                    // Description
                    if (typeof data.description !== 'undefined') extension.description = data.description;
                    // else extension.description = 'No Detailed Desc.';

                    // Author
                    if (typeof data.author !== 'undefined') extension.author = data.author;
                    // else extension.author = 'Unknown Author';

                    // JS Script
                    if (typeof data.script !== 'undefined') extension.script = data.script;

                    // CSS
                    if (typeof data.css !== 'undefined') extension.css = data.css;

                    // URL Matches
                    if (typeof data.urlMatch !== 'undefined' && (typeof data.urlMatch == 'string' || data.urlMatch instanceof Array)) extension.urlMatch = data.urlMatch;
                    else errors = true;

                    // URL Excludes
                    if (typeof data.urlExclude !== 'undefined' && (typeof data.urlExclude == 'string' || data.urlExclude instanceof Array)) extension.urlExclude = data.urlExclude;

                    // No errors! Save the data
                    if (errors === false) {
                        // First install
                        if (id == 'core') {
                            Storage.set('extensions', [extension]);
                            Storage.set('extensionsInstalled', [id]);
                        }
                        // More than one
                        else {
                            var data = Storage.get('extensions');
                            data.push(extension);
                            Storage.set('extensions', data);

                            var extensionsInstalled = Storage.get('extensionsInstalled');
                            extensionsInstalled.push(id);
                            Storage.set('extensionsInstalled', extensionsInstalled);
                        }

                        BetterGaia.console.log('"' + id + '" extension install was a success!');
                        if (typeof callback === 'function') callback({'success': true, 'id': id});
                    }
                    else {
                        // Something awful has happened.
                        if (typeof callback === 'function') callback({'success': false, 'id': id});
                        throw new Error('"' + id + '" had errors in it\'s JSON or the download was bad.');
                    }
                }
                catch(e) {
                    BetterGaia.console.warn('Installing extension failed: ' + e.message);
                }
            });
        },

        // First time users will install the core here
        bettergaia: function() {
            // Install core
            BetterGaia.install.extension('core', function(data) {
                if (data.success === true) Storage.set('installed', true);
                else BetterGaia.console.log('Sorry, we\'ll try installing on the next page load.');
            });
        }
    },

	insert: {
        // make sure to clear out css hierarchy rules
		css: function(css) {
			try {
                if (document.querySelectorAll('style[bg-css]').length > 0) {
                    document.querySelectorAll('style[bg-css]')[0].appendChild(document.createTextNode(css));
                }
                else {
                    var style = document.createElement('style');
                        style.type = 'text/css';
                        style.setAttribute('bg-css', '');
                        style.appendChild(document.createTextNode(css));
                    document.documentElement.appendChild(style);
                }
			}
			catch(e) {
				console.log('[BetterGaia][Bridge] Error when inserting css style: ' + e.message);
			}
		},
		cssUrl: function(url) {
			try {
				var link = document.createElement('link');
					link.href = url;
					link.type = 'text/css';
					link.rel = 'stylesheet';
					link.setAttribute('bg-css', '');
				document.documentElement.appendChild(link);
			}
			catch(e) {
				console.log('[BetterGaia][Bridge] Error when inserting css link: ' + e.message);
			}
		},
        js: function(script) {
			try {
                if (document.querySelectorAll('style[bg-css]').length > 0) {
                    document.querySelectorAll('style[bg-css]')[0].appendChild(document.createTextNode(css));
                }
                else {
                    var style = document.createElement('style');
                        style.type = 'text/css';
                        style.setAttribute('bg-css', '');
                        style.appendChild(document.createTextNode(css));
                    document.documentElement.appendChild(style);
                }
			}
			catch(e) {
				console.log('[BetterGaia][Bridge] Error when inserting css style: ' + e.message);
			}
        }
	},

	urlCheck: function(url) {
        // Only one condition
        if (typeof url == 'string' && (document.location.pathname.indexOf(url) > -1 || url == '*')) return true;

        // Array of conditions
        else if (url instanceof Array) {
            for (var i = 0; i < url.length; i++) {
                if (document.location.pathname.indexOf(url[i]) > -1 || url[i] == '*') return true;
            }
        }

		// else...
		return false;
	},

	path: function(url) {
		// return url relative to root
		try {return chrome.extension.getURL(url);}
		catch(e) {console.log('[BetterGaia][Bridge] Error when getting absolute path: ' + e.message);}
	},

	run: function() {
		//if (this.ready === false) throw new Error('Storage not initialized.');
		// empty
	},

	ready: false,

	init: function() {
		if (this.ready === true) throw new Error('BetterGaia already initialized.');
		if (Storage.ready === false) throw new Error('Storage not found.');

        // Check if installed
        if (Storage.data['installed'] !== true) {
            this.console.log('Welcome to BetterGaia! Installing "core" now...');
            this.install.bettergaia();
            return;
        }

        // Else, BG is installed, parse and run extensions
        if (Storage.data['extensions'] instanceof Array) {
            //BetterGaia.console.log(Storage.data['extensions']);

            for (var i = 0; i < Storage.data['extensions'].length; i++) {
                var extension = Storage.data['extensions'][i];

                // Matches URL requirments
                if (BetterGaia.urlCheck(extension.urlMatch) && !BetterGaia.urlCheck(extension.urlExclude)) {
                    BetterGaia.console.log('Running "' + extension.id + '" extension, last updated on ' + extension.lastUpdated + '.');

                    if (typeof extension.css == 'string') BetterGaia.insert.css(extension.css);

                    // Quite nasty...
                    if (typeof extension.script == 'string') eval(extension.script);
                }
            }
        }
	}
};

var Storage = {
    data: {
        // empty
    },

    set: function(key, value) {
		var send = {};
		send[key] = value;

		try {
			// Send to chrome storage
			chrome.storage.local.set(send, function() {
                if (typeof chrome.runtime.lastError === 'object') throw new Error('Issue with chrome storage.');
				Storage.data[key] = value; // Sucess, put in bridge storage
			});
		}
		catch(e) {
			console.log('[BetterGaia][Bridge] Error when setting storage: ' + e.message);
		}
	},

    get: function(key) {
        try {
            return Storage.data[key];
		}
		catch(e) {console.log('[BetterGaia][Bridge] Error when getting storage: ' + e.message);}
    },

    remove: function(key) {
		try {
			// Send to chrome storage
			chrome.storage.local.remove(key, function() {
                if (typeof chrome.runtime.lastError === 'object') throw new Error('Issue with chrome storage.');
				delete Storage.data[key]; // Success, remove from bridge storage
			});
		}
		catch(e) {console.log('[BetterGaia][Bridge] Error when removing storage: ' + e.message);}
	},

	ready: false,

    init: function() {
		if (this.ready === true) throw new Error('Storage already initialized.');

		try {
			chrome.storage.local.get(null, function(data, callback) {
				Storage.data = data;
                Storage.ready = true;

                // Init BG, unfo. can't pass in a callback
                BetterGaia.init();
			});
		}
		catch(e) {console.log('[BetterGaia][Bridge] Error when getting storage: ' + e.message);}
    }
};

// Start Bridge to the other side
try {
    Storage.init();
}
catch(e) {
	console.log('[BetterGaia][Bridge] Error when starting bridge: ' + e.message);
    console.log(e);
	try {
		BetterGaia.init();
	}
	catch(em) {
		alert('[BetterGaia][Bridge] Fatal Error:\n' + em.message + '\n\nPlease go to bettergaia.com for support.');
		console.log('[BetterGaia][Bridge] Error when starting bridge: ' + em.message);
	}
}

//}());
