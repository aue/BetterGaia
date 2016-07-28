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
      {type: 'selection', pref: 'header.background.selection', description: 'Header image', values: [
        {name: 'Default', value: ['default', 'default']},
        {type: 'group', name: 'Towns', values: [
          {name: 'Barton', value: ['http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_barton_sprite.jpg', 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_barton_tile_sprite.jpg']},
          {name: 'Aekea', value: ['http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_aekea_sprite.jpg', 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_aekea_tile_sprite.jpg']},
          {name: 'Bassken', value: ['http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_bassken_sprite.jpg', 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_bassken_tile_sprite.jpg']},
          {name: 'Durem', value: ['http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_durem_sprite.jpg', 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_durem_tile_sprite.jpg']},
          {name: 'Gambino', value: ['http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_gambino_sprite.jpg', 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_gambino_tile_sprite.jpg']}
        ]},
        {type: 'group', name: '2016', values: [
          {name: 'Heads or Tails CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/d9c61c26ebbf.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/74d363dd6539.jpg']},
          {name: 'Talking Ship CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/e812119ce109.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/fb870acd2036.jpg']},
          {name: 'Unlucky in Love CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/44a9765bf81c.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/7b7b8b0c0e22.jpg']},
          {name: 'IMagicNation CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/0021d44b7901.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/15ebb37bc0f1.jpg']},
          {name: 'Bunvoyage', value: ['http://s.cdn.gaiaonline.com/images/event/easter2016/201603_easterevent_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/easter2016/201603_easterevent_header_cut.jpg']},
          {name: 'You Lied to Me', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/28706ca5d5f5.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/7801b0709b01.jpg']},
          {name: 'You Lied to Me 2', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/e08fd7ba5ee9.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/7801b0709b01.jpg']},
          {name: 'You Lied to Me 3', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/d3235b0630b4.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/7801b0709b01.jpg']},
          {name: 'You Lied to Me 4', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/35c2f46c18cd.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/7801b0709b01.jpg']},
          {name: 'You Lied to Me 5', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/b74324a0ef2f.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/7801b0709b01.jpg']},
          {name: 'Quartz Stub CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/dd424154c28f.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/fcb200bc0c7c.jpg']},
          {name: 'Tailored Star: Spring Fling CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/4c9469b4a4ed.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/4368835f48a4.jpg']},
          {name: 'Geemoji', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/aa8d602572c3.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/d8c7113e52c2.jpg']},
          {name: 'Everything Is Fine', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/6156c1128f3c.png', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/a815a95660d2.jpg']},
          {name: 'Afterschool Life CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/b1c8972573cd.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/1c3c813b71fb.jpg']},
          {name: 'Memorial Day Sale', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/93bdf88dd6b1.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/92db42196485.jpg']},
          {name: 'CONnect CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/3a4fe67d3685.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/2bd4f8fb50a4.jpg']},
          {name: 'Apunkalyptic CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/41944e01124f.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/2786e969f3ec.jpg']}
        ]},
        {type: 'group', name: '2015', values: [
          {name: 'New Attitude CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/031863aab421.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/00cc68fa2feb.jpg']},
          {name: 'Ships Going Down CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/866ee81a6367.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/99fbb353cb95.jpg']},
          {name: 'Love Me Not VDAY', value: ['http://s.cdn.gaiaonline.com/images/event/vday2015/2015valentines_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/vday2015/2015valentines_header_cut.jpg']},
          {name: 'Brainologists Unite CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/d9c8d86f8f39.png', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/a6bcf56e6716.jpg']},
          {name: 'Tendit Ad Astra CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/dc75a97ffef8.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/cbcde1a26746.jpg']},
          {name: 'Buffer Every Day', value: ['http://s.cdn.gaiaonline.com/images/event/spring2015/header/201503_marchevent_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/spring2015/header/201503_marchevent_header_cut.jpg']},
          {name: 'Intersteller Bunvasion', value: ['http://s.cdn.gaiaonline.com/images/event/easter2015/201504_easterevent_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/easter2015/201504_easterevent_header_cut.jpg']},
          {name: 'Arcane Chevalier CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/871de4b72f41.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/735698020d2f.jpg']},
          {name: 'Conspicuous CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/c08d4e11ac24.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/eb37b50eabee.jpg']},
          {name: 'Camp Nimbus CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/8677a965113f.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/2c6812799d46.jpg']},
          {name: 'Summer Sale', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/75e15a8e3ac7.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/3ea09a047c9c.jpg']},
          {name: 'Joker\'s Wild CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/5549ee3c7a52.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/43d02a451a95.jpg']},
          {name: 'Lake Kindred', value: ['http://s.cdn.gaiaonline.com/images/event/summer2015/Kindred_site_header_970x150.jpg', 'http://s.cdn.gaiaonline.com/images/event/summer2015/Kindred_site_header_150x150.jpg']},
          {name: 'Starstruck CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/727760fbe357.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/5610475b85d9.jpg']},
          {name: 'Spirit of the Smackdown', value: ['http://s.cdn.gaiaonline.com/images/event/august2015/site_header_2015_august_event.jpg', 'http://s.cdn.gaiaonline.com/images/event/august2015/site_header_2015_august_event_repeat.png']},
          {name: 'Back to Fashion School CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/6e8b86c5047c.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/080373ff10d0.jpg']},
          {name: 'Force to Be Reckoned With', value: ['http://s.cdn.gaiaonline.com/images/event/sept2015/2015_charge_event_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/sept2015/2015_charge_event_header_tile.jpg']},
          {name: 'Netherhood CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/d58f80cf81da.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/769bbf400009.jpg']},
          {name: 'ShadowLab', value: ['http://s.cdn.gaiaonline.com/images/event/halloween2015/header/201510_halloween_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/halloween2015/header/201510_halloween_header_cut.jpg']},
          {name: 'Woodland\'s Faye CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/9cc53b3719c5.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/855ddb920a93.jpg']},
          {name: 'Black Friday Sale', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/73429effaa9d.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/6924b86c72b3.jpg']},
          {name: 'Hella Cool CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/defeeeb45d5b.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/108e95eda6c9.jpg']},
          {name: 'Bitter Revival', value: ['http://s.cdn.gaiaonline.com/images/event/winter2015/201512_xmasevent_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/winter2015/201512_xmasevent_header_cut.jpg']}
        ]},
        {type: 'group', name: '2014', values: [
          {name: 'Nouvelle Lune CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/e6eac8682bc5.png', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/a542ea314a19.png']},
          {name: 'In Deep Ship CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/d6e59239864b.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/ed0fa8df7f51.jpg']},
          {name: 'Underworld Descent CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/aec1b0ce10ea.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/35292f294744.jpg']},
          {name: 'Budding Bistro CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/b4062e071cbb.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/cd7f95cd0ac3.jpg']},
          {name: 'Rising Concerto', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/c91fb0d9cfc5.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/39889ef5c42d.jpg']},
          {name: 'April Fools', value: ['http://s.cdn.gaiaonline.com/images/event/aprilfool2014/april2k14_takeover_header.jpg', 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_barton_tile_sprite.jpg']},
          {name: 'Vivid Harmony CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/d18e5e4355e7.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/2745826a0148.jpg']},
          {name: 'Easter', value: ['http://s.cdn.gaiaonline.com/images/event/easter2014/header/easter2k14_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/easter2014/header/easter2k14_header_tile.jpg']},
          {name: 'Peyo\'s Fables CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/7754274af669.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/37665aca2798.jpg']},
          {name: 'Contagious CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/664c599d0f88.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/ef62adcdcdc4.jpg']},
          {name: 'Summer Sale', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/4d3f7d793522.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/ad1759c8c566.jpg']},
          {name: 'Rascal Rump CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/70d46372c8d1.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/131e76ab48a3.jpg']},
          {name: 'Tailored Star CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/f5e7a0861835.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/5881ebcf4861.jpg']},
          {name: 'Spirit of the Summer', value: ['http://s.cdn.gaiaonline.com/images/event/summer2014/header/summer2k14event_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/summer2014/header/summer2k14event_header_cut.jpg']},
          {name: 'Enigma Institute CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/b7de6f51b3f4.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/325803ed79a4.jpg']},
          {name: 'Luminous Void CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/4e3d6860f46d.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/426669570910.jpg']},
          {name: 'Zephyr Strife CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/489096c25c0b.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/35a02500859b.jpg']},
          {name: 'Frozen Repose CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/5fde46e9edcd.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/d4b2dbd23775.jpg']},
          {name: 'Bitter Slumber', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2014/201412_xmasheader.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2014/201412_xmasheader_cut.jpg']}
        ]},
        {type: 'group', name: '2013', values: [
          {name: 'Impractical Gala CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/january2013/header_010913_7197.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/january2013/header_cut_010913_7197.jpg']},
          {name: 'Anniversary 2013', value: ['http://s.cdn.gaiaonline.com/images/event/anniversary2013/header/luvofgaia2k13_header.jpg', 'http://s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_barton_tile_sprite.jpg']},
          {name: 'Final Line CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/4b01ec466401.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/fcf56e682f66.jpg']},
          {name: 'A Bunny\'s Lament', value: ['http://s.cdn.gaiaonline.com/images/event/easter2013/header/easter2013_bunnylament_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/easter2013/header/easter2013_bunnylament_cut.jpg']},
          {name: 'Culinary Coliseum CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/f39119b2a7ba.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/27e96ed46154.jpg']},
          {name: 'Seven Seas CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/5c7e3d98a667.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/5a1699541907.jpg']},
          {name: 'Game On CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/a61815193ed1.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/21184cda8166.jpg']},
          {name: 'What the Fluff!', value: ['http://s.cdn.gaiaonline.com/images/event/summer2013/summer2k13wtfluff_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/summer2013/summer2k13wtfluff_header_cut.jpg']},
          {name: 'Carnival Du Gothique CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/0235debf9df9.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/d85dedfcee8b.jpg']},
          {name: 'Starlight Redemption CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/422675eed918.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/430fe0a24c39.jpg']},
          {name: 'Return to Valefor CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/0830c7c8f1b9.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/7e9ec36d3710.jpg']},
          {name: 'Midnight Citadel CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/c5fdb3c41036.png', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/5d42e8ca0907.png']},
          {name: 'Halloween Vengeance', value: ['http://s.cdn.gaiaonline.com/images/event/halloween2013/header/h2k13_jkveb_header.png', 'http://s.cdn.gaiaonline.com/images/event/halloween2013/header/h2k13_jkveb_header_cut.png']},
          {name: 'Verdant Grove CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/82f4e66d65ef.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/247e5500f8a5.jpg']},
          {name: 'Checkmate Tactics CI', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/a4a27f51a3ac.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/223610ac73b4.jpg']},
          {name: 'Xmas Resolution', value: ['http://w.cdn.gaiaonline.com/mfs/index/adminupload/91329076499c.jpg', 'http://w.cdn.gaiaonline.com/mfs/index/adminupload/54733fd92683.jpg']}
        ]},
        {type: 'group', name: '2012', values: [
          {name: 'Radiant Galaxy CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/january2012/radiantglxy_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/january2012/radiantglxy_header_cut.jpg']},
          {name: 'Love Charm III CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/february2012/feb_luvchrm3_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/february2012/feb_luvchrm3_header_cut.jpg']},
          {name: 'Club Limbo CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/march2012/clblimbo_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/march2012/clblimbo_header_cut.jpg']},
          {name: 'Easter 2K12', value: ['http://s.cdn.gaiaonline.com/images/event/easter2012/header/easter2k12_header2.jpg', 'http://s.cdn.gaiaonline.com/images/event/easter2012/header/easter2k12_header2_cut.jpg']},
          {name: 'Gauntlets & Goblins CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/april2012/gauntletsngoblins_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/april2012/gauntletsngoblins_header_cut.jpg']},
          {name: 'Radio Havok CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/may2012/radiohavok_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/may2012/radiohavok_header_cut.jpg']},
          {name: 'Digital Rainbow CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/june2012/header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/june2012/header_cut.jpg']},
          {name: 'Runic Challenge CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/july2012/header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/july2012/header_cut.jpg']},
          {name: 'Rejected Olympics 2K12', value: ['http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_header_cut.jpg']},
          {name: 'RO 2K12 Aekea', value: ['http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_aekea_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_header_cut.jpg']},
          {name: 'RO 2K12 Barton', value: ['http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_barton_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_header_cut.jpg']},
          {name: 'RO 2K12 Durem', value: ['http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_durem_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_header_cut.jpg']},
          {name: 'RO 2K12 Gambino', value: ['http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_gambino_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/olympics2012/header/2012ROsummer_header_cut.jpg']},
          {name: 'Forgotten Reverie CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/august2012/header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/august2012/header_cut.jpg']},
          {name: 'Champion Halls CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/september2012/header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/september2012/header_cut.jpg']},
          {name: 'Heralds of Chaos', value: ['http://s.cdn.gaiaonline.com/images/hoc/header/HOC_gaiaheader_default.jpg', 'http://i.imgur.com/7TxfH9B.jpg']},
          {name: 'HoC Demon', value: ['http://s.cdn.gaiaonline.com/images/hoc/header/HOC_gaiaheader_demon.jpg', 'http://i.imgur.com/7TxfH9B.jpg']},
          {name: 'HoC Dragon', value: ['http://s.cdn.gaiaonline.com/images/hoc/header/HOC_gaiaheader_dragon.jpg', 'http://i.imgur.com/7TxfH9B.jpg']},
          {name: 'HoC Kingdom', value: ['http://s.cdn.gaiaonline.com/images/hoc/header/HOC_gaiaheader_kingdom.jpg', 'http://i.imgur.com/7TxfH9B.jpg']},
          {name: 'Dark Reflection 2 CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/october2012/header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/october2012/header_cut.jpg']},
          {name: 'Halloween', value: ['http://s.cdn.gaiaonline.com/images/event/halloween2012/header/thedon_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/halloween2012/header/thedon_header_side.jpg']},
          {name: 'Cryptic Path CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/november2012/header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/november2012/header_cut.jpg']},
          {name: 'Trinket Heart CI', value: ['http://s.cdn.gaiaonline.com/images/event/ci/december2012/header.jpg', 'http://s.cdn.gaiaonline.com/images/event/ci/december2012/header_cut.jpg']},
          {name: 'Apocalypsmas (Xmas)', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_1.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_1_side.jpg']},
          {name: 'Apocalypsmas 2', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_2.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_2_side.jpg']},
          {name: 'Apocalypsmas 3', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_3.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_3_side.jpg']},
          {name: 'Apocalypsmas 4', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_4.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_4_side.jpg']},
          {name: 'Apocalypsmas 5', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_5.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_5_side.jpg']},
          {name: 'Apocalypsmas 6', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/apocalypsmas_header_01ABC.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_1_side.jpg']},
          {name: 'Apocalypsmas 7', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/apocalypsmas_header_02DCF.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_1_side.jpg']},
          {name: 'Apocalypsmas 8', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/apocalypsmas_header_03J8C.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_4_side.jpg']},
          {name: 'Apocalypsmas 9', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/apocalypsmas_header_04LXQ.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_4_side.jpg']},
          {name: 'Apocalypsmas 10', value: ['http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/apocalypsmas_header_05AW2.jpg', 'http://s.cdn.gaiaonline.com/images/event/xmas2012/headers/header_4_side.jpg']}
        ]},
        {type: 'group', name: '2011', values: [
          {name: 'Buccaneer Boardwalk', value: ['http://s.cdn.gaiaonline.com/images/zomg/beachboard_header.jpg', 'http://s.cdn.gaiaonline.com/images/zomg/boardwalk_header_tile.jpg']},
          {name: 'Lost Chapter CI', value: ['http://i.imgur.com/6aJsCQa.jpg', 'http://i.imgur.com/s0eUNC6.jpg']},
          {name: 'Love Charm II CI', value: ['http://i.imgur.com/dvJN7WL.jpg', 'http://i.imgur.com/nQTaXWB.jpg']},
          {name: 'Crystal Overdrive CI', value: ['http://i.imgur.com/HH7w7pl.jpg', 'http://i.imgur.com/Ieg530s.jpg']},
          {name: 'Meowbook', value: ['http://i.imgur.com/sq7p6tZ.jpg', 'http://i.imgur.com/tX9TV3M.jpg']},
          {name: 'Arcana Break CI', value: ['http://i.imgur.com/EQlHGsk.jpg', 'http://i.imgur.com/1wh45uQ.jpg']},
          {name: 'Easter', value: ['http://s.cdn.gaiaonline.com/images/event/easter2011/easter2011_bg.jpg', 'http://s.cdn.gaiaonline.com/images/event/easter2011/easter2011_bg2.jpg']},
          {name: 'Eternal Rivals CI', value: ['http://i.imgur.com/az5QRs1.jpg', 'http://i.imgur.com/SpWuqUT.jpg']},
          {name: 'Monster Galaxy', value: ['http://s.cdn.gaiaonline.com/images/event/mogaheader/11_05_moga_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/mogaheader/11_05_moga_header_tile.jpg']},
          {name: 'Screen King CI', value: ['http://i.imgur.com/83edx4s.jpg', 'http://i.imgur.com/zvVJZPB.jpg']},
          {name: 'Pie Hard', value: ['http://s.cdn.gaiaonline.com/images/event/piehard2011/pie_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/piehard2011/pie_header_tile.JPG']},
          {name: 'Double Rainbow CI', value: ['http://i.imgur.com/vcyhLXc.jpg', 'http://i.imgur.com/zxDjE9a.jpg']},
          {name: 'Valefor Academy CI', value: ['http://i.imgur.com/dUZeCyP.jpg', 'http://i.imgur.com/d7wHsTD.jpg']},
          {name: 'Neverland CI', value: ['http://i.imgur.com/56JLY4I.jpg', 'http://i.imgur.com/5UAAbix.jpg']},
          {name: 'Famestar Masquerade CI', value: ['http://i.imgur.com/aaAJgGh.jpg', 'http://i.imgur.com/mb8pYEI.png']},
          {name: 'Guardian Totem CI', value: ['http://i.imgur.com/tBXw8Rr.jpgg', 'http://i.imgur.com/E2X88et.png']},
          {name: 'Underland CI', value: ['http://s.cdn.gaiaonline.com/images/event/december2011ci/dec2011_underland_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/december2011ci/dec2011_underland_header_cut.jpg']},
          {name: 'Carol of Old Pete', value: ['http://i.imgur.com/E4QYakz.jpg', 'http://i.imgur.com/vWV48qL.jpg']}
        ]},
        {type: 'group', name: '2010', values: [
          {name: 'Love Charm RIG', value: ['http://s.cdn.gaiaonline.com/images/rig/january2010/0110_rig.jpg', 'http://s.cdn.gaiaonline.com/images/rig/january2010/0110_rig_tile.jpg']},
          {name: 'Poseidon Legacy RIG', value: ['http://s.cdn.gaiaonline.com/images/rig/february2010/pseidon_banner.jpg', 'http://s.cdn.gaiaonline.com/images/rig/february2010/pseidon_banner_tile.jpg']},
          {name: 'Code Alpha CI', value: ['http://s.cdn.gaiaonline.com/images/rig/march2010/march_rig.jpg', 'http://i.imgur.com/KWc1pMA.png']},
          {name: 'April Fools', value: ['http://s.cdn.gaiaonline.com/images/event/afevent2010/2010_af_header.gif', 'default']},
          {name: 'Easter', value: ['http://i.imgur.com/H1aj2Gs.jpg', 'http://i.imgur.com/m5RGmki.png']},
          {name: 'Perfect Tragedy CI', value: ['http://i.imgur.com/z3ZpwVA.jpg', 'http://i.imgur.com/6Nsru3X.jpg']},
          {name: 'Sparkling', value: ['http://i.imgur.com/OeUAml6.jpg', 'http://i.imgur.com/DwMz7UM.jpg']},
          {name: 'Luna\'s Incense CI', value: ['http://s.cdn.gaiaonline.com/images/rig/may2010/dream_header.jpg', 'http://s.cdn.gaiaonline.com/images/rig/may2010/dream_header_tile.jpg']},
          {name: 'Famestar Hero CI', value: ['http://s.cdn.gaiaonline.com/images/rig/june2010/musicheader.png', 'http://s.cdn.gaiaonline.com/images/rig/june2010/musicheader_cut.png']},
          {name: 'Spring Cleaning', value: ['http://i.imgur.com/0MWY9yK.jpg', 'default']},
          {name: 'Wrath of Gaia CI', value: ['http://s.cdn.gaiaonline.com/images/rig/july2010/july_header.jpg', 'http://s.cdn.gaiaonline.com/images/rig/july2010/july_header_cut.jpg']},
          {name: 'Final Reign CI', value: ['http://s.cdn.gaiaonline.com/images/rig/august2010/August_Header.jpg', 'http://s.cdn.gaiaonline.com/images/rig/august2010/August_Header_cut.jpg']},
          {name: 'Frontier Skies', value: ['http://i.imgur.com/27EkLvm.jpg', 'http://i.imgur.com/R5qsIk6.jpg']},
          {name: 'Cirque Du Gothique CI', value: ['http://i.imgur.com/hnXUFUK.jpg', 'http://i.imgur.com/q5odbA2.png']},
          {name: 'Hell Prison CI', value: ['http://s.cdn.gaiaonline.com/images/event/october2010ci/oct2010_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/october2010ci/oct2010_header_cut.jpg']},
          {name: 'Neon Core CI', value: ['http://s.cdn.gaiaonline.com/images/event/november2010ci/nov2010_header.jpg', 'http://s.cdn.gaiaonline.com/images/event/november2010ci/nov2010_header_cut.jpg']},
          {name: 'Cats and Dogs', value: ['http://w.cdn.gaiaonline.com/imaging/cms/header_minievent_1a_1291681922_bkgd.jpg', 'http://i.imgur.com/pQFbtE1.jpg']},
          {name: 'Bitterfrost CI', value: ['http://i.imgur.com/caCE7W0.jpg', 'http://i.imgur.com/CdVkp4q.jpg']}
        ]},
        {type: 'group', name: '2009', values: [
          {name: 'Easter', value: ["http://i.imgur.com/wZU1xZ3.jpg", "http://i.imgur.com/wzOdFfP.jpg"]},
          {name: 'Earth Day', value: ["http://i.imgur.com/3yMo50M.jpg", "http://i.imgur.com/E76CCum.jpg"]},
          {name: 'Prom', value: ["http://i.imgur.com/CpkDYmQ.jpg", "http://i.imgur.com/mBx1ysa.jpg"]},
          {name: 'Summer', value: ["http://i.imgur.com/6LUjfFo.jpg", "http://i.imgur.com/c5KlJ6l.jpg"]},
          {name: 'Camp', value: ["http://i.imgur.com/QIlf575.jpg", "http://i.imgur.com/sVOAIJV.jpg"]},
          {name: 'Halloween', value: ["http://i.imgur.com/lCMRfHP.jpg", "http://i.imgur.com/qq2R5AG.jpg"]},
          {name: 'Christmas', value: ["http://i.imgur.com/d7Ttojw.jpg", "http://i.imgur.com/immSmOs.jpg"]}
      	]},
        {name: 'From a URL', value: 'custom'}
      ]},
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

    // Background Options
    if (this.getPref('background.image') != 'default') {
      this.addCSS('body.time-day, body.time-night, body.time-dawn, body.time-dusk, body table.warn_block {');

      this.addCSS('background-image: url(' + this.getPref('background.image') + ');'); // Image
      this.addCSS('background-color: ' + this.getPref('background.color') + ';'); // Color
      this.addCSS('background-position: ' + this.getPref('background.position') + ';'); // Position

      if (this.getPref('background.repeat') === false) this.addCSS('background-repeat: no-repeat;'); // Repeat
      else this.addCSS('background-repeat: repeat;');

      if (this.getPref('background.float') === true) this.addCSS('background-attachment: fixed;'); // Float
      else this.addCSS('background-attachment: scroll;');

      this.addCSS('}');
    }

    // Header Background
    if (this.getPref('header.background') !== 'default')
      this.addCSS('.time-day div.town-barton .header_content, .time-dawn div.town-barton .header_content, .time-dusk div.town-barton .header_content, .time-night div.town-barton .header_content, .time-day div.town-isledegambino .header_content, .time-dawn div.town-isledegambino .header_content, .time-dusk div.town-isledegambino .header_content, .time-night div.town-isledegambino .header_content, .time-day div.town-aekea .header_content, .time-dawn div.town-aekea .header_content, .time-dusk div.town-aekea .header_content, .time-night div.town-aekea .header_content, .time-day div.town-durem .header_content, .time-dawn div.town-durem .header_content, .time-dusk div.town-durem .header_content, .time-night div.town-durem .header_content, .time-day div.town-basskenlake .header_content, .time-dawn div.town-basskenlake .header_content, .time-dusk div.town-basskenlake .header_content, .time-night div.town-basskenlake .header_content {background-image: url(' + this.getPref('header.background') + ');}');

    // Header Background Base
    if (this.getPref('header.background.base') !== 'default')
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
