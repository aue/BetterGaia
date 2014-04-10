/*
bridge.js
cross browser framework for browser extension apis
inspired by xkit
Copyright (c) BetterGaia and Bowafishtech
*/
/*global localStorage: false, console: false, $: false, chrome: false, unescape: false */
/*jshint sub:true */

var BetterGaia = {
    version: chrome.runtime.getManifest().version,

	ready: false,

	init: function() {
		if (this.ready === true) return false;
		// empty
	}
};

var Bridge = {
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
				delete Storage.data[key]; // Sucess, remove from bridge storage (might not work)
				return {success: true};
			});
		}
		catch(e) {console.log('[BetterGaia][Bridge] Error when removing storage: ' + e.message);}
	},

	ready: false,

    init: function() {
		if (this.ready === true) return false;
        this.get();
		this.ready = true;
    }
};

// Start Bridge to the other side
try {
    Storage.init();
	BetterGaia.init();
}
catch(e) {
	console.log('[BetterGaia][Bridge] Error when starting bridge: ' + e.message);
	try { 
		call_xkit();
	}
	catch(em) {
		alert('[BetterGaia][Bridge] Fatal Error:\n' + em.message + '\n\nPlease go to bettergaia.com for support.');
		console.log('[BetterGaia][Bridge] Error when starting bridge: ' + em.message);
	}
}