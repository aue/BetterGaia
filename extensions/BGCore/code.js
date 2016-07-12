class BGCore extends Extension {
  constructor() {
    super('BGCore');
    this.match = ['/', '/mygaia/', '/market/', '/forum/', '/world/', '/games/', '/payments/', '/gofusion/'];
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

  static defaultPrefs() {
    return {};
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

    $('#nav #menu_search').before(`
      <li class="bg_settings_link megamenu-no-panel">
        <a class="megamenu-section-trigger">
          <span class="lt_selector"></span>
          BetterGaia
          <span class="rt_selector"></span>
        </a>
        <div class="main_panel_container">
          <div class="main_panel">
            Open your settings
          </div>
          <div class="panel_bottom"></div>
        </div>
      </li>
      <li class="megamenu-divider"></li>
    `);

    $('.bg_settings_link').on('click.BGCore', function() {
      if ($('#bg_settings').length < 1) {
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

        const activeExtensionsListTemplate = Handlebars.compile(`<li data-id="{{info.id}}">
          <h1>{{info.title}}</h1>
          <p>{{info.description}}</p>
        </li>`);

        const activeExtensionsDetailTemplate = Handlebars.compile(`<div data-id="{{info.id}}" class="detail">
          <h1>{{info.title}} <small>{{info.version}}</small></h1>
          <div class="about">
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
            <a class="button disable" data-id="{{info.id}}">Disable</a>
          </div>

          <h2>Settings</h2>
          {{#each prefs}}
          <p>{{this}}</p>
          {{else}}
          <p><em>{{info.title}}</em> does not have any customizable settings.</p>
          {{/each}}
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
          {{#if enabled}}
          <a data-id="{{info.id}}" class="button enabled"></a>
          {{else}}
          <a data-id="{{info.id}}" class="button enable"></a>
          {{/if}}
        </div>`);

        // Insert extensions currently enabled
        for (let i = 0, len = BetterGaia.extensions.length; i < len; i++) {
          $(activeExtensionsListTemplate({
            info: BetterGaia.extensions[i].constructor.info(),
            prefs: BetterGaia.extensions[i].constructor.defaultPrefs()
          })).appendTo('#bg_settings .myextensions .list');
        }

        $('#bg_settings .bgs_menu').on('click.BGCore', 'a[data-link]', function() {
          let pageName = $(this).attr('data-link');

          // Initilize available extensions if needed
          if (pageName == 'extensions' && document.querySelector('#bg_settings .bgs_page.extensions.uninitialized') !== null) {
            let enabledExtensions = BetterGaia.pref.get('enabledExtensions');
            for (let extension in extensionClasses) {
              $(availableExtensionsTemplate({
                info: extensionClasses[extension].info(),
                prefs: extensionClasses[extension].defaultPrefs(),
                enabled: (enabledExtensions.indexOf(extension) > -1)? true : false
              })).appendTo('#bg_settings .bgs_page.extensions');
              $('#bg_settings .bgs_page.extensions.uninitialized').removeClass('uninitialized');
            }
          }

          $('#bg_settings .bgs_menu .bgs_active, #bg_settings .bgs_pages .bgs_page.bgs_active').removeClass('bgs_active');
          $(this).parent().addClass('bgs_active');
          $(`#bg_settings .bgs_pages .bgs_page.${pageName}`).addClass('bgs_active');
        });

        // Display extension details
        $('#bg_settings .myextensions .list').on('click.BGCore', 'li[data-id]', function() {
          let extensionId = $(this).attr('data-id');
          $('#bg_settings .myextensions .list .bgs_active, #bg_settings .myextensions .details .bgs_active').removeClass('bgs_active');
          $(this).addClass('bgs_active');

          let detail = $(`#bg_settings .myextensions .details .detail[data-id="${extensionId}"]`);
          if (detail.length < 1) {
            detail = $(activeExtensionsDetailTemplate({
              info: extensionClasses[extensionId].info(),
              prefs: extensionClasses[extensionId].defaultPrefs()
            })).appendTo('#bg_settings .myextensions .details');
          }
          detail.addClass('bgs_active');
        });

        // Disable active extension
        $('#bg_settings .myextensions .details').on('click.BGCore', '.disable[data-id]', function() {
          let extensionId = $(this).attr('data-id');
          $(this).closest('.detail').remove();
          $(`#bg_settings .myextensions .list li[data-id="${extensionId}"]`).remove();
          $(`#bg_settings .extensions .button.enabled[data-id="${extensionId}"]`).removeClass('enabled').addClass('enable');

          if (document.querySelector('#bg_settings .myextensions .list li') !== null) $('#bg_settings .myextensions .list li')[0].click();
        });

        // Enable extension
        $('#bg_settings .extensions').on('click.BGCore', '.button.enable[data-id]', function() {
          let extensionId = $(this).attr('data-id');
          $(this).removeClass('enable').addClass('enabled');

          $(activeExtensionsListTemplate({
            info: extensionClasses[extensionId].info(),
            prefs: extensionClasses[extensionId].defaultPrefs()
          })).appendTo('#bg_settings .myextensions .list');
        });

        // Ready to go!
        if (document.querySelector('#bg_settings .myextensions .list li') !== null) $('#bg_settings .myextensions .list li')[0].click();
        // end if
      }

      $('#bg_settings').addClass('open');
      $('html').addClass('bg_noscroll');
    });

    $('.bg_settings_link').click();
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
