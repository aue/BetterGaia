class Extension {
  constructor(id) {
    this.id = id;
  }

  addCSS(css) {
    let styleTag = document.querySelector(`style[bg-css="${this.id}"]`);

    if (styleTag === null) {
      styleTag = document.createElement('style');
      styleTag.type = 'text/css';
      styleTag.setAttribute('bg-css', this.id);
      styleTag.appendChild(document.createTextNode(css));
      document.documentElement.appendChild(styleTag);
    }
    else {
      styleTag.appendChild(document.createTextNode(css));
    }
  }

  removeCSS() {
    let styleTag = document.querySelector(`style[bg-css="${this.id}"]`);
    if (styleTag !== null) styleTag.parentNode.removeChild(styleTag);
  }

  getPreference(key) {

  }

  setPreference(key, value) {

  }

  removePreference(key) {

  }

  mount() {
    this.addCSS('this is the sample css');
  }

  unmount() {
    this.removeCSS();
  }
}
