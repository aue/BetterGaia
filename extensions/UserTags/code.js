class UserTags extends Extension {
  constructor() {
    super('UserTags');
    this.match = ['/mygaia/'];
  }

  static info() {
    return {
      id: 'UserTags',
      title: 'User Tags',
      description: 'Keep tabs on users with short notes on their posts.',
      extendedDescription: `Manage tags shown next to users' names in posts.`,
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
