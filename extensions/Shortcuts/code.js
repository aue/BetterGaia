class Shortcuts extends Extension {
  constructor() {
    super('Shortcuts');
    this.match = ['/mygaia/'];
  }

  static info() {
    return {
      id: 'Shortcuts',
      title: 'Shortcuts',
      description: 'Have your own links to use on every page.',
      extendedDescription: `Manage the shortcuts next by your username.`,
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0'
    };
  }

  static defaultPrefs() {
    return {};
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    // test
  }

  unMount() {
    this.removeCSS();
  }
}
