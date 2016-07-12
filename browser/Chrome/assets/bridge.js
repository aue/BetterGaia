const Bridge = {
  version: chrome.runtime.getManifest().version,
  path: chrome.runtime.getURL(''),
  storage: {
    get: function(callback) {
      chrome.storage.local.get(null, function(response) {
        if (typeof callback === 'function') callback(response);
      });
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
