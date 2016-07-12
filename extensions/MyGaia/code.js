class MyGaia extends Extension {
  constructor() {
    super('MyGaia');
    this.match = ['/mygaia/'];
  }

  static info() {
    return {
      id: 'MyGaia',
      title: 'My Gaia',
      description: 'A more modern My Gaia page.',
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
    $('body.mygaia #gaia_content.grid_ray_davies #bd #yui-main .yui-g > .left').prepend('<div id="bg_sidebar" class="mg_content">\
        <div class="mg_sprite hd">BetterGaia <small class="bgversion">' + BetterGaia.version + '</small>\
            <a class="bg_expand"></a>\
        </div>\
        <div class="bd">\
            <iframe sandbox="allow-scripts allow-forms allow-same-origin allow-popups" width="100%" frameborder="0" src="http://www.bettergaia.com/sidebar/"></iframe>\
        </div>\
    </div>');

    $('#bg_sidebar .bg_expand').on('click.MyGaia', function() {
        $('#gaia_content .left').toggleClass('bgexpanded');
    });
  }

  unMount() {
    this.removeCSS();
    $('#bg_sidebar .bg_expand').off('click.MyGaia');
    $('#bg_sidebar').remove();
  }
}
