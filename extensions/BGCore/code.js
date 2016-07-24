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
            <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" type="checkbox"> {{description}}
          </label>
        </div>
        {{/if_eq}}

        {{#if_eq type "selection"}}
        <div class="option selection">
          <label for="{{@root.info.id}}.{{pref}}">{{description}}</label>
          <select id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}">
            {{#each values}}
            <option value="{{value}}">{{name}}</option>
            {{/each}}
          </select>
        </div>
        {{/if_eq}}

        {{#if_eq type "hue"}}
        <div class="option hue">
          <label for="{{@root.info.id}}.{{pref}}">{{description}}</label>
          <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" type="color">
        </div>
        {{/if_eq}}

        {{#if_eq type "textbox"}}
        <div class="option textbox">
          <label for="{{@root.info.id}}.{{pref}}"{{#if hidden}} hidden{{/if}}>{{description}}</label>
          <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" type="text" placeholder="{{description}}"{{#if hidden}} hidden{{/if}}>
        </div>
        {{/if_eq}}

        {{#if_eq type "list"}}
        <div class="option list">
          <label for="{{@root.info.id}}.{{pref}}"{{#if hidden}} hidden{{/if}}>{{pref}}</label>
          <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" type="text" placeholder="{{pref}}"{{#if hidden}} hidden{{/if}}>
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
        detail.find('.settings input[type="text"][data-pref], .settings input[type="checkbox"][data-pref], .settings select[data-pref]').each((i, option) => {
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
