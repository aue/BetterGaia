class UserTags extends Extension {
  constructor() {
    super('UserTags');
  }

  static info() {
    return {
      id: 'UserTags',
      title: 'User Tags',
      description: 'Keep tabs on users with short notes on their posts.',
      extendedDescription: `Manage tags shown next to users' names in posts.`,
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: ['/forum/**', '/news/**']
    };
  }

  static defaultPrefs() {
    return {
      'tags': {
          //'12345': ['cat', 'He is a cat.', 'http://google.com', 2014]
      }
    };
  }

  static settings() {
    return [
      {type: 'list', pref: 'tags'}
    ];
  }

  render() {
    // Get userid and add tag links
    $('body.forums .post .user_info_wrapper .user_info .user_name').each(function() {
        if ($(this).siblings('.bgUserTag').length === 0) {
            var userid = '', avibox = $(this).closest('.postcontent').find('.avatar_wrapper .avi_box');
            if (avibox.find('a.avatar').length === 0) userid = avibox.find('#animated_item > object').attr('onmousedown').replace("window.location='", '').split("/")[5];
            else userid = avibox.find('a.avatar').attr('href').split('/')[5];
            $(this).after('<div class="bgUserTag"><a target="_blank" title="Tag" userid="' + userid + '"></a><span title="Tag this User"></span></div>');
        }
    });

    // Add stored tags
    var tags = this.getPref('tags');

    if (!$.isEmptyObject(tags)) {
        $.each(tags, function(key, tag){
            if ($('.bgUserTag a[userid="' + key + '"]')) {
                var url = tag[2];
                if (url.match(/\S/) && url.length > 1) $('.bgUserTag a[userid="' + key + '"]').attr({href: url}).text(tag[1]);
                else $('.bgUserTag a[userid="' + key + '"]').text(tag[1]);
            }
        });
    }

    $('.post .user_info_wrapper .user_info .bgUserTag > span').on('click.UserTags', function(){
        if (!$(this).parent().hasClass('bgut_loaded')) {
            var tagvalue = '', urlvalue = $(this).closest('.postcontent').find('.post-directlink a').attr('href');

            if ($(this).siblings('a').text().length > 0) {
                tagvalue = $(this).siblings('a').text();
                if ($(this).siblings('a').attr('href')) urlvalue = $(this).siblings('a').attr('href');
            }

            $(this).after(`<div class="bgut_model">
              <h2>Tag ${$(this).closest('.user_info').find('.user_name').text()}
                <a class="bgclose"></a>
              </h2>
              <form>
                <label for="bgut_tagtag">Tag</label>
                <input type="text" id="bgut_tagtag" maxlength="50" placeholder="Notes and comments" value="${tagvalue}">
                <label for="bgut_idtag">User ID</label>
                <input type="text" id="bgut_idtag" placeholder="Numerical" value="${$(this).siblings('a').attr('userid')}">
                <label for="bgut_linktag">Link</label>
                <input type="text" id="bgut_linktag" placeholder="URL" value="${urlvalue}">
                <div class="bgut_buttons">
                  <a class="bgut_delete">Delete</a>
                  <a class="bgut_save">Save</a>
                </div>
            </form></div>`);

            $(this).parent().addClass('bgut_loaded bgut_open');
        }
        else $(this).parent().toggleClass('bgut_open');

        $(this).parent().find('#bgut_tagtag').focus();
    });

    $('.bgUserTag').on('click.UserTags', 'a.bgclose', function() {
        $(this).closest('.bgUserTag').removeClass('bgut_open');
    });

    let that = this;
    $('.bgUserTag').on('click.UserTags', '.bgut_save', function() {
      var letsSave = false,
      username = $(this).closest('.user_info').find('.user_name').text(),
      tag = $(this).parent().siblings('#bgut_tagtag'),
      userid = $(this).parent().siblings('#bgut_idtag'),
      url = $(this).parent().siblings('#bgut_linktag');

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
        let tags = that.getPref('tags');
        tags[userid.val()] = [username, tag.val(), url.val(), Date.now()];
        that.setPref('tags', tags);

        $('.bgUserTag a[userid="' + userid.val() + '"]').attr({href: url.val()}).text(tag.val());
        tag.closest('.bgUserTag').removeClass('bgut_loaded bgut_open');
        tag.closest('.bgut_model').remove();
      }
    });

    $('.bgUserTag').on('click.UserTags', '.bgut_delete', function() {
      let userid = $(this).parent().siblings('#bgut_idtag'),
          tags = that.getPref('tags');

      if (tags.hasOwnProperty(userid.val())) {
        delete tags[userid.val()];
        that.setPref('tags', tags);
        $('.bgUserTag a[userid="' + userid.val() + '"]').removeAttr('href').text('');
      }

      $(this).closest('.bgUserTag').removeClass('bgut_loaded bgut_open');
      $(this).closest('.bgut_model').remove();
    });
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    if (document.querySelector('#topic_header_container #thread_header')) {
      this.render();

      // For ajax thread calls
      this.observer = new window.MutationObserver(() => {
        this.render();
      });
      this.observer.observe(document.getElementById('content-padding'), {
        attributes: false,
        childList: true,
        characterData: false
      });
    }
  }

  unMount() {
    this.removeCSS();
    $('body.forums .post .user_info_wrapper .user_info .bgUserTag > span, body.forums .post .user_info_wrapper .user_info').off('click.UserTags');
    this.observer.disconnect();
    $('.bgUserTag').remove();
  }
}
