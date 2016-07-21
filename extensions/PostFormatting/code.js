class PostFormatting extends Extension {
  constructor() {
    super('PostFormatting');
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

    if (this.getPrefForId('format.forums', 'PostFormatting') === true) info.match.push('/forum/compose/**');
    if (this.getPrefForId('format.guildForums', 'PostFormatting') === true) info.match.push('/guilds/posting.php*mode=@(newtopic|reply|quote)*');
    if (this.getPrefForId('format.pms', 'PostFormatting') === true) info.match.push('/profile/privmsg.php*mode=@(post|reply|forward)*');
    if (this.getPrefForId('format.profileComments', 'PostFormatting') === true) info.match.push('/profiles/*/*/*@(mode=addcomment)*');

    return info;
  }

  static defaultPrefs() {
    return {
      'format.forums': true,
      'format.guildForums': true,
      'format.pms': true,
      'format.profileComments': true,

      'format.list': [
          ['Blank', '', 0],
          ['Past Lives', "%5Bcolor=#003040%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DA%20SHIP%20IS%20SAFE%20IN%20HARBOR,%5B/color%5D%5B/size%5D%5B/b%5D%0A%5Bcolor=#276B91%5D%E2%96%8C%5B/color%5D%5Bb%5D%5Bsize=11%5D%5Bcolor=#777%5DBUT%20THAT'S%20NOT%20WHAT%20SHIPS%20ARE%20FOR.%5B/color%5D%5B/size%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0],
          ['Godfellas', "%5Bcolor=#F08080%5D%5Bsize=20%5D%E2%9D%9D%5B/size%5D%5B/color%5D%0A%5Bb%5D%5Bcolor=#8B8878%5D%5Bsize=10%5DWHEN%20YOU%20DO%20THINGS%20RIGHT,%0APEOPLE%20WON'T%20BE%20SURE%20YOU'VE%20DONE%20ANYTHING%20AT%20ALL.%5B/size%5D%5B/color%5D%5B/b%5D%0A%5Bcolor=#F08080%5D%5Bsize=20%5D%20%E2%9D%9E%5B/size%5D%5B/color%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0],
          ['Alice', "%E2%99%A6%20%5Bcolor=#222222%5D%5Bsize=11%5D%5Bi%5DWhat%20road%20do%20I%20take?%5B/i%5D%5B/size%5D%5B/color%5D%0A%E2%99%A3%20%5Bb%5D%5Bcolor=brown%5D%22Where%20do%20you%20want%20to%20go?%22%5B/color%5D%5B/b%5D%0A%E2%99%A5%20%5Bcolor=#222222%5D%5Bsize=11%5D%5Bi%5DI%20don't%20know.%5B/i%5D%5B/size%5D%5B/color%5D%0A%E2%99%A0%20%5Bb%5D%5Bcolor=brown%5D%22Then,%20it%20really%20doesn't%20matter,%20does%20it?%22%5B/color%5D%5B/b%5D%0A%0A%0A%0A%5Balign=right%5D%5Bb%5DWelcome%20to%20%5Burl=http://bettergaia.com/%5DBetterGaia%5B/url%5D.%5B/b%5D%0A%5Bi%5DNeed%20help?%20%5Burl=http://www.gaiaonline.com/forum/t.45053993/%5DSee%20our%20thread%5B/url%5D%20and%20visit%20%5Burl=http://bettergaia.com/%5DBetterGaia.com%5B/url%5D.%5B/i%5D%5B/align%5D", 0]
      ],
      'format.list.recent': 'default',
      'format.list.useRecent': true,

      'format.quote.removeFormatting': false,
      'format.quote.spoilerWrap': false,
      'format.quote.endOfFormat': false,
      'format.quote.rangeNumber': '2'
    };
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    // for adding new lines
    function repeat(s, n) {var a = []; while(a.length < n) {a.push(s);} return a.join('');}
    let that = this;

    // Run formatter
    $('textarea[name="message"]:not([identity]), textarea[name="comment"]:not([identity])').each(function() {
        // bbcode editor
        //$(this).wysibb();

        var identity = Date.now();
        var post = $(this);

        // Makes sure this code runs on fresh textboxes
        $(this).add("select[name=basic_type]:not([identity])").attr("identity", identity);

        // Adds formatting bar
        var formattingbar = '';

        // check if recent is set
        var defaultFormatSet = false;
        if (that.getPref('format.list.recent') != 'default' && that.getPref('format.list.useRecent') === true) {
            for (var i=0; i < that.getPref('format.list').length; i++) {
                if (that.getPref('format.list')[i][0] == that.getPref('format.list.recent')) {
                    defaultFormatSet = true;
                    break;
                }
            }
        }

        $.each(that.getPref('format.list'), function(index, format) {
            if ((index === 0 && !defaultFormatSet) ||
                (defaultFormatSet && (format[0] == prefs['format.list.recent']))) {
                formattingbar += '<a code="' + format[1] + '" poststyle="' + format[2] + '" class="current">' + format[0] + '</a>';

                // if quote
                if (post.val().substr(0,8) == '[quote="' && post.val().replace(/\n\s*/g,'').substr(-8) == '[/quote]') {
                    if (that.getPref('format.quote.removeFormatting') === true) post.val(post.val().replace(/\[\/?(?:b|i|u|strike|code|url|color|size|align|img|imgleft|imgright|imgmap|youtube|spoiler).*?\]/img, ''));

                    if (that.getPref('format.quote.spoilerWrap') === true) {
                        var newPost = post.val().slice(0,-8);
                        newPost += '[/spoiler][/quote]';
                        newPost = newPost.replace(/\[quote=(.+?)\]/, '[quote=$1][spoiler]');
                        post.val(newPost);
                    }

                    if (that.getPref('format.quote.endOfFormat') === true) post.val(decodeURI(format[1]) + '\n' + repeat('\n', parseInt(prefs['format.quote.rangeNumber'], 10)) + post.val());
                    else post.val(post.val() + '\n' + repeat('\n', parseInt(that.getPref('format.quote.rangeNumber'), 10)) + decodeURI(format[1]));
                }

                // If blank
                else if (post.val().length === 0) post.val(decodeURI(format[1]));

                // In the end
                $('select[name=basic_type][identity="' + identity + '"]').val(format[2]);
            }

            // Not first
            else formattingbar += '<a code="' + format[1] + '" poststyle="' + format[2] + '">' + format[0] + '</a>';
        });

        $(this).after('<div id="bg_formatter" identity="' + identity + '">' + formattingbar + '</div>');
    });

    // Set button functions
    $('#bg_formatter > a').on('click', function() {
        if (!$(this).hasClass('current')) {
            var format = decodeURI($(this).attr('code')),
            identity = $(this).parent().attr('identity'),
            post = $('textarea[identity="' + identity + '"]');

            if (encodeURI(post.val()) == $(this).siblings('a.current').attr('code')) post.val(format);
            else {
                // Textbox has quote
                if (encodeURI(post.val()).indexOf($(this).siblings('a.current').attr('code')) != -1) {
                    var content = encodeURI(post.val()).replace($(this).siblings('a.current').attr('code'), '');
                    content = content.replace('%0A' + repeat('%0A', parseInt(that.getPref('format.quote.rangeNumber'), 10)), '');
                    post.val(decodeURI(content));
                }

                if (that.getPref('format.quote.endOfFormat') === true) post.val(format + '\n' + repeat('\n', parseInt(prefs['format.quote.rangeNumber'], 10)) + post.val());
                else post.val(post.val() + '\n' + repeat('\n', parseInt(that.getPref('format.quote.rangeNumber'), 10)) + format);
            }

            $('select[name=basic_type][identity="' + identity + '"]').val($(this).attr('poststyle'));
            $(this).siblings('a.current').removeClass('current');
            $(this).addClass('current');

            // set as last used
            if ($(this).index() !== 0) {
                that.setPref('format.list.recent', $(this).text());
            }
            else {
                that.removePref('format.list.recent');
            }
        }

        return false;
    });
  }

  unMount() {
    this.removeCSS();
  }
}
