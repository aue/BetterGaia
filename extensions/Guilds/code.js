class Guilds extends Extension {
  constructor() {
    super('Guilds');
  }

  static info() {
    return {
      id: 'Guilds',
      title: 'Guilds',
      description: 'A more modern Guilds page.',
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: ['/guilds/**']
    };
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {}

  unMount() {
    this.removeCSS();
  }
}
