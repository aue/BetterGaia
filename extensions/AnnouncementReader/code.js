class AnnouncementReader extends Extension {
  constructor() {
    super('AnnouncementReader');
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    if ($('#notifyItemList .notify_icon_announcement').length == 1) {
      // Get number of remaining announcements
      var remaining = parseInt($('#notifyItemList .notify_icon_announcement').text().replace(/\D/g, ''), 10);
      if (remaining > 10) remaining = 10;

      // Open model
      $('#notifyItemList .notify_icon_announcement').on('click', function() {
          if ($('#bg_anreader').length < 1) {
              $('body').append('<div id="bg_anreader" class="bg_model">\
                  <h1>Announcement Reader <a class="close" title="Close"></a></h1>\
                  <div class="bg_container">\
                      <ul></ul>\
                      <div class="content">\
                          <span class="bg_spinner"></span>\
                      </div>\
                  </div>\
              </div>\
              <div class="bg_mask"></div>');

              var liTemplate = Handlebars.compile('<li class="new" data-announcement="{{i}}">\
                  <span class="username">{{username}}</span>\
                  <span class="title">{{title}}</span>\
              </li>');

              var threadTemplate = Handlebars.compile('<div class="page" data-announcement="{{i}}">\
                  <div class="header">\
                      <div class="avatar">{{{avatar}}}</div>\
                      <a href="{{link}}" target="_blank">{{username}}</a>\
                      <span>{{date}}</span>\
                      <h1><a href="{{link}}" target="_blank">{{title}}</a></h1>\
                  </div>\
                  <div class="message">{{{content}}}</div>\
              </div>');

              $('#bg_anreader h1 .close').on('click', function() {
                  $('#bg_anreader').removeClass('open');
                  $('html').removeClass('bg_noscroll');
              });

              var apply = function() {
                  $.ajax({
                      url: '/news/',
                      cache: false,
                      dataType: 'html',
                      headers: {'X-PJAX': true}
                  })
                  .done(function(html) {
                      if ($('#thread_header #thread_title', html).length == 1) {
                          var thread = {
                              i: remaining,
                              title: $('#thread_title a', html).text(),
                              link: $('#thread_title a', html).attr('href'),
                              username: $('#post-1 .user_info .user_name', html).text(),
                              date: $('#post-1 .post-meta .timestamp', html).text(),
                              content: $('#post-1 .post-bubble .speech_bubble > .content', html).html(),
                              avatar: $('#post-1 .avi_box .avatar', html).html()
                          };

                          $('#bg_anreader .bg_container > ul').prepend(liTemplate(thread));
                          $('#bg_anreader .content').prepend(threadTemplate(thread));
                      }
                      else {
                          remaining = 0;
                      }

                      // Keep loading
                      if (remaining > 0) {
                          remaining--;
                          apply();
                      }
                      // No more, end
                      else {
                          $('#bg_anreader').addClass('loaded');
                          $('#bg_anreader .content .page .message a').attr('target', '_blank');

                          $('#bg_anreader .bg_container > ul').on('click', 'li', function() {
                              $('#bg_anreader .bg_container > ul li.active, #bg_anreader .content .page.active').removeClass('active');
                              $(this).removeClass('new').addClass('active');
                              $('#bg_anreader .content .page[data-announcement="' + $(this).attr('data-announcement') + '"]').addClass('active');
                          });

                          $('#bg_anreader .bg_container > ul li:first-child').click();
                      }
                  });
              };

              apply();
          }

          $('#bg_anreader').addClass('open');
          $('html').addClass('bg_noscroll');
          return false;
      });
    }
  }

  unMount() {
    this.removeCSS();
    $('#bg_anreader, #bg_anreader + .bg_mask, .bg_drawall').remove();
  }
}
