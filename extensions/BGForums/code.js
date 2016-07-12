class BGForums extends Extension {
  constructor() {
    super('BGForums');
    this.match = ['/', '/mygaia/', '/market/', '/forum/', '/world/', '/games/', '/payments/', '/gofusion/'];
  }

  static info() {
    return {
      id: 'BGForums',
      title: 'BetterGaia Forums',
      author: 'The BetterGaia Team',
      description: 'The forums core code of BetterGaia.',
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
    // Add thread preview
    //if (prefs['forum.previewThreads'] === true) {
        $("body.forums #gaia_content table.forum-list tr td.title .one-line-title .topic-icon").after('<a class="bgThreadPreview" title="View the first post of this thread">[+]</a>');
        $("body.forums #gaia_content table.forum-list tr td.title .one-line-title a.bgThreadPreview").on("click", function(){
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
                    error: function(error) {box.html("There was a problem retrieving the post.").removeClass('loading');}
                });
            }
            else $(this).closest('tr.rowon, tr.rowoff').next('tr.bgThreadPreviewBox').find('td > div').slideToggle('slow');
        });
    //}

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
