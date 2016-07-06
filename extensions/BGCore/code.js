class BGCore extends Extension {
  mount() {
    this.addCSS('this is the sample css');
  }

  unmount() {
    this.removeCSS();
  }
}
