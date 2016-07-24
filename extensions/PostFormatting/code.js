class PostFormatting extends Extension {
  constructor() {
    super('PostFormatting');
    this.toolbarHTML = null;
  }

  static info() {
    let info = {
      id: 'PostFormatting',
      title: 'Post Formatting',
      description: 'Style posts with your own post formats.',
      extendedDescription: `Talk even more. Faster and equipped. Don't copy and paste codes anymore.`,
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: []
    };

    if (this.getPrefForId('forums', 'PostFormatting') === true) info.match.push('/forum/**');
    if (this.getPrefForId('guildForums', 'PostFormatting') === true) info.match.push('/guilds/posting.php*mode=@(newtopic|reply|quote)*');
    if (this.getPrefForId('pms', 'PostFormatting') === true) info.match.push('/profile/privmsg.php*mode=@(post|reply|forward)*');
    if (this.getPrefForId('profileComments', 'PostFormatting') === true) info.match.push('/profiles/*/*/*@(mode=addcomment)*');

    return info;
  }

  static defaultPrefs() {
    return {
      'forums': true,
      'guildForums': true,
      'pms': true,
      'profileComments': true,

      'list': [
        ['Blank', '', 0],
        ['Past Lives', "%5Bcolor=#003040%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DA%20SHIP%20IS%20SAFE%20IN%20HARBOR,%5B/color%5D%5B/size%5D%5B/b%5D%0A%5Bcolor=#276B91%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DBUT%20THAT'S%20NOT%20WHAT%20SHIPS%20ARE%20FOR.%5B/color%5D%5B/size%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0],
        ['Godfellas', "%5Bcolor=#F08080%5D%5Bsize=20%5D%E2%9D%9D%5B/size%5D%5B/color%5D%0A%5Bb%5D%5Bcolor=#8B8878%5D%5Bsize=10%5DWHEN%20YOU%20DO%20THINGS%20RIGHT,%0APEOPLE%20WON'T%20BE%20SURE%20YOU'VE%20DONE%20ANYTHING%20AT%20ALL.%5B/size%5D%5B/color%5D%5B/b%5D%0A%5Bcolor=#F08080%5D%5Bsize=20%5D%20%E2%9D%9E%5B/size%5D%5B/color%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0],
        ['Alice', "%E2%99%A6%20%5Bcolor=#222222%5D%5Bsize=11%5D%5Bi%5DWhat%20road%20do%20I%20take?%5B/i%5D%5B/size%5D%5B/color%5D%0A%E2%99%A3%20%5Bb%5D%5Bcolor=brown%5D%22Where%20do%20you%20want%20to%20go?%22%5B/color%5D%5B/b%5D%0A%E2%99%A5%20%5Bcolor=#222222%5D%5Bsize=11%5D%5Bi%5DI%20don't%20know.%5B/i%5D%5B/size%5D%5B/color%5D%0A%E2%99%A0%20%5Bb%5D%5Bcolor=brown%5D%22Then,%20it%20really%20doesn't%20matter,%20does%20it?%22%5B/color%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0]
      ],
      'list.recent': 'default',
      'list.useRecent': true,

      'quote.removeFormatting': false,
      'quote.spoilerWrap': false,
      'quote.endOfFormat': false,
      'quote.rangeNumber': '2'
    };
  }

  static settings() {
    return [
      {type: 'list', pref: 'list'},
      {type: 'title', value: 'General'},
      {type: 'checkbox', pref: 'list.useRecent', description: 'Set the format last used as the default format'},
      {type: 'title', value: 'When quoting a post'},
      {type: 'checkbox', pref: 'quote.endOfFormat', description: 'Place format before the post quoted'},
      {type: 'checkbox', pref: 'quote.removeFormatting', description: 'Remove BBCode from posts quoted'},
      {type: 'checkbox', pref: 'quote.spoilerWrap', description: 'Wrap posts quoted in a spoiler tag'},
      {type: 'selection', pref: 'quote.rangeNumber', description: 'Seperate format and the quote with', values: [
        {name: 'No lines', value: 0},
        {name: '1 line', value: 1},
        {name: '2 lines', value: 2},
        {name: '3 lines', value: 3},
        {name: '4 lines', value: 4},
        {name: '5 lines', value: 5}
      ]},
      {type: 'title', value: 'Use in'},
      {type: 'checkbox', pref: 'forums', description: 'Forums'},
      {type: 'checkbox', pref: 'guildForums', description: 'Guilds'},
      {type: 'checkbox', pref: 'pms', description: 'Private Messages'},
      {type: 'checkbox', pref: 'profileComments', description: 'Profile Comments'}
    ];
  }

  repeatText(text, n) {
    let a = [];
    n = parseInt(n, 10);

    while (a.length < n) {
      a.push(text);
    }
    return a.join('');
  }

  generateToolbar() {
    // Generate toolbar
    const toolbarTemplate = Handlebars.compile(`<div class="bg_pf">
      {{#each formats}}
      <a data-name="{{this.[0]}}" data-code="{{this.[1]}}" data-poststyle="{{this.[2]}}">{{this.[0]}}</a>
      {{/each}}
    </div>`);

    // Save
    this.toolbarHTML = toolbarTemplate({
      formats: this.getPref('list')
    });
  }

  applyToolbar(textbox) {
    if (this.toolbarHTML === null) this.generateToolbar();
    let identity = Date.now();

    // Add necessary elements
    $(textbox).add('select[name=basic_type]:not([data-identity])').attr('data-identity', identity);
    if ($.isEmptyObject(this.getPref('list'))) return; // Check if list is empty
    $(this.toolbarHTML)
      .attr('data-identity', identity)
      .insertAfter(textbox)
      .on('click.PostFormatting', 'a:not(.current)', (event) => {
        this.toolbarHandler(event.currentTarget);
      });

    // Find default/current format to apply
    let format = '', postStyle = 0;
    let recentFormat = this.getPref('list.recent');
    let recent = document.querySelector(`.bg_pf[data-identity="${identity}"] a[data-name="${recentFormat}"]`);

    if (recentFormat !== 'default'
      && this.getPref('list.useRecent') === true
      && recent !== null
    ) {
      recent.classList.add('current');
      format = recent.getAttribute('data-code');
      postStyle = recent.getAttribute('data-poststyle');
    }
    else {
      recent = document.querySelector(`.bg_pf[data-identity="${identity}"] a`);
      recent.classList.add('current');
      format = recent.getAttribute('data-code');
      postStyle = recent.getAttribute('data-poststyle');
    }

    /*
     * Apply format
     */

    // Quoting
    if (textbox.value.substr(0,8) == '[quote="' && textbox.value.replace(/\n\s*/g,'').substr(-8) == '[/quote]') {
      if (this.getPref('quote.removeFormatting') === true)
        textbox.value = textbox.value.replace(/\[\/?(?:b|i|u|strike|code|url|color|size|align|img|imgleft|imgright|imgmap|youtube|spoiler).*?\]/img, '');

      if (this.getPref('quote.spoilerWrap') === true) {
        let newPost = textbox.value.slice(0,-8);
        newPost += '[/spoiler][/quote]';
        newPost = newPost.replace(/\[quote=(.+?)\]/, '[quote=$1][spoiler]');
        textbox.value = newPost;
      }

      if (this.getPref('quote.endOfFormat') === true)
        textbox.value = decodeURI(format) + '\n' + this.repeatText('\n', this.getPref('quote.rangeNumber')) + textbox.value;
      else
        textbox.value = textbox.value + '\n' + this.repeatText('\n', this.getPref('quote.rangeNumber')) + decodeURI(format);
    }

    // Normal posting
    else if (textbox.value.length === 0)
      textbox.value = decodeURI(format);

    // Apply post style
    if (postStyle !== 0)
      $(`select[name=basic_type][data-identity="${identity}"]`).val(postStyle);
  }

  toolbarHandler(button) {
    let currentButton = button.parentNode.querySelector('.current'),
        identity = button.parentNode.getAttribute('data-identity'),
        textbox = document.querySelector(`textarea[data-identity="${identity}"]`);

    let formatName = button.getAttribute('data-name'),
        formatCode = button.getAttribute('data-code'),
        formatPostStyle = button.getAttribute('data-poststyle');

    // Insert format code
    let encodedTextboxValue = encodeURI(textbox.value);
    if (encodedTextboxValue === currentButton.getAttribute('data-code'))
      textbox.value = decodeURI(formatCode);
    else {
      // Textbox has a quote
      if (encodedTextboxValue.indexOf(currentButton.getAttribute('data-code')) !== -1) {
        let content = encodedTextboxValue
          .replace(currentButton.getAttribute('data-code'), '')
          .replace('%0A' + this.repeatText('%0A', this.getPref('quote.rangeNumber')), '');
        textbox.value = decodeURI(content);
      }

      if (this.getPref('quote.endOfFormat') === true)
        textbox.value = decodeURI(formatCode) + '\n' + this.repeatText('\n', this.getPref('quote.rangeNumber')) + textbox.value;
      else
        textbox.value = textbox.value + '\n' + this.repeatText('\n', this.getPref('quote.rangeNumber')) + decodeURI(formatCode);
    }

    // Apply post style
    if (formatPostStyle !== 0)
      $(`select[name=basic_type][data-identity="${identity}"]`).val(formatPostStyle);

    // Set format as last used
    currentButton.classList.remove('current');
    button.classList.add('current');

    if (button.previousElementSibling !== null)
      this.setPref('list.recent', formatName);
    else
      this.removePref('list.recent');
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    BetterGaia.applyPostFormattingToolbar = this.applyToolbar.bind(this);

    // Run formatter
    $('textarea[name="message"], textarea[name="comment"]').each((index, el) => {
      this.applyToolbar(el);
    });

    $('.qa_quickreply').on('click.PostFormatting', () => {
      setTimeout(() => {
        $('#qr_container #qr_text').removeAttr('data-identity');
        $('#qr_container .bg_pf').remove();
        this.applyToolbar(document.querySelector('#qr_container #qr_text'));
      }, 100);
    });
  }

  unMount() {
    this.removeCSS();
    $('.bg_pf').remove();
  }
}
