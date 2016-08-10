const Bridge = {
  version: browser.runtime.getManifest().version,
  path: browser.runtime.getURL(''),
  storage: {
    get: function(callback) {
      browser.storage.local.get(null, function(response) {
        if (typeof callback === 'function') callback(response);
      });
    },
    set: function(key, value) {
      let object = {};
      if (value !== undefined) object[key] = value;
      else object = key;
      browser.storage.local.set(object);
    },
    remove: function(key) {
      browser.storage.local.remove(key);
    }
  },
  reset: function() {
    // clear storage, reload extension
    browser.storage.local.clear(function() {
      browser.storage.sync.clear(function() {
        location.reload();
      });
    });
  }
};
