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
    // Get userid and add tag links
    $('body.forums .post .user_info_wrapper .user_info .user_name').each(function() {
        if ($(this).siblings('.bgUserTag').length === 0) {
            var userid = '', avibox = $(this).closest('.postcontent').find('.avatar_wrapper .avi_box');
            if (avibox.find('a.avatar').length === 0) userid = avibox.find('#animated_item > object').attr('onmousedown').replace("window.location='", '').split("/")[5];
            else userid = avibox.find('a.avatar').attr('href').split('/')[5];
            $(this).after('<div class="bgUserTag"><a target="_blank" title="Tag" userid="' + userid + '"></a><span></span></div>');
        }
    });

    // Add stored tags
    var tags = this.getPref['usertags.list'];

    // Idenitfy me, special [color=#FEFEF0][size=1].[/size][/color]
    $('.bgUserTag a[userid="8152358"]').each(function() {
        if ($(this).closest('.postcontent').find('.message .post-bubble span[style="color: #FEFEF0"] span[style="font-size: 1px"]').length != 1)
            $(this).attr({href: '/forum/t.96293729/'}).text('BetterGaia Creator');
    });

    if (!$.isEmptyObject(tags)) {
        $.each(tags, function(key, tag){
            if ($('.bgUserTag a[userid="' + key + '"]')) {
                var url = tag[2];
                if (url.match(/\S/) && url.length > 1) $('.bgUserTag a[userid="' + key + '"]').attr({href: url}).text(tag[1]);
                else $('.bgUserTag a[userid="' + key + '"]').text(tag[1]);
            }
        });
    }

    $('body.forums .post .user_info_wrapper .user_info .bgUserTag > span').on('click', function(){
        if (!$(this).closest('.post').hasClass('bgut_loaded')) {
            var tagvalue = '', urlvalue = $(this).closest('.postcontent').find('.post-directlink a').attr('href');

            if ($(this).siblings('a').text().length > 0) {
                tagvalue = $(this).siblings('a').text();
                if ($(this).siblings('a').attr('href')) urlvalue = $(this).siblings('a').attr('href');
            }

            $(this).after('<div><h2>Tag ' +    $(this).closest('.user_info').find('.user_name').text() + '<a class="bgclose"></a></h2><form>\
                <label for="bgut_tagtag">Tag</label>\
                <input type="text" id="bgut_tagtag" maxlength="50" placeholder="Notes and comments" value="' + tagvalue + '">\
                <label for="bgut_idtag">User ID</label>\
                <input type="text" id="bgut_idtag" placeholder="Numerical" value="' + $(this).siblings('a').attr('userid') + '">\
                <label for="bgut_linktag">Link</label>\
                <input type="text" id="bgut_linktag" placeholder="URL" value="' + urlvalue + '">\
                <p>You can manage your tags in your BetterGaia Settings.</p>\
                <a class="bgut_save">Save</a>\
            </form></div>');

            $(this).closest('.post').addClass('bgut_loaded bgut_open');
        }
        else $(this).closest('.post').toggleClass('bgut_open');

        $(this).parent().find('#bgut_tagtag').focus();
    });

    $('body.forums .post .user_info_wrapper .user_info').on('click', '.bgUserTag a.bgclose', function(){
        $(this).closest('.post').removeClass('bgut_open');
    });

    $('body.forums .post .user_info_wrapper .user_info').on('click', '.bgUserTag a.bgut_save', function(){
        var letsSave = false,
        username = $(this).closest('.user_info').find('.user_name').text(),
        tag = $(this).siblings('#bgut_tagtag'),
        userid = $(this).siblings('#bgut_idtag'),
        url = $(this).siblings('#bgut_linktag');

        // Tags
        if (!tag.val().match(/\S/) || tag.val().length < 1) tag.prev('label').addClass('bgerror');
        else $(this).siblings('label[for="bgut_tagtag"].bgerror').removeClass('bgerror');

        // User ID
        if (userid.val().length < 1 || !userid.val().match(/\S/) || !$.isNumeric(userid.val())) userid.prev('label').addClass('bgerror');
        else $(this).siblings('label[for="bgut_idtag"].bgerror').removeClass('bgerror');

        // Check
        if ($(this).siblings('.bgerror').length === 0) letsSave = true;

        // Save
        if (letsSave) {
            prefs['usertags.list'][userid.val()] = [username, tag.val(), url.val(), Date.now()];

            // Save
            BGjs.set('usertags.list', prefs['usertags.list']);
            $('body.forums .post .user_info_wrapper .user_info .bgUserTag a[userid="' + userid.val() + '"]').attr({href: url.val()}).text(tag.val());
            tag.closest('.post').removeClass('bgut_loaded bgut_open');
            tag.closest('div').remove();
        }
    });
  }

  unMount() {
    this.removeCSS();
  }
}
