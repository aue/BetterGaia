class Personalize extends Extension {
  constructor() {
    super('Personalize');
    this.scrollTimeout = null;
  }

  static info() {
    return {
      id: 'Personalize',
      title: 'Personalize',
      description: 'Style Gaia the way you want.',
      extendedDescription: `Set a header. Set a background. Set a logo. Style Gaia the way you like it. Choose any headers back since 2009, or to random backgrounds, rustic logos, page themes and more. Hundreds of combinations are waiting to be made.`,
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0'
    };
  }

  static defaultPrefs() {
    return {
      'background.image': 'default',
      'background.color': '#12403d',
      'background.repeat': true,
      'background.position': 'top center',
      'background.float': false,

      'header.background': 'default',
      'header.background.base': 'default',
      'header.background.stretch': true,
      'header.float': true,

      'logo': 'default',

      'nav.hue': '207'
    };
  }

  static settings() {
    return [
      {type: 'title', value: 'Background'},
      {type: 'selection', pref: 'background.image', description: 'Background image', values: [
        {name: 'Default', value: 'default'},
        {name: 'Legacy', value: 'http://i.imgur.com/cPghNcY.jpg'},
        {name: 'Four Point', value: 'http://i.imgur.com/vg2mlt5.jpg'},
        {name: 'Clean', value: 'http://i.imgur.com/33a4gwZ.jpg'},
        {name: 'Growth', value: 'http://i.imgur.com/vODSvML.png'},
        {name: 'Wander', value: 'http://i.imgur.com/885Yrc6.png'},
        {name: 'Passing', value: 'http://i.imgur.com/yh7mFwK.gif'},
        {name: 'Formal', value: 'http://i.imgur.com/M4y8Ox1.png'},
        {name: 'Gray', value: 'http://i.imgur.com/HRpwvio.png'},
        {name: 'Cerveza', value: 'http://i.imgur.com/6c0kqCL.jpg'},
        {name: 'Old Oak', value: 'http://i.imgur.com/d9EC8Uq.jpg'},
        {name: 'Orange', value: 'http://i.imgur.com/f5BpliR.jpg'},
        {name: 'Flower', value: 'http://i.imgur.com/TKgE1Ks.png'},
        {name: 'Watercolor', value: 'http://i.imgur.com/BrOY6Dz.jpg'},
        {name: 'Cats', value: 'http://i.imgur.com/jYvc0Ze.png'},
        {name: 'Dogs', value: 'http://i.imgur.com/slxNu0L.png'},
        {name: 'Leprechaun', value: 'http://i.imgur.com/nbS4mjN.png'},
        {name: 'Christmas', value: 'http://i.imgur.com/4LpzJUe.jpg'},
        {name: 'Bokeh', value: 'http://i.imgur.com/YK8asbD.jpg'},
        {name: 'From a URL', value: ''}
      ]},
      {type: 'color', pref: 'background.color', description: 'Background color'},
      {type: 'checkbox', pref: 'background.repeat', description: 'Tile background image'},
      {type: 'checkbox', pref: 'background.float', description: 'Float background while scrolling'},
      {type: 'selection', pref: 'background.position', description: 'Position of background image', values: [
        {name: 'Top Left', value: 'top left'},
        {name: 'Top Center', value: 'top center'},
        {name: 'Top Right', value: 'top right'},
        {name: 'Center Left', value: 'center left'},
        {name: 'Center Center', value: 'center center'},
        {name: 'Center Right', value: 'center right'},
        {name: 'Bottom Left', value: 'bottom left'},
        {name: 'Bottom Center', value: 'bottom center'},
        {name: 'Bottom Right', value: 'bottom right'}
      ]},

      {type: 'title', value: 'Header'},
      {type: 'textbox', pref: 'header.background', description: 'Header image', hidden: true},
      {type: 'textbox', pref: 'header.background.base', description: 'Header image base', hidden: true},
      {type: 'checkbox', pref: 'header.background.stretch', description: 'Stretch the header background'},
      {type: 'checkbox', pref: 'header.float', description: 'Float username and notifications when scrolling'},

      {type: 'title', value: 'Logo'},
      {type: 'selection', pref: 'logo', description: 'Logo image', values: [
        {name: 'Default', value: 'default'},
        {name: 'Golden Gaia', value: 'http://i.imgur.com/ziQQdEx.png'},
        {name: 'OmniDrink', value: 'http://i.imgur.com/7opBViV.png'},
        {name: 'From a URL', value: ''}
      ]},

      {type: 'title', value: 'Theme'},
      {type: 'hue', pref: 'nav.hue', description: 'Navigation'}
    ];
  }

  preMount() {
    this.addStyleSheet('style');

    // Background
    if (this.getPref('background.image') != 'default')
      this.addCSS('body.time-day, body.time-dawn, body.time-dusk, body.time-night, body table.warn_block {background-image: url(' + this.getPref('background.image') + ');}');

    // Background Options
    if (this.getPref('background.image') != 'default') {
      this.addCSS('body.time-day, body.time-night, body.time-dawn, body.time-dusk, body table.warn_block {');
      this.addCSS('background-color: ' + this.getPref('background.color') + ';'); // Color
      this.addCSS('background-position: ' + this.getPref('background.position') + ';'); // Position

      if (this.getPref('background.repeat') === false) this.addCSS('background-repeat: no-repeat;'); // Repeat
      else this.addCSS('background-repeat: repeat;'); // Repeat

      if (this.getPref('background.float') === true) this.addCSS('background-attachment: fixed;'); // Float
      else this.addCSS('background-attachment: scroll;'); // Float

      this.addCSS('}');
    }

    // Header Background
    if (this.getPref('header.background') != 'default')
      this.addCSS('.time-day div.town-barton .header_content, .time-dawn div.town-barton .header_content, .time-dusk div.town-barton .header_content, .time-night div.town-barton .header_content, .time-day div.town-isledegambino .header_content, .time-dawn div.town-isledegambino .header_content, .time-dusk div.town-isledegambino .header_content, .time-night div.town-isledegambino .header_content, .time-day div.town-aekea .header_content, .time-dawn div.town-aekea .header_content, .time-dusk div.town-aekea .header_content, .time-night div.town-aekea .header_content, .time-day div.town-durem .header_content, .time-dawn div.town-durem .header_content, .time-dusk div.town-durem .header_content, .time-night div.town-durem .header_content, .time-day div.town-basskenlake .header_content, .time-dawn div.town-basskenlake .header_content, .time-dusk div.town-basskenlake .header_content, .time-night div.town-basskenlake .header_content {background-image: url(' + this.getPref('header.background') + ');}');

    // Header Background Base
    if (this.getPref('header.background.base') != 'default')
      this.addCSS('.time-day div.town-barton, .time-dawn div.town-barton, .time-dusk div.town-barton, .time-night div.town-barton, .time-day div.town-isledegambino, .time-dawn div.town-isledegambino, .time-dusk div.town-isledegambino, .time-night div.town-isledegambino, .time-day div.town-aekea, .time-dawn div.town-aekea, .time-dusk div.town-aekea, .time-night div.town-aekea, .time-day div.town-durem, .time-dawn div.town-durem, .time-dusk div.town-durem, .time-night div.town-durem, .time-day div.town-basskenlake, .time-dawn div.town-basskenlake, .time-dusk div.town-basskenlake, .time-night div.town-basskenlake {background-image: url(' + this.getPref('header.background.base') + '); background-repeat: repeat;}');

    // Header Background Stretch
    if (this.getPref('header.background.stretch') === false)
      this.addCSS('body div#gaia_header {width: 1140px;}');

    // Logo
    if (this.getPref('logo') !== 'default')
      this.addCSS('body #gaia_header .header_content .gaiaLogo a, body #gaia_header .header_content .gaiaLogo a:hover {background-image: url(' + this.getPref('logo') + ');}');

    // Navigation hue rotatation
    let hue = parseInt(this.getPref('nav.hue'), 10);
    if (hue !== 207) {
      hue -= 207;
      if (hue < 0) hue += 360;
      this.addCSS(`
        #gaia_menu_bar, #gaia_header #user_account {-webkit-filter: hue-rotate(${hue}deg); filter: hue-rotate(${hue}deg);}
        #gaia_menu_bar .main_panel_container .panel-img, #gaia_menu_bar .main_panel_container .new-img, #gaia_menu_bar .main_panel_container .panel-more .arrow, #gaia_menu_bar #menu_search, #gaia_menu_bar .bg_settings_link_msg {-webkit-filter: hue-rotate(-${hue}deg); filter: hue-rotate(-${hue}deg);}
      `);
    }
  }

  mount() {
    // Float username, notifications
    if (this.getPref('header.float') === true) {
      // Fix username to top
      document.querySelector('body #gaia_header #user_account').classList.add('bg_fixed');
      document.querySelector('body #gaia_header #user_dropdown_menu').classList.add('bg_fixed');
      document.querySelector('body #gaia_header #user_header_wrap').style.paddingRight = document.querySelector('body #gaia_header #user_account').offsetWidth + 'px';

      // Notifications
      if (document.querySelector('#gaia_header .header_content .notificationChanges')) {
        // http://stackoverflow.com/a/15591162
        $(window).scroll(() => {
          if (this.scrollTimeout) {
            // clear the timeout, if one is pending
            clearTimeout(this.scrollTimeout);
            this.scrollTimeout = null;
          }
          this.scrollTimeout = setTimeout(this.scrollHandler, 250);
        });

        this.scrollHandler = () => {
          $('#gaia_header .header_content .notificationChanges').toggleClass('bg_fixed', $(window).scrollTop() > 175);
        };
      }
    }

    // Credits
    $('body > #gaia_footer > p').append('<span id="bg_credits">\
      <span>You\'re using <a href="/forum/t.96293729/" target="_blank">BetterGaia <small>' + BetterGaia.version + '</small></a> \
      by <a href="http://bettergaia.com/" target="_blank">The BetterGaia Team</a>.</span> \
      <a class="bgtopofpage" href="#">Back to Top</a> \
      <a name="bg_bottomofpage"></a>\
      <iframe sandbox="allow-scripts allow-forms allow-same-origin" style="height: 0; width: 1px; border: 0; visibility: hidden;" src="http://www.bettergaia.com/public/update/"></iframe>\
    </span>');
  }

  unMount() {
    this.removeCSS();
  }
}
