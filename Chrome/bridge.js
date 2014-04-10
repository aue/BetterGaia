/*
bridge.js
Copyright (c) BetterGaia and Bowafishtech
*/
/*global localStorage: false, console: false, $: false, chrome: false, unescape: false */
/*jshint sub:true */

var BetterGaia = {
    version: chrome.runtime.getManifest().version
};

var Bridge = {
};

var Storage = {
    data: {
        // empty
    },
    set: function() {},
    get: function() {
        chrome.storage.local.get();
    },
    remove: function() {},
    init: function() {
        chrome.storage.local.get(null, function(data) {
            Storage.data = data;
        });
    }
};

try {
	var storage = chrome.storage.local;
	var storage_loaded = false;
	var framework_version = getVersion();
	var storage_used = -1;
	var storage_max = -1;
	init_bridge();
    
    Storage.init();
}
catch(e) {
	console.log("[XKIT] Caught bridge error: " + e.message);
	try { 
		call_xkit();
	} catch(em) {
		alert("Fatal XKit Error:\n" + em.message + "\n\nPlease go to xkit-extension.tumblr.com for support.");
		console.log("[XKIT] Caught bridge error: " + em.message);
	}
}