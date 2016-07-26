class Extension {
  constructor(id) {
    this.id = id;
    this.match = [];
    this.exactMatch = [];
    this.exclude = [];
    this.mounted = false;
  }

  static info() {
    return {};
  }
  static defaultPrefs() {
    return {};
  }
  static settings() {
    return {};
  }
  static getPrefForId(key, id) {
    return BetterGaia.pref.get(key, id);
  }
  static getDefaultPrefForId(key, id) {
    return BetterGaia.pref.getDefault(key, id);
  }
  static setPrefForId(key, value, id) {
    BetterGaia.pref.set(key, value, id);
  }

  getPref(key) {
    return BetterGaia.pref.get(key, this.id);
  }
  setPref(key, value) {
    BetterGaia.pref.set(key, value, this.id);
  }
  removePref(key) {
    BetterGaia.pref.remove(key, this.id);
  }

  addCSS(css) {
    let styleTag = document.querySelector(`style[bg-css="${this.id}"]`);

    if (styleTag === null) {
      styleTag = document.createElement('style');
      styleTag.setAttribute('type', 'text/css');
      styleTag.setAttribute('bg-css', this.id);
      styleTag.appendChild(document.createTextNode(css));
      document.documentElement.appendChild(styleTag);
    }
    else {
      styleTag.appendChild(document.createTextNode(css));
    }
  }

  addStyleSheet(filename) {
    let linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');
    linkTag.setAttribute('bg-css', this.id);
    linkTag.setAttribute('href', `${BetterGaia.path}extensions/${this.id}/${filename}.css`);
    document.documentElement.appendChild(linkTag);
  }

  removeCSS() {
    let tags = document.querySelectorAll(`style[bg-css="${this.id}"], link[bg-css="${this.id}"]`);
    for (let i = 0, len = tags.length; i < len; i++) {
      tags[i].parentNode.removeChild(tags[i]);
    }
  }

  preMount() {}
  mount() {}
  unMount() {}
}
