class PostFormatting extends Extension {
  constructor() {
    super('PostFormatting');
    this.match = ['/mygaia/'];
  }

  static info() {
    return {
      id: 'PostFormatting',
      title: 'Post Formatting',
      description: 'Style posts with your own post formats.',
      extendedDescription: `Talk even more. Faster and equipped. Don't copy and paste codes anymore.`,
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
