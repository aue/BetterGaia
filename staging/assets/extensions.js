class Extension {
  constructor(id) {
    this.id = id;
    this.match = [];
    this.exactMatch = [];
    this.exclude = [];
    this.mounted = false;
  }

  static info() {
    return {};
  }
  static defaultPrefs() {
    return {};
  }
  static settings() {
    return {};
  }
  static getPrefForId(key, id) {
    return BetterGaia.pref.get(key, id);
  }
  static getDefaultPrefForId(key, id) {
    return BetterGaia.pref.getDefault(key, id);
  }
  static setPrefForId(key, value, id) {
    BetterGaia.pref.set(key, value, id);
  }

  getPref(key) {
    return BetterGaia.pref.get(key, this.id);
  }
  setPref(key, value) {
    BetterGaia.pref.set(key, value, this.id);
  }
  removePref(key) {
    BetterGaia.pref.remove(key, this.id);
  }

  addCSS(css) {
    let styleTag = document.querySelector(`style[bg-css="${this.id}"]`);

    if (styleTag === null) {
      styleTag = document.createElement('style');
      styleTag.setAttribute('type', 'text/css');
      styleTag.setAttribute('bg-css', this.id);
      styleTag.appendChild(document.createTextNode(css));
      document.documentElement.appendChild(styleTag);
    }
    else {
      styleTag.appendChild(document.createTextNode(css));
    }
  }

  addStyleSheet(filename) {
    let linkTag = document.createElement('link');
    linkTag.setAttribute('rel', 'stylesheet');
    linkTag.setAttribute('type', 'text/css');
    linkTag.setAttribute('bg-css', this.id);
    linkTag.setAttribute('href', `${BetterGaia.path}extensions/${this.id}/${filename}.css`);
    document.documentElement.appendChild(linkTag);
  }

  removeCSS() {
    let tags = document.querySelectorAll(`style[bg-css="${this.id}"], link[bg-css="${this.id}"]`);
    for (let i = 0, len = tags.length; i < len; i++) {
      tags[i].parentNode.removeChild(tags[i]);
    }
  }

  preMount() {}
  mount() {}
  unMount() {}
}

class AnnouncementReader extends Extension {
  constructor() {
    super('AnnouncementReader');
  }

  static info() {
    return {
      id: 'AnnouncementReader',
      title: 'Announcement Reader',
      description: 'Stop reading announcments one by one. ',
      extendedDescription: 'Built with speed in mind, with one touch Announcement Reader opens all of your announcments just for you.',
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
    if ($('#notifyItemList .notify_icon_announcement').length == 1) {
      // Get number of remaining announcements
      var remaining = parseInt($('#notifyItemList .notify_icon_announcement').text().replace(/\D/g, ''), 10);
      if (remaining > 10) remaining = 10;

      // Open model
      $('#notifyItemList .notify_icon_announcement').on('click.AnnouncementReader', function() {
          if ($('#bg_anreader').length < 1) {
              $('body').append(`<div id="bg_anreader" class="bg_model flex">
                <div class="bg_model_container">
                  <div class="bg_model_header">
                    <h1>Announcement Reader</h1>
                    <a class="close" title="Close"></a>
                  </div>
                  <div class="bg_model_content">
                    <ul></ul>
                    <div class="content">
                      <span class="bg_spinner"></span>
                    </div>
                  </div>
                </div>
              </div>`);

              let liTemplate = Handlebars.compile('<li class="new" data-announcement="{{i}}">\
                  <span class="username">{{username}}</span>\
                  <span class="title">{{title}}</span>\
              </li>');

              let threadTemplate = Handlebars.compile('<div class="page" data-announcement="{{i}}">\
                  <div class="header">\
                      <div class="avatar">{{{avatar}}}</div>\
                      <a href="{{link}}" target="_blank">{{username}}</a>\
                      <span>{{date}}</span>\
                      <h1><a href="{{link}}" target="_blank">{{title}}</a></h1>\
                  </div>\
                  <div class="message">{{{content}}}</div>\
              </div>');

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

                          $('#bg_anreader .bg_model_content > ul').prepend(liTemplate(thread));
                          $('#bg_anreader .bg_model_content .content').prepend(threadTemplate(thread));
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
                          $('#bg_anreader .bg_model_content .content .page .message a').attr('target', '_blank');

                          $('#bg_anreader .bg_model_content > ul').on('click.AnnouncementReader', 'li', function() {
                              $('#bg_anreader .bg_model_content > ul li.active, #bg_anreader .bg_model_content .content .page.active').removeClass('active');
                              $(this).removeClass('new').addClass('active');
                              $('#bg_anreader .bg_model_content .content .page[data-announcement="' + $(this).attr('data-announcement') + '"]').addClass('active');
                          });

                          $('#bg_anreader .bg_model_content > ul li:first-child').click();
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
    $('#notifyItemList .notify_icon_announcement').off('click.AnnouncementReader');
    $('#bg_anreader .bg_model_content > ul').off('click.AnnouncementReader', 'li');
    $('#bg_anreader').remove();
  }
}

class BGCore extends Extension {
  constructor() {
    super('BGCore');
  }

  static info() {
    return {
      id: 'BGCore',
      title: 'BetterGaia Core',
      author: 'The BetterGaia Team',
      description: 'The core code of BetterGaia.',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0'
    };
  }

  generateSettings() {
    $('body').append(`<div id="bg_settings" class="bg_model">
      <div class="bg_model_container">
        <div class="bg_model_header">
          <h1>BetterGaia Settings</h1>
          <a class="close" title="Close"></a>
        </div>

        <div class="bg_model_content">
          <div class="bgs_menu">
            <ul>
              <li class="bgs_active"><a data-link="myextensions"><i class="bgs_menu_myextensions"></i> My<br> BetterGaia</a></li>
              <li><a data-link="extensions"><i class="bgs_menu_extensions"></i> Extensions</a></li>
              <li><a data-link="about"><i class="bgs_menu_about"></i> About</a></li>
            </ul>
          </div>
          <div class="bgs_pages">
            <div class="bgs_page myextensions bgs_active">
              <ul class="list"></ul>
              <div class="details"></div>
            </div>

            <div class="bgs_page extensions uninitialized"></div>

            <div class="bgs_page about">
              <img src="${BetterGaia.path}assets/logo.png" class="logo">
              <div class="credits">
                  <h1>BetterGaia</h1>
                  <p>Version <strong class="version">${BetterGaia.version}</strong>.</p>
                  <p>Powered by the extension framework for a better Gaia.</p>
                  <p>The only extension that redesigns Gaia. Thank you Gaia Online, our contributors, our beta testers, and of course the regulars.</p>
                  <p>&copy; <a href="http://www.bettergaia.com/" target="_blank">The BetterGaia Team</a>.</p>
                  <br>
                  <br>
                  <a class="button" target="_blank" href="http://www.bettergaia.com/">BetterGaia.com</a>
                  <a class="button" target="_blank" href="http://www.bettergaia.com/donate/">Contribute</a>
                  <a class="button reset">Reset</a>
                  <a class="button" target="_blank" href="http://www.gaiaonline.com/forum/t.96293729/">Support</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`);

    // credit to https://gist.github.com/akhoury/9118682
    Handlebars.registerHelper("x", function (expression, options) {
      var fn = function(){}, result;
      try {
        fn = Function.apply(this, ["window", "return " + expression + " ;"]);
      } catch (e) {
        console.warn("{{x " + expression + "}} has invalid javascript", e);
      }

      try {
        result = fn.call(this, window);
      } catch (e) {
        console.warn("{{x " + expression + "}} hit a runtime error", e);
      }
      return result;
    });

    Handlebars.registerHelper('xif', function (expression, options) {
      return Handlebars.helpers['x'].apply(this, [expression, options]) ? options.fn(this) : options.inverse(this);
    });

    Handlebars.registerHelper('if_eq', function (a, b, opts) {
        if (a == b) return opts.fn(this);
        else return opts.inverse(this);
    });

    const activeExtensionsListTemplate = Handlebars.compile(`<li data-id="{{info.id}}">
      <h1>{{info.title}}</h1>
      <p>{{info.description}}</p>
    </li>`);

    const activeExtensionsDetailTemplate = Handlebars.compile(`<div data-id="{{info.id}}" class="detail">
      <h1>{{info.title}} <small>{{info.version}}</small></h1>
      <div class="card about">
        <p>By
          {{#if info.homepage}}
          <a href="{{{info.homepage}}}" target="_blank">{{info.author}}</a>.
          {{else}}
          <a>{{info.author}}</a>.
          {{/if}}
        </p>
        <p>{{info.description}}</p>
        {{#if info.extendedDescription}}
        <p>{{info.extendedDescription}}</p>
        {{/if}}
        {{#xif "this.info.id != 'BGCore'"}}
        <a class="button disable" data-id="{{info.id}}">Disable</a>
        {{/xif}}
      </div>

      <h2>Settings</h2>
      <div class="settings">
      {{#each settings}}
        {{#if_eq type "title"}}
        <h3>{{value}}</h3>
        {{/if_eq}}

        {{#if_eq type "checkbox"}}
        <div class="option checkbox">
          <label for="{{@root.info.id}}.{{pref}}">
            <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" data-extensionid="{{@root.info.id}}" type="checkbox"> {{description}}
          </label>
        </div>
        {{/if_eq}}

        {{#if_eq type "selection"}}
        <div class="option selection">
          <label for="{{@root.info.id}}.{{pref}}">{{description}}</label>
          <select id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" data-extensionid="{{@root.info.id}}">
            {{#each values}}
            <option value="{{value}}">{{name}}</option>
            {{/each}}
          </select>
        </div>
        {{/if_eq}}

        {{#if_eq type "hue"}}
        <div class="option hue">
          <label for="{{@root.info.id}}.{{pref}}">{{description}}</label>
          <input data-reset-pref="{{pref}}" data-extensionid="{{@root.info.id}}" type="button" value="Set to default">
          <div>
            <span class="hg"></span>
            <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" data-extensionid="{{@root.info.id}}" type="range" min="0" max="360">
          </div>
        </div>
        {{/if_eq}}

        {{#if_eq type "color"}}
        <div class="option color">
          <label for="{{@root.info.id}}.{{pref}}">{{description}}</label>
          <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" data-extensionid="{{@root.info.id}}" type="color">
        </div>
        {{/if_eq}}

        {{#if_eq type "textbox"}}
        <div class="option textbox{{#if hidden}} hidden{{/if}}">
          <label for="{{@root.info.id}}.{{pref}}">{{description}}</label>
          <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" data-extensionid="{{@root.info.id}}" type="text" placeholder="{{description}}">
        </div>
        {{/if_eq}}

        {{#if_eq type "list"}}
        <div class="option list">
          <label for="{{@root.info.id}}.{{pref}}"{{#if hidden}} hidden{{/if}}>{{pref}}</label>
          <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" data-extensionid="{{@root.info.id}}" type="text" placeholder="{{pref}}"{{#if hidden}} hidden{{/if}}>
        </div>
        {{/if_eq}}

      {{else}}
        <p><em>{{info.title}}</em> does not have any customizable settings.</p>
      {{/each}}
      </div>
    </div>`);

    const availableExtensionsTemplate = Handlebars.compile(`<div class="card" data-id="{{info.id}}">
      <h1>{{info.title}} <small>{{info.version}}</small></h1>
      <p>By
        {{#if info.homepage}}
        <a href="{{info.homepage}}" target="_blank">{{info.author}}</a>.
        {{else}}
        <a>{{info.author}}</a>.
        {{/if}}
      </p>
      <p>{{info.description}}
        {{#if info.extendedDescription}}
        <a href="#" title="{{info.extendedDescription}}">More info.</a>
        {{/if}}
      </p>
      {{#xif "this.info.id != 'BGCore'"}}
      {{#if enabled}}
      <a data-id="{{info.id}}" class="button enabled"></a>
      {{else}}
      <a data-id="{{info.id}}" class="button enable"></a>
      {{/if}}
      {{/xif}}
    </div>`);

    // Insert extensions currently enabled
    let disabledExtensions = BetterGaia.pref.get('disabledExtensions');
    for (let i = 0, len = extensionClassesIds.length; i < len; i++) {
      let extension = extensionClasses[extensionClassesIds[i]];
      let enabled = (disabledExtensions.indexOf(extensionClassesIds[i]) === -1)? true:false;

      if (enabled)
      $(activeExtensionsListTemplate({
        info: extension.info(),
        prefs: extension.defaultPrefs()
      })).appendTo('#bg_settings .myextensions .list');

      $(availableExtensionsTemplate({
        info: extension.info(),
        prefs: extension.defaultPrefs(),
        enabled: enabled
      })).appendTo('#bg_settings .bgs_page.extensions');
    }

    $('#bg_settings .bgs_menu').on('click.BGCore', 'a[data-link]', function() {
      let pageName = $(this).attr('data-link');
      $('#bg_settings .bgs_menu .bgs_active, #bg_settings .bgs_pages .bgs_page.bgs_active').removeClass('bgs_active');
      $(this).parent().addClass('bgs_active');
      $(`#bg_settings .bgs_pages .bgs_page.${pageName}`).addClass('bgs_active');
    });

    // Display extension details
    $('#bg_settings .myextensions .list').on('click.BGCore', 'li[data-id]', (event) => {
      let liTag = event.currentTarget,
          extensionId = liTag.getAttribute('data-id');
      $('#bg_settings .myextensions .list .bgs_active, #bg_settings .myextensions .details .bgs_active').removeClass('bgs_active');
      liTag.classList.add('bgs_active');

      let detail = $(`#bg_settings .myextensions .details .detail[data-id="${extensionId}"]`);
      if (detail.length < 1) {
        // Prep settings
        detail = $(activeExtensionsDetailTemplate({
          info: extensionClasses[extensionId].info(),
          settings: extensionClasses[extensionId].settings()
        })).appendTo('#bg_settings .myextensions .details');

        // Prefill values for options
        detail.find('.settings *[data-pref]').each((i, option) => {
          let pref = option.getAttribute('data-pref'),
              value = Extension.getPrefForId(pref, extensionId);

          // Error Handling
          if (typeof value === 'undefined') {
            option.disabled = true;
            throw('Error: ' + pref + ' is not a valid preference to initialize.');
          }

          // Checkbox
          if (option.getAttribute('type') === 'checkbox') option.checked = value;
          // Select, Textbox
          else option.value = value;
        });

        // Show
        detail.css('opacity'); // http://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
      }

      document.querySelector('#bg_settings .myextensions .details').scrollTop = 0;
      detail.addClass('bgs_active');
    });

    // Save prefs on change
    $('#bg_settings .myextensions .details').on('change', '.detail.bgs_active *[data-pref]', (event) => {
      let optionTag = event.currentTarget,
          extensionId = optionTag.getAttribute('data-extensionid'),
          pref = optionTag.getAttribute('data-pref'),
          value = (optionTag.getAttribute('type') === 'checkbox')? optionTag.checked : optionTag.value;

      // Preview
      if (extensionId === 'Personalize' && pref === 'nav.hue') {
        let hue = parseInt(value, 10);
        hue -= 207;
        if (hue < 0) hue += 360;
        this.addCSS(`
          #gaia_menu_bar, #gaia_header #user_account {-webkit-filter: hue-rotate(${hue}deg) !important; filter: hue-rotate(${hue}deg) !important;}
          #gaia_menu_bar .main_panel_container .panel-img, #gaia_menu_bar .main_panel_container .new-img, #gaia_menu_bar .main_panel_container .panel-more .arrow, #gaia_menu_bar #menu_search, #gaia_menu_bar .bg_settings_link_msg {-webkit-filter: hue-rotate(-${hue}deg) !important; filter: hue-rotate(-${hue}deg) !important;}
        `);
      }

      /* Preview
      else if (pref == 'background.repeat') {
        if (save[pref] === false) $('#preview').css('background-repeat', 'no-repeat');
        else $('#preview').css('background-repeat', 'repeat');
      }
      else if (pref == 'background.position') $('#preview').css('background-position', save[pref]);
      else if (pref == 'background.color') $('#preview').css('background-color', save[pref]);
      else if (pref == 'header.nav') $('#preview .nav, #preview .header .wrap .username').css('background-color', save[pref]);
      else if (pref == 'header.nav.hover') $('#preview .nav a:nth-of-type(3)').css('background-image', 'radial-gradient(ellipse at bottom center, ' + save[pref] + ', transparent 95%)');
      else if (pref == 'header.nav.current') $('#preview .nav a:first-child').css('background-image', 'radial-gradient(ellipse at bottom center, ' + save[pref] + ', transparent 95%)');
      else if (pref == 'forum.threadHeader') $('#preview .body .linklist').css('background-color', save[pref]);
      else if (pref == 'forum.postHeader') $('#preview .body .username').css('background-color', save[pref]);*/

      // Save to storage
      Extension.setPrefForId(pref, value, extensionId);
    });

    // Reset button functionality
    $('#bg_settings .myextensions .details').on('click', '.detail.bgs_active input[data-reset-pref]', (event) => {
      let buttonTag = event.currentTarget,
          extensionId = buttonTag.getAttribute('data-extensionid'),
          pref = buttonTag.getAttribute('data-reset-pref'),
          optionTag = buttonTag.parentNode.querySelector(`*[data-pref="${pref}"]`);

      // Get default value from storage
      let value = Extension.getDefaultPrefForId(pref, extensionId);

      // Set option
      if (optionTag.getAttribute('type') === 'checkbox')
        optionTag.checked = value;
      else
        optionTag.value = value;

      $(optionTag).trigger('change');
    });

    // Disable active extension
    $('#bg_settings .myextensions .details').on('click.BGCore', '.disable[data-id]', function() {
      let extensionId = $(this).attr('data-id');
      if (extensionId == 'BGCore') return console.warn('BetterGaia Core cannot be disabled.');

      // Click on next extension
      let liTag = $(`#bg_settings .myextensions .list li[data-id="${extensionId}"]`).next();
      if (liTag.length > 0) liTag.click();
      else {
        liTag = $(`#bg_settings .myextensions .list li[data-id="${extensionId}"]`).prev();
        if (liTag.length > 0) liTag.click();
      }

      // Remove from myextensions list
      $(this).closest('.detail').remove();
      $(`#bg_settings .myextensions .list li[data-id="${extensionId}"]`).remove();
      $(`#bg_settings .extensions .button.enabled[data-id="${extensionId}"]`).removeClass('enabled').addClass('enable');

      // Add to disabled extensions preference
      let disabledExtensions = BetterGaia.pref.get('disabledExtensions');
      if (disabledExtensions.indexOf(extensionId) === -1) {
        disabledExtensions.push(extensionId);
        BetterGaia.pref.set('disabledExtensions', disabledExtensions);
      }
    });

    // Enable extension
    $('#bg_settings .extensions').on('click.BGCore', '.button.enable[data-id]', function() {
      let extensionId = $(this).attr('data-id');
      if (extensionId == 'BGCore') return console.warn('BetterGaia Core cannot be enabled.');

      // Add to myextensions list
      $(this).removeClass('enable').addClass('enabled');
      $(activeExtensionsListTemplate({
        info: extensionClasses[extensionId].info(),
        prefs: extensionClasses[extensionId].defaultPrefs()
      })).appendTo('#bg_settings .myextensions .list');

      // Remove from disabled extensions pref
      let disabledExtensions = BetterGaia.pref.get('disabledExtensions'),
          index = disabledExtensions.indexOf(extensionId);
      if (index !== -1) {
        disabledExtensions.splice(index, 1);
        BetterGaia.pref.set('disabledExtensions', disabledExtensions);
      }
    });

    // Reset button
    $('#bg_settings .about .reset').on('click.BGCore', function() {
      BetterGaia.reset();
    });

    // Ready to go!
    if (document.querySelector('#bg_settings .myextensions .list li') !== null) $('#bg_settings .myextensions .list li')[0].click();
  }

  preMount() {
    this.addStyleSheet('font');
    this.addStyleSheet('style');
  }

  mount() {
    $('body').on('click.BGCore', '.bg_model.open .bg_model_header .close', function() {
        $(this).closest('.bg_model.open').removeClass('open');
        $('html').removeClass('bg_noscroll');
    });

    /*
     *  The below pretains to the settings panel
     */

    // Add button to open settings to nav
    let buttonHtml = `<li class="megamenu-divider"></li>
    <li class="bg_settings_link megamenu-no-panel">
      <a class="megamenu-section-trigger">BetterGaia</a>
      <p class="bg_settings_link_msg">Change your settings for BetterGaia.</p>
    </li>`;

    if (document.querySelector('#nav #runway_menu')) $('#nav #runway_menu').after(buttonHtml);
    else $('#nav .megamenu-divider').filter(':last').before(buttonHtml);

    // Click events
    $('.bg_settings_link').on('click.BGCore', () => {
      if ($('#bg_settings').length < 1) {
        this.generateSettings();
      }

      $('#bg_settings').addClass('open');
      $('html').addClass('bg_noscroll');
    });
  }

  unMount() {
    this.removeCSS();
    $('body').off('click.BGCore', '.bg_model.open .bg_model_header .close');
    $('#bg_settings .bgs_menu').off('click.BGCore', 'a[data-link]');
    $('#bg_settings .myextensions .list').off('click.BGCore', 'li[data-id]');
    $('#bg_settings .myextensions .details').off('click.BGCore', '.disable[data-id]');
    $('#bg_settings').remove();
  }
}

class DrawAll extends Extension {
  constructor() {
    super('DrawAll');
  }

  static info() {
    return {
      id: 'DrawAll',
      title: 'Draw All',
      description: 'Collect Daily Chance all in one place.',
      extendedDescription: 'No more excessive page browsing or hassle, just more treasure collecting.',
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: ['/', '/?login_success=*', '/@(mygaia|market|forum|world|games|payments|gofusion)/']
    };
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    // Add Sign
    $('#dailyChance_clawMachine').after('<a class="bg_drawall" title="BetterGaia&rsquo;s Draw All Daily Chances">draw <em>all</em></a>');

    // Open model
    $('#dailyReward .bg_drawall').on('click.DrawAll', function() {
        if ($('#bg_drawall').length < 1) {
            var template = Handlebars.compile(`<div id="bg_drawall" class="bg_model">
              <div class="bg_model_container">
                <div class="bg_model_header">
                  <h1>Draw All</h1>
                  <a class="close" title="Close"></a>
                </div>
                <ul class="bg_model_content">
                  {{#each this}}
                  <li>
                    <h1>{{name}}</h1>
                    <div><a data-candy="{{id}}">Collect</a></div>
                  </li>
                  {{/each}}
                </ul>
              </div>
            </div>`);

            var template2 = Handlebars.compile(`<img src="http://gaiaonline.com/images/{{data.reward.thumb}}">
            <strong>{{data.reward.name}}</strong>
            <p class="bgreward">
                {{#if data.reward.descrip}}
                    {{{data.reward.descrip}}}
                    {{#if data.tier_desc}}
                    <br><br>{{data.tier_desc}}
                    {{/if}}
                {{else}}
                    {{#if data.tier_desc}}
                    {{data.tier_desc}}
                    {{/if}}
                {{/if}}
            </p>`);

            var candy = [{id: 1, name: 'Home'}, {id: 2, name: 'My Gaia'}, {id: 1279, name: 'Gaia Cash'}, {id: 8, name: 'Shops'}, {id: 1271, name: 'GoFusion'}, {id: 3, name: 'Forums'}, {id: 5, name: 'World'}, {id: 4, name: 'Games'}, {id: 12, name: 'Mobile App'}];
            $('body').append(template(candy));

            $('#bg_drawall a[data-candy]').on('click.DrawAll', function() {
                var thisCandy = $(this).closest('li');
                thisCandy.addClass('loading');

                $.ajax({
                    type: 'POST',
                    url: '/dailycandy/pretty/',
                    data: {
                        action: 'issue',
                        list_id: $(this).attr('data-candy'),
                        _view: 'json'
                    },
                    dataType: 'json'
                }).done(function(data) {
                    if (data['status'] == 'ok') {
                        thisCandy.children('div').html(template2(data));
                    }
                    else if (data['status'] == 'fail') {
                        thisCandy.children('div').html('<p>' + data['error']['message'] + '</p>');
                    }
                    else thisCandy.children('div').html('<p>There was a problem getting your Daily Chance.</p>');
                }).fail(function() {
                    thisCandy.children('div').html('<p>There was a problem getting your Daily Chance.</p>');
                }).always(function() {
                    thisCandy.removeClass('loading').addClass('loaded');
                });
            });
        }

        $('#bg_drawall').addClass('open');
        $('html').addClass('bg_noscroll');
    });
  }

  unMount() {
    this.removeCSS();
    $('#dailyReward .bg_drawall, #bg_drawall a[data-candy]').off('click.DrawAll');
    $('#bg_drawall, #bg_drawall + .bg_mask, .bg_drawall').remove();
  }
}

class FormattingToolbar extends Extension {
  constructor() {
    super('FormattingToolbar');
  }

  static info() {
    return {
      id: 'FormattingToolbar',
      title: 'Formatting Toolbar',
      description: 'Be unconfused when typing things out.',
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0'
    };
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    function toolbar() {
      $("body #editor #format_controls .format-text").append(`<li>
        <a class="bg_addemoji" onclick="var el = document.getElementById('emoticons'); el.style.display = (el.style.display != 'block' ? 'block' : ''); var el2 = document.getElementById('emote_select'); el2.style.display = (el2.style.display != 'block' ? 'block' : '');" title="Add Emoji">Add Emoji</a>
      </li>`);

      // Add spoiler button
      $("body #editor #format_controls .format-elements").append("<li><a class='bg_spoiler' onclick='function wrapText(elementID, openTag, closeTag) {var textarea = document.getElementById(elementID); var len = textarea.value.length; var start = textarea.selectionStart; var end = textarea.selectionEnd; var selectedText = textarea.value.substring(start, end); var replacement = openTag + selectedText + closeTag; textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end, len);} wrapText(\"message\", \"[spoiler]\", \"[/spoiler]\");' title='Add Spoiler - [spoiler][/spoiler]'>Add Spoiler Tag</a></li>");
    }

    if (document.readyState === 'complete') {
      toolbar();
    }
    else {
      window.addEventListener('load', (event) => {
        toolbar();
      });
    }
  }

  unMount() {
    this.removeCSS();
    $('.bg_addemoji, .bg_spoiler').parent().remove();
  }
}

class Forums extends Extension {
  constructor() {
    super('Forums');
  }

  static info() {
    return {
      id: 'Forums',
      title: 'Forums',
      author: 'The BetterGaia Team',
      description: 'A more modern forums.',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: ['/forum/**', '/news/**']
    };
  }

  static defaultPrefs() {
    return {
      'instants': true,
      'previewThreads': true,
      'constrain': true,
      'pollHide': false,
      'reduceTransparency': false,

      'post.optionsBottom': true,
      'post.bgContainer': false,
      'post.postOffWhite': false,

      'theme.threadHeader': '30',
      'theme.postHeader': '207'
    };
  }

  static settings() {
    return [
      {type: 'title', value: 'General'},
      {type: 'checkbox', pref: 'instants', description: 'Use instant quoting and editing'},
      {type: 'checkbox', pref: 'previewThreads', description: 'Use thread preview in thread listings'},
      {type: 'checkbox', pref: 'constrain', description: 'Constrain width of forums'},
      {type: 'checkbox', pref: 'pollHide', description: 'Show polls collapsed in threads'},
      {type: 'checkbox', pref: 'reduceTransparency', description: 'Reduce transparency in forums'},

      {type: 'title', value: 'Posts'},
      {type: 'checkbox', pref: 'post.optionsBottom', description: 'Show post options at bottom of posts'},
      {type: 'checkbox', pref: 'post.bgContainer', description: 'Show background around posts'},
      {type: 'checkbox', pref: 'post.postOffWhite', description: 'Show posts with an off-white background'},

      {type: 'title', value: 'Colors'},
      {type: 'hue', pref: 'theme.threadHeader', description: 'Main color'},
      {type: 'hue', pref: 'theme.postHeader', description: 'Posts color'}
    ];
  }

  render() {
    // Adds Instants
    if (this.getPref('instants') === true) {
      $('.post .post-options ul').each(function() {
        if ($(this).find('a.post-quote').length > 0 || $(this).find('a.post-edit').length > 0)
          $(this).prepend('<div class="bg_instant"><li><a class="bg_instanttext"><span>Instant</span></a></li></div>');

        if ($(this).find('a.post-quote').length > 0)
          $(this).find('.bg_instant').append('<li><a class="bg_instantquote" data-action="quote"><span>Quote</span></a></li>');

        if ($(this).find('a.post-edit').length > 0)
          $(this).find('.bg_instant').append('<li><a class="bg_instantedit" data-action="edit"><span>Edit</span></a></li>');
      });

      $('.post .post-options .bg_instant').on('click.Forums', 'a[data-action]', function() {
        let message = $(this).closest('.messagecontent'),
            action = this.getAttribute('data-action');

        if (message.find(`.bg_instantbox.${action}`).length === 0) {
          message.find('.post-bubble').after(`<div class="bg_instantbox ${action} loading">
            <span class="bg_spinner"></span>
          </div>`);

          //get url
          var url = message.find(`.post-options .post-${action}`).attr('href');
          $.get(url).done(function(data) {
            var pageHtml = $('<div>').html(data);
            pageHtml.find('script').remove();

            message.find(`.bg_instantbox.${action}`).removeClass('loading').html(pageHtml.find('form#compose_entry')[0].outerHTML);

            if (typeof BetterGaia.applyPostFormattingToolbar === 'function')
              BetterGaia.applyPostFormattingToolbar(message.find(`.bg_instantbox.${action} textarea[name="message"]`)[0]);
          });
        }
        else {
          $(this).closest('.messagecontent').find(`.bg_instantbox.${action}`).slideToggle('slow');
        }
      });
    }
  }

  preMount() {
    this.addStyleSheet('style');

    // Full page forum width
    if (this.getPref('constrain') === true)
    this.addCSS(`
      body.forums > #content {width: auto;}
      body.forums #content #content-padding {width: 1140px; padding: 1em 0;}
      body.forums #gaia_content.ss_2Columns_flexiLeft_wideRight {padding: 1em 0; width: 100% !important;}
      body.forums #gaia_content.ss_2Columns_flexiLeft_wideRight > #yui-main {float: none; margin: 0 auto; width: 1140px;}
      body.forums #gaia_content.grid_dizzie_gillespie {padding: 15px 0 5px; width: 1140px !important; margin: 0 auto;}
      body.forums #gaia_content.grid_dizzie_gillespie > #bd {width: 1140px; margin: 0; overflow: visible;}
    `);

    // Poll Drop Down
    if (this.getPref('pollHide') === true)
    this.addCSS('body.forums #content #content-padding > #topic_header_container #thread_poll {height: 40px; overflow: hidden;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover {height: auto; overflow: visible;} body.forums #content #content-padding > #topic_header_container #thread_poll:after {content: "\\25BC"; color: rgba(0,0,0,0.35); display: block; position: absolute; top: 9px; right: 8px; font-size: 17px; text-shadow: 0 1px 1px #FFF;} body.forums #content #content-padding > #topic_header_container #thread_poll:hover:after {color: rgba(0,0,0,0.7); content: "\\25B2";}');

    // Add background to posts
    if (this.getPref('post.bgContainer') === true)
    this.addCSS(`
      body.forums #content #post_container .post > .postcontent {border-radius: 5px 0 0 0; background-image: linear-gradient(to bottom, rgba(255,255,255,0.9), rgba(255,255,255,0.9)); background-size: 130px 130px; background-repeat: repeat-y;}
      body.forums #content #post_container .post.bgpc_hidden > .postcontent {border-radius: 5px;}
      body.forums #content #post_container .post .postcontent .user_info_wrapper .user_info .user_name, body.forums #content #post_container .post .postcontent .user_info_wrapper {border-top-left-radius: 0;}
    `);

    // Make posts off white
    if (this.getPref('post.postOffWhite') === true)
    this.addCSS('body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble {background-color: rgba(255,255,255,0.9);} body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble div.content, body.forums #content #post_container .post .postcontent .message .messagecontent .post-bubble .avi-speech:not(.document) .avi-speech-bd {background-color: transparent;}');

    // Make forums all white
    if (this.getPref('reduceTransparency') === true)
    this.addCSS('body.forums #content #content-padding > #topic_header_container #thread_header, body.forums #content #content-padding > #topic_header_container #thread_poll, body.forums #content #content-padding > #topic_header_container .detail-navlinks, body.forums #content #post_container .post .postcontent .message .messagecontent .post-options, body.forums #content #post_container .post .postcontent .post-signature, body.forums #content #content-padding > #navlinks_pag {background-color: #FFF;}');

    // Put post options on top
    if (this.getPref('post.optionsBottom') === false)
    this.addCSS('body.forums #content #post_container .post .postcontent .message .messagecontent {flex-direction: column-reverse;}');

    // Thread Header Color
    if (this.getPref('theme.threadHeader') != '30')
    this.addCSS(`body.forums #gaia_content:not(.grid_billie_holiday) #forum-header .linklist, body.forums #content #content-padding > .linklist, body.forums #gaia_content .forum-list + #forum_ft_content:before {background-color: hsl(${this.getPref('theme.threadHeader')}, 50%, 42%);}`);

    // Post Theme
    if (this.getPref('theme.postHeader') != '207')
    this.addCSS(`body.forums #content #post_container .post .postcontent .user_info_wrapper {background-color: hsl(${this.getPref('theme.postHeader')}, 78%, 89%);}`);
  }

  mount() {
    // Add thread preview
    if (this.getPref('previewThreads') === true) {
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
    $('.post .post-options .bg_instantquote, .post .post-options .bg_instantedit').off('click.Forums');
    $('.bg_instant, .bg_instantbox').remove();
  }
}

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

class Guilds extends Extension {
  constructor() {
    super('Guilds');
  }

  static info() {
    return {
      id: 'Guilds',
      title: 'Guilds',
      description: 'A more modern Guilds page.',
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: ['/guilds/**']
    };
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {}

  unMount() {
    this.removeCSS();
  }
}

class MyGaia extends Extension {
  constructor() {
    super('MyGaia');
  }

  static info() {
    return {
      id: 'MyGaia',
      title: 'My Gaia',
      description: 'A more modern My Gaia page.',
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0',
      match: ['/mygaia/**']
    };
  }

  static defaultPrefs() {
    return {
      'suggested': true,
      'bgchat': true
    };
  }

  static settings() {
    return [
      {type: 'title', value: 'General'},
      {type: 'checkbox', pref: 'suggested', description: 'Hide suggested content'},
      {type: 'checkbox', pref: 'bgchat', description: 'Stay up to date with BetterGaia'},
    ];
  }

  preMount() {
    this.addStyleSheet('style');

    // Show Suggested Content
    if (this.getPref('suggested') === false)
      this.addCSS('body.mygaia #gaia_content #bd .mg_content.suggested {display: block;}');
  }

  mount() {
    if (this.getPref('bgchat') === true) {
      $('body.mygaia #gaia_content.grid_ray_davies #bd #yui-main .yui-g > .left').prepend(`<div id="bg_sidebar" class="mg_content">
        <div class="mg_sprite hd">BetterGaia <small class="bgversion">${BetterGaia.version}<small>
          <a class="bg_expand"></a>
        </div>
        <div class="bd">
          <iframe sandbox="allow-scripts allow-forms allow-same-origin allow-popups" width="100%" frameborder="0" src="http://www.bettergaia.com/sidebar/"></iframe>
        </div>
      </div>`);

      $('#bg_sidebar .bg_expand').on('click.MyGaia', function() {
        $('#gaia_content .left').toggleClass('bgexpanded');
      });
    }
  }

  unMount() {
    this.removeCSS();
    $('#bg_sidebar .bg_expand').off('click.MyGaia');
    $('#bg_sidebar').remove();
  }
}

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

    // Background
    if (this.getPref('background.image') != 'default')
      this.addCSS('body.time-day, body.time-dawn, body.time-dusk, body.time-night, body table.warn_block {background-image: url(' + this.getPref('background.image') + ');}');

    // Background Options
    if (this.getPref('background.image') != 'default') {
      this.addCSS('body.time-day, body.time-night, body.time-dawn, body.time-dusk, body table.warn_block {');
      this.addCSS('background-color: ' + this.getPref('background.color') + ';'); // Color
      this.addCSS('background-position: ' + this.getPref('background.position') + ';'); // Position

      if (this.getPref('background.repeat') === false) this.addCSS('background-repeat: no-repeat;'); // Repeat
      else this.addCSS('background-repeat: repeat;'); // Repeat

      if (this.getPref('background.float') === true) this.addCSS('background-attachment: fixed;'); // Float
      else this.addCSS('background-attachment: scroll;'); // Float

      this.addCSS('}');
    }

    // Header Background
    if (this.getPref('header.background') != 'default')
      this.addCSS('.time-day div.town-barton .header_content, .time-dawn div.town-barton .header_content, .time-dusk div.town-barton .header_content, .time-night div.town-barton .header_content, .time-day div.town-isledegambino .header_content, .time-dawn div.town-isledegambino .header_content, .time-dusk div.town-isledegambino .header_content, .time-night div.town-isledegambino .header_content, .time-day div.town-aekea .header_content, .time-dawn div.town-aekea .header_content, .time-dusk div.town-aekea .header_content, .time-night div.town-aekea .header_content, .time-day div.town-durem .header_content, .time-dawn div.town-durem .header_content, .time-dusk div.town-durem .header_content, .time-night div.town-durem .header_content, .time-day div.town-basskenlake .header_content, .time-dawn div.town-basskenlake .header_content, .time-dusk div.town-basskenlake .header_content, .time-night div.town-basskenlake .header_content {background-image: url(' + this.getPref('header.background') + ');}');

    // Header Background Base
    if (this.getPref('header.background.base') != 'default')
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

class Shortcuts extends Extension {
  constructor() {
    super('Shortcuts');
  }

  static info() {
    return {
      id: 'Shortcuts',
      title: 'Shortcuts',
      description: 'Have your own links to use on every page.',
      extendedDescription: `Manage the shortcuts next by your username.`,
      author: 'The BetterGaia Team',
      homepage: 'http://www.bettergaia.com/',
      version: '1.0'
    };
  }

  static defaultPrefs() {
    return {
      'links': [
        ['MyGaia', '/mygaia/'],
        ['Private Messages', '/profile/privmsg.php'],
        ['Forums', '/forum/'],
        ['My Posts', '/forum/myposts/'],
        ['My Topics', '/forum/mytopics/'],
        ['Subscribed Threads', '/forum/subscription/'],
        ['Shops', '/market/'],
        ['Trades', '/gaia/bank.php'],
        ['Marketplace', '/marketplace/'],
        ['Guilds', '/guilds/'],
        ['Top of Page', '#'],
        ['Bottom of Page', '#bg_bottomofpage']
      ]
    };
  }

  static settings() {
    return [
      {type: 'list', pref: 'links'}
    ];
  }

  preMount() {
    this.addStyleSheet('style');
  }

  mount() {
    let links = this.getPref('links');
    if (!$.isEmptyObject(links)) {
      $('#gaia_header #user_dropdown_menu').prepend(`<ul id="bg_shortcuts">
        <li class="dropdown-list-item"><a class="bg_shortcuts_link">Shortcuts</a></li>
        <ul></ul>
      </ul>`);

      $(links).each(function(index, data){
        $('#bg_shortcuts ul').append('<li><a href="' + data[1] + '">' + data[0] + '</a></li>');
      });
    }
  }

  unMount() {
    this.removeCSS();
    $('#gaia_header #user_dropdown_menu #bg_shortcuts').remove();
  }
}

const extensionClasses = {
  AnnouncementReader, BGCore, DrawAll, ExternalLinkRedirect, FormattingToolbar, Forums, Guilds, MyGaia, Personalize, PostFormatting, PrivateMessages, Shortcuts, UserTags // eslint-disable-line
};

const extensionClassesIds = ['AnnouncementReader', 'BGCore', 'DrawAll', 'ExternalLinkRedirect', 'FormattingToolbar', 'Forums', 'Guilds', 'MyGaia', 'Personalize', 'PostFormatting', 'PrivateMessages', 'Shortcuts', 'UserTags'];
