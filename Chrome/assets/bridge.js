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
            // try to get data from server
            if (BetterGaia.download.try_count >= BetterGaia.download.max_try_count) {
                callback({error: true});
                return;
            }

            $.ajax({
                url: BetterGaia.serverUrl + 'framework/extensions/' + id + '/',
                dataType: 'json'
            }).done(function(data) {
                callback({error: false, 'data': data});
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
                    if (data.error === true || data.script === '') {
                        // Server returned an error or empty script.
                        BetterGaia.console.log('installing extension failed: Empty script or errors.');
                        return callback({error: true});
                    }
                    BetterGaia.console.log('downloading of extension of ' + id + ' was successful, now installing.');
                    
                    var errors = false;
                    var extension = {};
                    extension.id = data.id;
                    extension.script = data.script;

                    if (typeof data.css !== "undefined") extension.css = data.css;
                    if (typeof data.title !== "undefined") extension.title = data.title;
                    if (typeof data.description !== "undefined") extension.description = data.description;
                    if (typeof data.developer !== "undefined") extension.developer = data.developer;
                    if (typeof data.version !== "undefined") extension.version = data.version;
                    if (typeof data.beta !== "undefined" && data.beta === true) extension.beta = true;
                    if (typeof data.details !== "undefined") extension.details = data.details;

                    if (errors === false) {
                        // Saved data without any errors!
                        BetterGaia.installed.add(data.id);
                        callback(data);
                    }
                    else {
                        // Something awful has happened.
                        callback({success: false});
                    }
                }
                catch(e) {
                    BetterGaia.console.warn('install_extension failed: ' + e.message);            
                }            
            });
        },
        bettergaia: function() {
            // Install core
            Storage.set('installed', true);
        }
    },
    
	insert: {
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
        
        Storage.set();
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
				Storage.data[key] = value; // Sucess, put in bridge storage (might not work)
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
				delete Storage.data[key]; // Success, remove from bridge storage (might not work)
				return {success: true};
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
	
	//if (Storage.ready && BetterGaia.ready) BetterGaia.run();
}
catch(e) {
	console.log('[BetterGaia][Bridge] Error when starting bridge: ' + e.message);
    console.log(e);
	try {
		BetterGaia.run();
	}
	catch(em) {
		alert('[BetterGaia][Bridge] Fatal Error:\n' + em.message + '\n\nPlease go to bettergaia.com for support.');
		console.log('[BetterGaia][Bridge] Error when starting bridge: ' + em.message);
	}
}