/*
bridge.js
cross browser framework for browser extension apis
inspired by xkit
Copyright (c) BetterGaia and Bowafishtech
*/
/*global localStorage: false, console: false, $: false, chrome: false */
/*jshint sub:true */

var BetterGaia = {
    version: chrome.runtime.getManifest().version,

	insert: {
		css: function(css) {
			try {
				var style = document.createElement('style');
					style.type = 'text/css';
					style.setAttribute('bg-css', '');
					style.appendChild(document.createTextNode(css));
				document.documentElement.appendChild(style);
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
		if (this.ready === false) {throw new Error('Storage not initialized.'); return false;}
		// empty
	},

	ready: false,

	init: function() {
		if (this.ready === true) {throw new Error('BetterGaia already initialized.'); return false;}
		// empty
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

    get: function() {
		try {
			chrome.storage.local.get(null, function(data) {
				Storage.data = data;
			});
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
		if (this.ready === true) {throw new Error('Storage already initialized.'); return false;}
        this.get();
		this.ready = true;
    }
};

var Bridge = {
};

// Start Bridge to the other side
try {
    Storage.init();
	BetterGaia.init();
	if (Storage.ready && BetterGaia.ready) BetterGaia.run();
}
catch(e) {
	console.log('[BetterGaia][Bridge] Error when starting bridge: ' + e.message);
	try {
		BetterGaia.run();
	}
	catch(em) {
		alert('[BetterGaia][Bridge] Fatal Error:\n' + em.message + '\n\nPlease go to bettergaia.com for support.');
		console.log('[BetterGaia][Bridge] Error when starting bridge: ' + em.message);
	}
}