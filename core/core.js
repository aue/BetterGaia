let BetterGaia = {
  version: Bridge.version,
  path: Bridge.path,
  prefStorage: {},
  extensions: [],

  pref: {
    get: function(key) {
      return BetterGaia.prefStorage[key];
    },
    set: function(key, value) {
      return false;
    },
    remove: function(key) {
      return false;
    }
  },

  mounted: false,

  extensionFactory: function(id) {
    try {
      return new extensionClasses[id]();
    } catch(e) {
      console.warn(`BetterGaia: extension not found, ${id}\n`, e);
    }
  },

  loadPrefs: function(callback) {
    this.prefStorage.enabledExtensions = ['BGCore', 'BGForums', 'AnnouncementReader', 'DrawAll', 'ExternalLinkRedirect', 'FormattingToolbar', 'Guilds', 'MyGaia', 'Personalize', 'PostFormatting', 'PrivateMessages', 'Shortcuts', 'UserTags'];

    Bridge.storage.get((response) => {
      for (var key in response) {
        try {this.prefs[key] = response[key];}
        catch(e) {console.warn(`BetterGaia: unused preference, ${key}\n`, e);}
      }

      if (typeof callback === 'function') {
        callback();
      }
    });
  },

  mountExtensions: function() {
    for (let i = 0, len = this.extensions.length; i < len; i++) {
      this.extensions[i].mount();
    }
  },

  unMountExtensions: function() {
    for (let i = 0, len = this.extensions.length; i < len; i++) {
      this.extensions[i].unMount();
    }
  },

  mount: function() {
    if (this.mounted) return;

    let extensionList = BetterGaia.pref.get('enabledExtensions');

    // Create and premount extension (CSS, images)
    for (let i = 0, len = extensionList.length; i < len; i++) {
      let extension = this.extensionFactory(extensionList[i]);
      if (extension) {
        extension.preMount();
        this.extensions.push(extension);
      }
    }

    // Mount extension (func)
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      this.mountExtensions();
    }
    else {
      document.addEventListener('DOMContentLoaded', (event) => {
        this.mountExtensions();
      });
    }

    this.mounted = true;
  },

  unMount: function() {
    if (!this.mounted) return;
    this.unMountExtensions();
    this.mounted = false;
  }
};
