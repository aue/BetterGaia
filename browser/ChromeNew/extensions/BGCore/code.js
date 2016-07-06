class BGCore extends Extension {
  mount() {
    this.addCSS('this is the BGCore css');
  }

  unmount() {
    this.removeCSS();
  }
}
