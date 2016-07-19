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
    return {
      'links': [
        ['MyGaia', '/mygaia/'],
        ['Private Messages', '/profile/privmsg.php'],
        ['Forums', '/forum/'],
        ['My Posts', '/forum/myposts/'],
        ['My Topics', '/forum/mytopics/'],
        ['Subscribed Threads', '/forum/subscription/'],
        ['Shops', '/market/'],
        ['Trades', '/gaia/bank.php'],
        ['Marketplace', '/marketplace/'],
        ['Guilds', '/guilds/'],
        ['Top of Page', '#'],
        ['Bottom of Page', '#bg_bottomofpage']
      ]
    };
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    let links = this.getPref('links');
    if (!$.isEmptyObject(links)) {
      $('#gaia_header #user_dropdown_menu').prepend(`<ul id="bg_shortcuts">
        <li class="dropdown-list-item"><a class="bg_shortcuts_link">Shortcuts</a></li>
        <ul></ul>
      </ul>`);

      $(links).each(function(index, data){
        $('#bg_shortcuts ul').append('<li><a href="' + data[1] + '">' + data[0] + '</a></li>');
      });
    }
  }

  unMount() {
    this.removeCSS();
    $('#gaia_header #user_dropdown_menu #bg_shortcuts').remove();
  }
}
