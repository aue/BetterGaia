let minimatch = require('minimatch');

let BetterGaia = {
  version: Bridge.version,
  path: Bridge.path,
  mounted: false,
  extensions: [],

  isEmptyObject: function(obj) {
    return Object.keys(obj).length === 0 && obj.constructor === Object;
  },

  pref: {
    // Only accessed by BetterGaia
    storage: {},
    defaults: {
      '2016transfer': false,
      'disabledExtensions': []
    },

    // Extensions allowed to use these
    get: function(key, extensionId) {
      // Extension called this
      if (typeof extensionId === 'string') {
        if (BetterGaia.pref.storage.hasOwnProperty(`extension.${extensionId}`)
          && BetterGaia.pref.storage[`extension.${extensionId}`].hasOwnProperty(key)
        ) {
          let pref = BetterGaia.pref.storage[`extension.${extensionId}`][key];
          if (typeof pref === 'object') return JSON.parse(JSON.stringify(pref));
          else return pref;
        }
        else if (BetterGaia.pref.defaults.hasOwnProperty(`extension.${extensionId}`)
          && BetterGaia.pref.defaults[`extension.${extensionId}`].hasOwnProperty(key)
        ) {
          let pref = BetterGaia.pref.defaults[`extension.${extensionId}`][key];
          if (typeof pref === 'object') return JSON.parse(JSON.stringify(pref));
          else return pref;
        }
        else {
          console.warn(`BetterGaia: preference with key not found for extension ${extensionId}, ${key}`);
        }
      }

      // Generic call
      else if (BetterGaia.pref.storage.hasOwnProperty(key)) {
        let pref = BetterGaia.pref.storage[key];
        if (typeof pref === 'object') return JSON.parse(JSON.stringify(pref));
        else return pref;
      }
      else if (BetterGaia.pref.defaults.hasOwnProperty(key)) {
        let pref = BetterGaia.pref.defaults[key];
        if (typeof pref === 'object') return JSON.parse(JSON.stringify(pref));
        else return pref;
      }
      else {
        console.warn(`BetterGaia: preference with key not found, ${key}`);
      }
    },

    getDefault: function(key, extensionId) {
      // Extension called this
      if (typeof extensionId === 'string') {
        if (BetterGaia.pref.defaults.hasOwnProperty(`extension.${extensionId}`)
          && BetterGaia.pref.defaults[`extension.${extensionId}`].hasOwnProperty(key)
        ) {
          let pref = BetterGaia.pref.defaults[`extension.${extensionId}`][key];
          if (typeof pref === 'object') return JSON.parse(JSON.stringify(pref));
          else return pref;
        }
        else {
          console.warn(`BetterGaia: default preference with key not found for extension ${extensionId}, ${key}`);
        }
      }

      // Generic call
      else if (BetterGaia.pref.defaults.hasOwnProperty(key)) {
        let pref = BetterGaia.pref.defaults[key];
        if (typeof pref === 'object') return JSON.parse(JSON.stringify(pref));
        else return pref;
      }
      else {
        console.warn(`BetterGaia: default preference with key not found, ${key}`);
      }
    },

    set: function(key, value, extensionId) {
      // Extension called this
      if (typeof extensionId === 'string') {
        if (BetterGaia.pref.defaults.hasOwnProperty(`extension.${extensionId}`)
          && BetterGaia.pref.defaults[`extension.${extensionId}`].hasOwnProperty(key)
          && BetterGaia.pref.defaults[`extension.${extensionId}`][key] === value
        ) {
          // Trying to set to default value, remove
          // remove() will do the checks for us
          BetterGaia.pref.remove(key, extensionId);
        }
        else {
          // Set normally
          if (BetterGaia.pref.storage.hasOwnProperty(`extension.${extensionId}`)) {
            // Use existing key for extension
            BetterGaia.pref.storage[`extension.${extensionId}`][key] = value;
            Bridge.storage.set(`extension.${extensionId}`, BetterGaia.pref.storage[`extension.${extensionId}`]);
          }
          else {
            // Create new key for extension
            let keyVal = {};
            keyVal[key] = value;

            BetterGaia.pref.storage[`extension.${extensionId}`] = keyVal;
            Bridge.storage.set(`extension.${extensionId}`, keyVal);
          }
        }
      }

      // Generic call
      else if (BetterGaia.pref.defaults.hasOwnProperty(key)
        && BetterGaia.pref.defaults[key] === value
      ) {
        // Trying to set to default value, remove
        // remove() will do the checks for us
        BetterGaia.pref.remove(key);
      }
      else {
        // Set normally
        Bridge.storage.set(key, value);
        BetterGaia.pref.storage[key] = value;
      }
    },

    remove: function(key, extensionId) {
      // Extension called this
      if (typeof extensionId === 'string') {
        if (BetterGaia.pref.storage.hasOwnProperty(`extension.${extensionId}`)
          && BetterGaia.pref.storage[`extension.${extensionId}`].hasOwnProperty(key)
        ) {
          delete BetterGaia.pref.storage[`extension.${extensionId}`][key];

          if (BetterGaia.isEmptyObject(BetterGaia.pref.storage[`extension.${extensionId}`])) {
            // remove the pref completly
            delete BetterGaia.pref.storage[`extension.${extensionId}`];
            Bridge.storage.remove(`extension.${extensionId}`);
          }
          else {
            // update the pref
            Bridge.storage.set(`extension.${extensionId}`, BetterGaia.pref.storage[`extension.${extensionId}`]);
          }
        }
        else {
          console.warn(`BetterGaia: preference with key was not set in the first place for extension ${extensionId}, ${key}`);
        }
      }

      // Generic call
      else if (BetterGaia.pref.storage.hasOwnProperty(key)) {
        Bridge.storage.remove(key);
        delete BetterGaia.pref.storage[key];
      }
      else if (BetterGaia.pref.defaults.hasOwnProperty(key)) {
        console.warn(`BetterGaia: preference with key is already at default value, ${key}`);
      }
      else {
        console.warn(`BetterGaia: preference with key not found, ${key}`);
      }
    }
  },

  reset() {
    let confirm = prompt('Resetting will erase all of your personal content and settings for BetterGaia, which cannot be undone.\n\nTo continue, enter "Reset BetterGaia" below.');

    if (confirm && confirm.toLowerCase() === 'reset bettergaia') {
      console.log('Resetting BetterGaia');
      Bridge.reset();
    }
    else console.log('Reset aborted.');
  },

  extensionFactory: function(id) {
    try {
      return extensionClasses[id];
    } catch(e) {
      console.warn(`BetterGaia: extension not found, ${id}\n`, e);
    }
  },

  loadPrefs: function(callback) {
    Bridge.storage.get((response) => {
      // Get entire storage from the browser, store it locally
      BetterGaia.pref.storage = response;

      // finish with the callback
      if (typeof callback === 'function') {
        callback();
      }
    });
  },

  migratePrefs: function() {
    console.log('Migrating Preferences...');
  },

  match: function(path, matchArray) {
    for (let i = 0, len = matchArray.length; i < len; i++) {
      if (minimatch(path, matchArray[i])) return true;
    }
    return false; // no matches
  },

  mountExtensions: function() {
    for (let i = 0, len = this.extensions.length; i < len; i++) {
      try {
        this.extensions[i].mount();
      } catch(e) {
        console.warn(`BetterGaia: cannot mount extension, ${this.extensions[i].id}\n`, e);
      }
    }
  },

  unMountExtensions: function() {
    console.groupCollapsed('Unmounting extensions...');
    for (let i = 0, len = this.extensions.length; i < len; i++) {
      try {
        console.log(`Unmounting ${extensionClassesIds[i]}`);
        this.extensions[i].unMount();
      } catch(e) {
        console.warn(`BetterGaia: cannot unmount extension, ${this.extensions[i].id}\n`, e);
      }
    }
    console.groupEnd();
  },

  mount: function() {
    if (this.mounted) return;

    let transfer2016 = BetterGaia.pref.get('2016transfer');
    if (transfer2016 == true) {
      // Need to migrate to BetterGaia framework base
      console.log('Need to migrate to BetterGaia framework base');
      BetterGaia.migratePrefs();
      //BetterGaia.pref.set('2016transfer', false);
    }

    let disabledExtensions = BetterGaia.pref.get('disabledExtensions');

    // Prework on the extension
    console.groupCollapsed('Mounting extensions...');
    for (let i = 0, len = extensionClassesIds.length; i < len; i++) {
      let extension = this.extensionFactory(extensionClassesIds[i]);
      if (extension) {
        // Store the default prefs for the extension
        BetterGaia.pref.defaults[`extension.${extensionClassesIds[i]}`] = extension.defaultPrefs();

        // skip if disabled
        if (disabledExtensions.indexOf(extensionClassesIds[i]) !== -1) continue;

        // see if matches or excludes current page
        let path = document.location.pathname + document.location.search;
        let info = extension.info();

        if (info.hasOwnProperty('match')) {
          if (typeof info.match === 'string') info.match = [info.match];
          if (info.match.length > 0) {
            if (!this.match(path, info.match)) continue;
          }
        }
        if (info.hasOwnProperty('exclude')) {
          if (typeof info.exclude === 'string') info.exclude = [info.exclude];
          if (info.exclude.length > 0) {
            if (this.match(path, info.exclude)) continue;
          }
        }

        // Premount the extensions
        try {
          console.log(`Mounting ${extensionClassesIds[i]}`);
          extension = new extension;
          extension.preMount();
          this.extensions.push(extension);
        } catch(e) {
          console.warn(`BetterGaia: cannot preMount extension, ${extensionClassesIds[i]}\n`, e);
        }
      }
    }
    console.groupEnd();

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
    //this.unMountExtensions();
    this.mounted = false;
  }
};

console.log('Mounting BetterGaia');
BetterGaia.loadPrefs(function() {
  BetterGaia.mount();
});

window.addEventListener('unload', function(event) {
  console.log('Unmounting BetterGaia');
  BetterGaia.unMount();
});
