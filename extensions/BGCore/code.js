class BGCore extends Extension {
  constructor() {
    super('BGCore');
    this.match = ['/', '/mygaia/', '/market/', '/forum/', '/world/', '/games/', '/payments/', '/gofusion/'];
  }

  preMount() {
    this.addStyleSheet('font');
    this.addStyleSheet('style');
  }

  mount() {
  }

  unMount() {
    this.removeCSS();
  }
}
