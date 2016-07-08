let BetterGaia = {
  version: Bridge.version,
  path: Bridge.path,
  prefs: {},
  extensions: [],
  
  mounted: false,

  extensionFactory: function(id) {
    return new extensionClasses[id]();
  },

  loadPrefs: function() {
    Bridge.storage.get((response) => {
      this.prefs = response;
      /*for (var key in response) {
        try {prefs[key] = response[key];}
        catch(e) {console.warn('BetterGaia: unused preference, \'' + e + '\'.');}
      }*/
    });
  },

  mount: function() {
    if (this.mounted) return;

    this.loadPrefs();

    let extensionList = ['BGCore', 'DrawAll', 'AnnouncementReader'];

    for (let i = 0, len = extensionList.length; i < len; i++) {
      let extension = this.extensionFactory(extensionList[i]);
      extension.preMount();
      this.extensions.push(extension);
    }

    document.addEventListener('DOMContentLoaded', (event) => {
      for (let i = 0, len = this.extensions.length; i < len; i++) {
        this.extensions[i].mount();
      }
    });

    this.mounted = true;
  },

  unMount: function() {
    if (!this.mounted) return;

    for (let i = 0, len = this.extensions.length; i < len; i++) {
      this.extensions[i].unMount();
    }

    this.mounted = false;
  }
};

console.log('Mounting BetterGaia...');
BetterGaia.mount();

window.addEventListener('unload', function(event) {
  console.log('Unmounting BetterGaia...');
  BetterGaia.unMount();
});
