/*
bridge.js
cross browser framework for browser extension apis
inspired by xkit
Copyright (c) BetterGaia and Bowafishtech
*/
/*global localStorage: false, console: false, $: false, document: false, alert: false, chrome: false */
/*jshint sub:true */

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
                url: BetterGaia.serverUrl + 'framework/extensions/' + id + '/',
                dataType: 'json'
            }).done(function(data) {
                if (typeof callback === 'function') callback({error: false, 'data': data});
                return;
            }).fail(function(data) {
                BetterGaia.download.try_count++;
                return BetterGaia.download.extension(id, callback);
            });
        }
    },

    install: {
        extension: function(id, callback) {
            // Install extension
            BetterGaia.download.extension(id, function(data) {
                try {
                    if (data.error !== false || data.script === '') {
                        // Server returned an error or empty script.
                        callback({success: false});
                        throw new Error('installing extension failed: Errors with fetching from server.');
                    }
                    BetterGaia.console.log('downloading of extension of "' + id + '" was successful, now checking if valid download of json.');
                    
                    var errors = false;
                    var extension = {};
                    
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
                    
                    // Detailed Text
                    if (typeof data.details !== 'undefined') extension.details = data.details;
                    // else extension.details = 'No Detailed Desc.';
                    
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
                    if (typeof data.urlExclude !== 'undefined' && data.urlExclude instanceof Array) extension.urlExclude = data.urlExclude;


                    if (errors === false) {
                        // No errors! Save the data
                        //BetterGaia.installed.add(id);
                        
                        if (id == 'core') Storage.set('extensions', [extension]);

                        callback({success: true});
                    }
                    else {
                        // Something awful has happened.
                        BetterGaia.console.log(id + ' had errors in it\'s JSON data, or the download was bad.');
                        callback({success: false});
                    }
                }
                catch(e) {
                    BetterGaia.console.warn('installing extension failed: ' + e.message);            
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
		}
	},

	urlCheck: function(url) {
		if (document.location.pathname.indexOf(url) > -1) return true;

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
        if (typeof Storage.data['installed'] !== 'boolean') {
            this.console.log('Welcome to BetterGaia! Installing core package now...');
            this.install.bettergaia();
            return;
        }
        
        // Else, BG is installed, parse extensions
        if (typeof Storage.data['extentionsInstalled'] == 'object') {
            BetterGaia.console.log(Storage.data['extentionsInstalled']);
        }
        
        //Storage.set();
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