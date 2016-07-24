class PrivateMessages extends Extension {
  constructor() {
    super('PrivateMessages');
  }

  static info() {
    return {
      id: 'PrivateMessages',
      title: 'Private Messages',
      description: 'A more modern private messaging page.',
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: ['/profile/privmsg.php**']
    };
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    // Private message selectors
    $('body.mail #pm_content table tr[height="20"] td[align]').after(`<div class='bg_selecttypes'>
      <span>
        <a class='all'>All</a>
        <a class='read'>Read</a>
        <a class='unread'>Unread</a>
        <a class='replied'>Replied</a>
        <a class='none'>None</a>
      </span>
    </div>`);

    $('body.mail #pm_content table tr[bgcolor][height="42"] > td:nth-of-type(2) img').each(function(index, element) {
      $(this).closest('tr[bgcolor][height="42"]').attr('status', $(this).attr('title'));
    });

    $('body.mail #pm_content .bg_selecttypes a').on('click.PrivateMessages', function() {
      if ($(this).hasClass('all')) $('tr[bgcolor][height="42"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', true);
      if ($(this).hasClass('read')) $('tr[bgcolor][height="42"][status="Read Message"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', true);
      if ($(this).hasClass('unread')) $('tr[bgcolor][height="42"][status="Unread Message"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', true);
      if ($(this).hasClass('replied')) $('tr[bgcolor][height="42"][status="Replied Message"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', true);
      if ($(this).hasClass('none')) $('tr[bgcolor][height="42"]:not(.bgpm_hide) input[type="checkbox"]').prop('checked', false);
    });

    // Add Avatar Image
    var userids = [];
    $('tr[bgcolor][height="42"] span.name a[href]').each(function(index, element) {
      var userid = $(this).attr("href").split("/")[5];
      $(this).closest('tr[bgcolor][height="42"]').attr("userid", userid);

      if (userids.indexOf(userid) == -1) {
        userids.push(userid);
        $.get("/profiles?mode=lookup&avatar_username=" + $(this).closest('tr[bgcolor][height="42"]').find('span.name').text(), function(data) {
          var avatar = 'http://www.gaiaonline.com/dress-up/avatar/' + $(data).find('response').attr('avatarPath');
          var img = new Image();
          img.src = avatar;
          img.onload = function() {
            $('tr[bgcolor][height="42"][userid="'+userid+'"] span.topictitle a').css({'background-image': `url(${avatar})`, 'background-position': 'right -35px'});
          };
        });
      }
    });

    // Instant Search
    $('body.mail #pm_content table tr[height="20"]').append('<input type="text" class="bgpm_search" placeholder="Search this page" value="" />');
    $.extend($.expr[":"], {"Contains": function(elem, i, match, array) {return (elem.textContent || elem.innerText || "").toLowerCase().indexOf((match[3] || "").toLowerCase()) >= 0;}});
    $('body.mail #pm_content table tr[height="20"] .bgpm_search').keyup(function() {
      var value = $(this).val();
      if (value.length > 0) {
        $('body.mail #pm_content table tr[bgcolor][height="42"]:not(:Contains("' + value + '"))').addClass('bgpm_hide').find('input[type="checkbox"]').prop('checked', false);
        $('body.mail #pm_content table tr[bgcolor][height="42"]:Contains("' + value + '")').removeClass('bgpm_hide');
      }
      else $('body.mail #pm_content table tr[bgcolor][height="42"]').removeClass('bgpm_hide');
    });
  }

  unMount() {
    this.removeCSS();
    $('body.mail #pm_content .bg_selecttypes a').off('click.PrivateMessages');
    $('.bg_selecttypes').remove();
  }
}
