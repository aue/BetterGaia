class ExternalLinkRedirect extends Extension {
  constructor() {
    super('ExternalLinkRedirect');
  }

  static info() {
    return {
      id: 'ExternalLinkRedirect',
      title: 'External Link Redirect',
      description: 'External link redirects, now with warnings on the same page.',
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: ['/forum/**', '/news/**', '/guilds/**']
    };
  }

  static defaultPrefs() {
    return {};
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    $("body.forums .post a[href^='http://www.gaiaonline.com/gaia/redirect.php?r=']").on('click.ExternalLinkRedirect', function(e){
      if ($(this).prop("href").match(/gaiaonline/g).length > 1 || e.ctrlKey || e.which == 2) {
        return true;
      }
      else {
        $("body").append($("<div class='bgredirect'></div>"));
        var thisurl = $(this).prop("href");
        if ($(this).children('img').attr('ismap')) {
          thisurl += "?" + e.offsetX + "," + e.offsetY;
        }

        $.ajax({
          type: 'GET',
          url: thisurl,
          dataType: 'html'
        }).done(function(data) {
          var pageHtml = $('<div>').html(data);

          if (pageHtml.find('.warn_block').length === 1) {
            $('.bgredirect').html(pageHtml.find('.warn_block')[0].outerHTML);
            $('.bgredirect table.warn_block #warn_block #warn_head').append('<a class="bgclose" title="close"></a>');
            $('.bgredirect a').attr('target', '_blank');
            $('.bgredirect a.link_display, .bgredirect a.bgclose').on('click', function(){
              $('.bgredirect').remove();
            });
          }
          else {
            $('.bgredirect').remove();
            window.open(thisurl);
          }
        }).fail(function() {
          $('.bgredirect').remove();
          window.open(thisurl);
        });

        return false;
      }
    });
  }

  unMount() {
    this.removeCSS();
    $("body.forums .post a[href^='http://www.gaiaonline.com/gaia/redirect.php?r=']").off('click.ExternalLinkRedirect');
    $('.bgredirect').remove();
  }
}
