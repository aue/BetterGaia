const Bridge = {
  version: chrome.runtime.getManifest().version,
  path: chrome.runtime.getURL(''),
  storage: {
    get: function(callback) {
      chrome.storage.local.get(null, function(response) {
        if (typeof callback === 'function') callback(response);
      });

      /*return {
        "samplePref": true,
        "samplePref2": [1, 2, 3]
      };*/
    },
    set: function(key, value) {
      var object = {};
      object[key] = value;
      chrome.storage.local.set(object);
    },
    unset: function(key) {
      chrome.storage.local.remove(key);
    }
  }
};
