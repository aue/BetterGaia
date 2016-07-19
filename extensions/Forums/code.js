class Forums extends Extension {
  constructor() {
    super('Forums');
    this.match = ['/', '/mygaia/', '/market/', '/forum/', '/world/', '/games/', '/payments/', '/gofusion/'];
  }

  static info() {
    return {
      id: 'Forums',
      title: 'Forums',
      author: 'The BetterGaia Team',
      description: 'A more modern forums.',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0'
    };
  }

  static defaultPrefs() {
    return {
      'forum.externalLinks': true,
      'forum.previewThreads': true,
      'forum.constrain': true,
      'forum.post.optionsBottom': true,
      'forum.post.bgContainer': false,
      'forum.pollHide': false,
      'forum.postOffWhite': false,
      'forum.reduceTransparency': false,

      'forum.threadHeader': '#BF7F40',
      'forum.postHeader': '#CFE6F9'
    };
  }

  preMount() {
    this.addStyleSheet('style');

    // Full page forum width
    if (this.getPref('forum.constrain') === false)
    this.addCSS('body.forum div#content, body.forums #content #content-padding, body.app-page_forum div#content, body.forums #gaia_content.ss_2Columns_flexiLeft_wideRight > #yui-main {width: calc(100% - 25px);}');

    // Thread Header Color
    if (this.getPref('forum.threadHeader') !== '#BF7F40')
    this.addCSS('body.forums #gaia_content:not(.grid_billie_holiday) #forum-header .linklist, body.forums #content #content-padding > .linklist, body.forums #gaia_content .forum-list + #forum_ft_content:before {background-color: ' + this.getPref('forum.threadHeader') + ';}');

    // Poll Drop Down
    if (this.getPref('forum.pollHide') === true)
    this.addCSS('body.forums #content #content-padding > #topic_header_container #thread_poll {height: 40px; overflow: hidden;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover {height: auto; overflow: visible;} body.forums #content #content-padding > #topic_header_container #thread_poll:after {content: "\\25BC"; color: rgba(0,0,0,0.35); display: block; position: absolute; top: 9px; right: 8px; font-size: 17px; text-shadow: 0 1px 1px #FFF;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover:after {color: rgba(0,0,0,0.7); content: "\\25B2";}');

    // Post Theme
    if (this.getPref('forum.postHeader') !== '#CFE6F9')
    this.addCSS('body.forums #content #post_container .post .postcontent .user_info_wrapper {background-color: ' + this.getPref('forum.postHeader') + ';}');

    // Add background to posts
    if (this.getPref('forum.post.bgContainer') === true)
    this.addCSS('body.forums #content #post_container .post > .postcontent {border-radius: 5px 0 0 0; background-image: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.9)); background-size: 130px 130px; background-repeat: repeat-y;} body.forums #content #post_container .post.bgpc_hidden > .postcontent {border-radius: 5px;} body.forums #content #post_container .post .postcontent .user_info_wrapper .user_info .user_name {border-radius: 0;}');

    // Make posts off white
    if (this.getPref('forum.postOffWhite') === true)
    this.addCSS('body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble {background-color: rgba(255,255,255,0.9);} body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble div.content, body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble .avi-speech:not(.document) .avi-speech-bd {background-color: transparent;}');

    // Make forums all white
    if (this.getPref('forum.reduceTransparency') === true)
    this.addCSS('body.forums #content #content-padding > #topic_header_container #thread_header, body.forums #content #content-padding > #topic_header_container #thread_poll, body.forums #content #content-padding > #topic_header_container .detail-navlinks, body.forums #content #post_container .post .postcontent .message .messagecontent .post-options, body.forums #content #post_container .post .postcontent .post-signature, body.forums #content #content-padding > #navlinks_pag {background-color: #FFF;}');

    // Put post options on top
    if (this.getPref('forum.post.optionsBottom') === false)
    this.addCSS('body.forums #content #post_container .post .postcontent .message .messagecontent {flex-direction: column-reverse;}');
  }

  mount() {
    // Add thread preview
    if (this.getPref('forum.previewThreads') === true) {
      $("body.forums #gaia_content table.forum-list tr td.title .one-line-title .topic-icon").after('<a class="bgThreadPreview" title="View the first post of this thread">[+]</a>');
      $("body.forums #gaia_content table.forum-list tr td.title .one-line-title a.bgThreadPreview").on("click", function() {
        if ($(this).closest('tr.rowon, tr.rowoff').next('tr.bgThreadPreviewBox').length === 0) {
          $(this).closest('tr.rowon, tr.rowoff').after('<tr class="bgThreadPreviewBox loading"><td colspan="6"><div>Test</div></td></tr>');
          var box = $(this).closest('tr.rowon, tr.rowoff').next('tr.bgThreadPreviewBox');
          $.ajax({
            type: 'GET',
            url: $(this).siblings('a[href]:not(.goto-new-posts)').attr('href'),
            headers: {'X-PJAX': true},
            success: function(data) {
              data = $("<div>").html(data);
              var avi = data.find("#post-1 .avi_box").html();
              var bubble = data.find("#post-1 .post-bubble").html();
              box.removeClass("loading").find('td > div').html("<div class='bgavi'>" + avi + "</div><div class='bgbubble'>" + bubble + "</div>");
            },
            error: function(error) {
              box.html("There was a problem retrieving the post.").removeClass('loading');
            }
          });
        }
        else $(this).closest('tr.rowon, tr.rowoff').next('tr.bgThreadPreviewBox').find('td > div').slideToggle('slow');
      });
    }

    // Adds Instants
    $('body.forums .post .message .messagecontent .post-options ul').each(function () {
        if ($(this).find('a.post-quote').length > 0 || $(this).find('a.post-edit').length > 0)
          $(this).prepend('<div class="bg_instant"><li><a class="bg_instanttext"><span>Instant</span></a></li></div>');

        if ($(this).find('a.post-quote').length > 0) {
            $(this).find('.bg_instant').append('<li><a class="bg_instantquote"><span>Quote</span></a></li>');
        }
        if ($(this).find('a.post-edit').length > 0) {
            $(this).find('.bg_instant').append('<li><a class="bg_instantedit"><span>Edit</span></a></li>');
        }
    });

    $("body.forums .post .message .messagecontent .post-options ul a.bg_instantquote").click(function() {
        var bubbleThis = $(this).closest('.messagecontent');

        if (bubbleThis.find(".bg_instantbox.quote").length === 0) {
            bubbleThis.find(".post-bubble").after("<div class='bg_instantbox quote loading'></div>");

            //get url
            var url = bubbleThis.find(".post-options a.post-quote").attr("href");
            $.get(url).done(function(data) {
                var pageHtml = $('<div>').html(data);
                pageHtml.find('script').remove();

                bubbleThis.find(".bg_instantbox.quote").removeClass("loading").html(pageHtml.find("form#compose_entry")[0].outerHTML);
                BGjs.format();
            });
        }
        else {
            $(this).closest('.messagecontent').find(".bg_instantbox.quote").slideToggle('slow');
        }
    });

    $("body.forums .post .message .messagecontent .post-options ul a.bg_instantedit").click( function() {
        var bubbleThis = $(this).closest('.messagecontent');

        if (bubbleThis.find(".bg_instantbox.edit").length === 0) {
            bubbleThis.find(".post-bubble").after("<div class='bg_instantbox edit loading'></div>");

            //get url
            var url = bubbleThis.find(".post-options a.post-edit").attr("href");
            $.get(url).done(function(data) {
                var pageHtml = $('<div>').html(data);
                pageHtml.find('script').remove();

                bubbleThis.find(".bg_instantbox.edit").removeClass("loading").html(pageHtml.find("form#compose_entry")[0].outerHTML);
            });
        }
        else {
            $(this).closest('.messagecontent').find('.bg_instantbox.edit').slideToggle('slow');
        }
    });

    // Moves timestamp
    $('body.forums .post .message .messagecontent > .post-options > ul > li.post-meta').each(function () {
        $(this).appendTo($(this).closest('.postcontent').find('.user_info_wrapper .user_info'));
    });
  }

  unMount() {
    this.removeCSS();
  }
}
