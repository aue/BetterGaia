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
      let object = {};
      if (value !== undefined) object[key] = value;
      else object = key;
      chrome.storage.local.set(object);
    },
    remove: function(key) {
      chrome.storage.local.remove(key);
    }
  },
  reset: function() {
    // clear storage, reload extension
    chrome.storage.local.clear(function() {
      chrome.storage.sync.clear(function() {
        // chrome.runtime.reload();
        location.reload();
      });
    });
  }
};
