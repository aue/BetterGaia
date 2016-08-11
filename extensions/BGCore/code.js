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

  launchSettings() {
    if ($('#bg_settings').length < 1) {
      this.generateSettings();
    }

    $('#bg_settings').addClass('open');
    $('html').addClass('bg_noscroll');
  }

  generateSettings() {
    // TODO: Refactor this one day

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
              <div class="sidebar"><ul class="list"></ul></div>
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
                  <a class="button" target="_blank" href="http://www.gaiaonline.com/forum/t.96293729/">Forum Thread</a>
                  <br>
                  <br>
                  <br>
                  <a class="button transfer">Transfer v2015 Preferences</a>
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
              {{#if_eq type "group"}}
                <optgroup label="{{name}}">
                {{#each values}}
                  <option value="{{value}}">{{name}}</option>
                {{/each}}
                </optgroup>
              {{else}}
                <option value="{{value}}">{{name}}</option>
              {{/if_eq}}
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
        <div class="option textbox{{#if hidden}} bgs_hidden{{/if}}"{{#if hidden}} data-hidden-pref="{{pref}}"{{/if}}>
          <label for="{{@root.info.id}}.{{pref}}">{{description}}</label>
          <input id="{{@root.info.id}}.{{pref}}" data-pref="{{pref}}" data-extensionid="{{@root.info.id}}" type="text" placeholder="{{description}}">
        </div>
        {{/if_eq}}

        {{#if_eq type "other"}}
        <div class="option other" data-pref="{{pref}}"></div>
        {{/if_eq}}

      {{else}}
        <p><em>{{info.title}}</em> does not have any customizable settings.</p>
      {{/each}}
      </div>
    </div>`);

    const postFormattingItem = `<li class="format" data-bbcode="{{this.[1]}}" data-poststyle="{{this.[2]}}">
      <div class="handle">::</div>

      <div class="name">
        <strong>{{this.[0]}}</strong>
      </div>

      <div class="buttons">
        <input type="button" value="Edit" data-extensionid="PostFormatting" class="edit">
        <input type="button" value="Delete" class="delete">
      </div>
    </li>`;
    const postFormattingItemTemplate = Handlebars.compile(postFormattingItem);
    const postFormattingTemplate = Handlebars.compile(`
      <ul>
        {{#each this}}
        ${postFormattingItem}
        {{/each}}
      </ul>

      <div class="options">
        <input type="button" value="Add Format" data-extensionid="PostFormatting" class="add">
        <input type="button" value="Save Changes" data-extensionid="PostFormatting" class="save">
      </div>

      <div class="bg_model bg_pf">
        <div class="bg_model_container">
          <div class="bg_model_header">
            <h1>Editing Format</h1>
            <a class="close" title="Close"></a>
          </div>
          <form class="bg_model_content">
            <fieldset>
              <label for="format-name">Name</label>
              <input id="format-name" type="text" placeholder="Name">

              <label for="format-text">Format</label>
              <textarea id="format-text" placeholder="Format" rows="10"></textarea>

              <label for="format-type">Style</label>
              <select id="format-type">
                <option value="0">Say</option>
                <option value="1">Whisper</option>
                <option value="2">Shout</option>
                <option value="3">Think</option>
                <option value="4">Document</option>
                <option value="5">Ornate</option>
              </select>

              <input type="button" value="Save" class="format-save">
            </fieldset>
          </form>
        </div>
      </div>
    `);

    const shortcutsItem = `<li class="shortcut">
      <div class="handle">::</div>

      <div class="name">
        <label for="name{{@index}}">Name</label>
        <input id="name{{@index}}" type="text" class="pure-input-1" placeholder="Name" value="{{this.[0]}}">
      </div>

      <div class="link">
        <label for="url{{@index}}">URL</label>
        <input id="url{{@index}}" type="text" class="pure-input-1" placeholder="URL" value="{{this.[1]}}">
      </div>

      <div class="buttons">
        <input type="button" value="Delete" class="delete">
      </div>
    </li>`;
    const shortcutsItemTemplate = Handlebars.compile(shortcutsItem);
    const shortcutsTemplate = Handlebars.compile(`
      <ul>
        {{#each this}}
        ${shortcutsItem}
        {{/each}}
      </ul>

      <div class="options">
        <input type="button" value="Add Shortcut" data-extensionid="Shortcuts" class="add">
        <input type="button" value="Save Changes" data-extensionid="Shortcuts" class="save">
      </div>
    `);

    const userTagsTemplate = Handlebars.compile(`
      <ul>
        {{#each this}}
        <li class="usertag" data-userid="{{@key}}" data-tag="{{x "JSON.stringify(this)"}}">
          <div class="name">
            <strong>Username</strong>
            {{this.[0]}}
          </div>

          <div class="link">
            <strong>Tag</strong>
            {{#if this.[2]}}
            <a href="{{this.[2]}}" target="_blank">{{this.[1]}}</a>
            {{else}}
            {{this.[1]}}
            {{/if}}
          </div>

          <div class="date">
            <strong>Added</strong>
            {{x "new Date(this[3]).toDateString()"}}
          </div>

          <div class="buttons">
            <input type="button" value="Delete" class="delete">
          </div>
        </li>
        {{/each}}
      </ul>

      <div class="options">
        <input type="button" value="Save Changes" data-extensionid="UserTags" class="save">
      </div>
    `);

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
          if (pref === 'header.background.selection') {
            let front = Extension.getPrefForId('header.background', extensionId),
                back = Extension.getPrefForId('header.background.base', extensionId);
            value = front + ',' + back;

            if (option.querySelector(`option[value="${value}"]`)) option.value = value;
            else {
              option.value = 'custom';
              option.setAttribute('data-state', 'custom');
              $(option).closest('.settings').find('.option[data-hidden-pref="header.background"]').removeClass('bgs_hidden');
              $(option).closest('.settings').find('.option[data-hidden-pref="header.background.base"]').removeClass('bgs_hidden');
            }
          }
          else if (pref === 'background.image.selection' || pref === 'logo.selection') {
            let realPref = pref.slice(0, pref.length - 10);
            value = Extension.getPrefForId(realPref, extensionId);

            if (option.querySelector(`option[value="${value}"]`)) option.value = value;
            else {
              option.value = 'custom';
              option.setAttribute('data-state', 'custom');
              $(option).closest('.settings').find(`.option[data-hidden-pref="${realPref}"]`).removeClass('bgs_hidden');
            }
          }
          else if (typeof value === 'undefined') {
            option.disabled = true;
            console.warn('Error: ' + pref + ' is not a valid preference to initialize.');
          }
          else {
            if (option.getAttribute('type') === 'checkbox') option.checked = value;
            else option.value = value;
          }
        });

        // Custom setup for custom settings
        if (extensionId === 'PostFormatting') {
          let value = Extension.getPrefForId('list', extensionId);
          let list = detail.find('.settings .option.other').html(postFormattingTemplate(value));
          Sortable.create(list.find('ul')[0], {handle: '.handle'});
        }
        else if (extensionId === 'Shortcuts') {
          let value = Extension.getPrefForId('links', extensionId);
          let links = detail.find('.settings .option.other').html(shortcutsTemplate(value));
          Sortable.create(links.find('ul')[0], {handle: '.handle'});
        }
        else if (extensionId === 'UserTags') {
          let value = Extension.getPrefForId('tags', extensionId);
          detail.find('.settings .option.other').html(userTagsTemplate(value));
        }

        // Show
        detail.css('opacity'); // http://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
      }

      document.querySelector('#bg_settings .myextensions .details').scrollTop = 0;
      detail.addClass('bgs_active');
    });

    // Save prefs on change
    let save = (event) => {
      let optionTag = event.currentTarget,
          extensionId = optionTag.getAttribute('data-extensionid'),
          pref = optionTag.getAttribute('data-pref'),
          value = (optionTag.getAttribute('type') === 'checkbox')? optionTag.checked : optionTag.value;

      // Personalize extension
      if (extensionId === 'Personalize') {
        if (pref === 'nav.hue') {
          let hue = parseInt(value, 10);
          hue -= 207;
          if (hue < 0) hue += 360;
          this.addCSS(`
            #gaia_menu_bar, #gaia_header #user_account {-webkit-filter: hue-rotate(${hue}deg) !important; filter: hue-rotate(${hue}deg) !important;}
            #gaia_menu_bar .main_panel_container .panel-img, #gaia_menu_bar .main_panel_container .new-img, #gaia_menu_bar .main_panel_container .panel-more .arrow, #gaia_menu_bar #menu_search, #gaia_menu_bar .bg_settings_link_msg {-webkit-filter: hue-rotate(-${hue}deg) !important; filter: hue-rotate(-${hue}deg) !important;}
          `);
        }
        else if (pref === 'background.image.selection' || pref === 'logo.selection') {
          let realPref = pref.slice(0, pref.length - 10);

          if (value === 'custom') {
            optionTag.setAttribute('data-state', 'custom');
            $(optionTag).closest('.settings').find(`.option[data-hidden-pref="${realPref}"]`).removeClass('bgs_hidden');
          }
          else {
            if (optionTag.getAttribute('data-state') === 'custom') {
              optionTag.setAttribute('data-state', '');
              $(optionTag).closest('.settings').find(`.option[data-hidden-pref="${realPref}"]`).addClass('bgs_hidden');
            }
            $(optionTag).closest('.settings').find(`input[data-pref="${realPref}"]`).val(value).trigger('input');
          }

          return;
        }
        else if (pref === 'header.background') {
          if (value !== 'default')
          this.addCSS('.time-day div.town-barton .header_content, .time-dawn div.town-barton .header_content, .time-dusk div.town-barton .header_content, .time-night div.town-barton .header_content, .time-day div.town-isledegambino .header_content, .time-dawn div.town-isledegambino .header_content, .time-dusk div.town-isledegambino .header_content, .time-night div.town-isledegambino .header_content, .time-day div.town-aekea .header_content, .time-dawn div.town-aekea .header_content, .time-dusk div.town-aekea .header_content, .time-night div.town-aekea .header_content, .time-day div.town-durem .header_content, .time-dawn div.town-durem .header_content, .time-dusk div.town-durem .header_content, .time-night div.town-durem .header_content, .time-day div.town-basskenlake .header_content, .time-dawn div.town-basskenlake .header_content, .time-dusk div.town-basskenlake .header_content, .time-night div.town-basskenlake .header_content {background-image: url(' + value + ');}');
          else
          this.addCSS('.time-day div.town-barton .header_content, .time-dawn div.town-barton .header_content, .time-dusk div.town-barton .header_content, .time-night div.town-barton .header_content, .time-day div.town-isledegambino .header_content, .time-dawn div.town-isledegambino .header_content, .time-dusk div.town-isledegambino .header_content, .time-night div.town-isledegambino .header_content, .time-day div.town-aekea .header_content, .time-dawn div.town-aekea .header_content, .time-dusk div.town-aekea .header_content, .time-night div.town-aekea .header_content, .time-day div.town-durem .header_content, .time-dawn div.town-durem .header_content, .time-dusk div.town-durem .header_content, .time-night div.town-durem .header_content, .time-day div.town-basskenlake .header_content, .time-dawn div.town-basskenlake .header_content, .time-dusk div.town-basskenlake .header_content, .time-night div.town-basskenlake .header_content {background-image: url(//s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/il_header_bg_barton_sprite.jpg);}');
        }
        else if (pref === 'header.background.base') {
          if (value !== 'default')
          this.addCSS('.time-day div.town-barton, .time-dawn div.town-barton, .time-dusk div.town-barton, .time-night div.town-barton, .time-day div.town-isledegambino, .time-dawn div.town-isledegambino, .time-dusk div.town-isledegambino, .time-night div.town-isledegambino, .time-day div.town-aekea, .time-dawn div.town-aekea, .time-dusk div.town-aekea, .time-night div.town-aekea, .time-day div.town-durem, .time-dawn div.town-durem, .time-dusk div.town-durem, .time-night div.town-durem, .time-day div.town-basskenlake, .time-dawn div.town-basskenlake, .time-dusk div.town-basskenlake, .time-night div.town-basskenlake {background-image: url(' + value + '); background-repeat: repeat;}');
          else
          this.addCSS('.time-day div.town-barton, .time-dawn div.town-barton, .time-dusk div.town-barton, .time-night div.town-barton, .time-day div.town-isledegambino, .time-dawn div.town-isledegambino, .time-dusk div.town-isledegambino, .time-night div.town-isledegambino, .time-day div.town-aekea, .time-dawn div.town-aekea, .time-dusk div.town-aekea, .time-night div.town-aekea, .time-day div.town-durem, .time-dawn div.town-durem, .time-dusk div.town-durem, .time-night div.town-durem, .time-day div.town-basskenlake, .time-dawn div.town-basskenlake, .time-dusk div.town-basskenlake, .time-night div.town-basskenlake {background-image: url(//s.cdn.gaiaonline.com/images/gaia_global/gaia_header/new_header/rs_header_bg_barton_tile_sprite.jpg); background-repeat: repeat;}');
        }
        else if (pref === 'header.background.selection') {
          if (value === 'custom') {
            optionTag.setAttribute('data-state', 'custom');
            $(optionTag).closest('.settings').find('.option[data-hidden-pref="header.background"]').removeClass('bgs_hidden');
            $(optionTag).closest('.settings').find('.option[data-hidden-pref="header.background.base"]').removeClass('bgs_hidden');
          }
          else {
            if (optionTag.getAttribute('data-state') === 'custom') {
              optionTag.setAttribute('data-state', '');
              $(optionTag).closest('.settings').find('.option[data-hidden-pref="header.background"]').addClass('bgs_hidden');
              $(optionTag).closest('.settings').find('.option[data-hidden-pref="header.background.base"]').addClass('bgs_hidden');
            }

            value = value.split(',');
            $(optionTag).closest('.settings').find('input[data-pref="header.background"]').val(value[0]).trigger('input');
            $(optionTag).closest('.settings').find('input[data-pref="header.background.base"]').val(value[1]).trigger('input');
          }
          return;
        }
      }

      // Save to storage
      Extension.setPrefForId(pref, value, extensionId);
      console.log(`${extensionId}.${pref}`, value);
    };

    $('#bg_settings .myextensions .details').on('input', '.detail.bgs_active input[type="text"][data-pref]', save);
    $('#bg_settings .myextensions .details').on('change', '.detail.bgs_active input[type="checkbox"][data-pref], .detail.bgs_active input[type="range"][data-pref], .detail.bgs_active select[data-pref], .detail.bgs_active input[type="color"][data-pref]', save);

    // Lists buttons functionality
    $('#bg_settings .myextensions .details').on('click', '.detail.bgs_active .option.other .delete', (event) => {
      let buttonTag = event.currentTarget,
          liTag = buttonTag.parentNode.parentNode,
          parentEl = liTag.parentNode;

      parentEl.removeChild(liTag);
    });

    $('#bg_settings .myextensions .details').on('click', '.detail.bgs_active .option.other .add', (event) => {
      let buttonTag = event.currentTarget,
          extensionId = buttonTag.getAttribute('data-extensionid'),
          ulTag = buttonTag.parentNode.parentNode.querySelector('ul');

      if (extensionId === 'PostFormatting') ulTag.innerHTML += postFormattingItemTemplate(['', '', 0]);
      else if (extensionId === 'Shortcuts') ulTag.innerHTML += shortcutsItemTemplate(['', '']);
    });

    $('#bg_settings .myextensions .details').on('click', '.detail.bgs_active .option.other .edit', (event) => {
      let buttonTag = event.currentTarget,
          extensionId = buttonTag.getAttribute('data-extensionid'),
          liTag = buttonTag.parentNode.parentNode;

      if (extensionId === 'PostFormatting') {
        let name = liTag.querySelector('.name strong').textContent,
            bbcode = decodeURI(liTag.getAttribute('data-bbcode')),
            style = liTag.getAttribute('data-poststyle');

        // Mark tag as editing
        $(liTag.parentNode).children('li.editing').removeClass('editing');
        liTag.classList.add('editing');

        // Show editing model
        const model = liTag.parentNode.parentNode.querySelector('.bg_model.bg_pf');
        model.querySelector('input[type="text"]').value = name;
        model.querySelector('textarea').value = bbcode;
        model.querySelector('select').value = style;
        model.classList.add('open');
      }
    });

    $('#bg_settings .myextensions .details').on('click', '.detail.bgs_active .bg_model.bg_pf .format-save', (event) => {
      let name = $('.detail.bgs_active .bg_model.bg_pf #format-name').val(),
          bbcode = encodeURI($('.detail.bgs_active .bg_model.bg_pf #format-text').val()),
          style = $('.detail.bgs_active .bg_model.bg_pf #format-type').val();

      $('.detail.bgs_active .editing strong').text(name);
      $('.detail.bgs_active .editing').attr({
        'data-bbcode': bbcode,
        'data-poststyle': style
      });

      $('.detail.bgs_active .editing').removeClass('editing');
      $('.detail.bgs_active .bg_model.bg_pf').removeClass('open');
    });

    $('#bg_settings .myextensions .details').on('click', '.detail.bgs_active .option.other .save', (event) => {
      let buttonTag = event.currentTarget,
          extensionId = buttonTag.getAttribute('data-extensionid'),
          liTags = buttonTag.parentNode.parentNode.querySelectorAll('ul li');

      if (extensionId === 'PostFormatting') {
        let formats = [];
        for(let i = 0, len = liTags.length; i < len; i++) {
          let name = liTags[i].querySelector('.name strong').textContent,
              bbcode = liTags[i].getAttribute('data-bbcode'),
              style = liTags[i].getAttribute('data-poststyle');
          formats.push([name, bbcode, parseInt(style, 10)]);
        }

        Extension.setPrefForId('list', formats, extensionId);
        console.log(`${extensionId}.list`, formats);
      }

      else if (extensionId === 'Shortcuts') {
        let links = [];
        for(let i = 0, len = liTags.length; i < len; i++) {
          let name = liTags[i].querySelector('.name input').value,
              url = liTags[i].querySelector('.link input').value;
          links.push([name, url]);
        };

        Extension.setPrefForId('links', links, extensionId);
        console.log(`${extensionId}.links`, links);
      }

      else if (extensionId === 'UserTags') {
        let tags = {};
        for(let i = 0, len = liTags.length; i < len; i++) {
          let userid = liTags[i].getAttribute('data-userid'),
              tag = JSON.parse(decodeURI(liTags[i].getAttribute('data-tag')));
          tags[userid] = tag;
        };

        Extension.setPrefForId('tags', tags, extensionId);
        console.log(`${extensionId}.tags`, tags);
      }
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

    // Transfer button
    $('#bg_settings .about .transfer').on('click.BGCore', function() {
      let transfer = prompt('BetterGaia will now try to transfer your v2015 settings. Only use this if your settings have not carried over from a BetterGaia update. \n\nTo continue, enter "Transfer Settings" below.');

      if (transfer && transfer.toLowerCase() === 'transfer settings') {
        console.log('Starting Transfer');
        BetterGaia.migratePrefs();
      }
      else console.log('Transfer aborted.');
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
      if (!$(this).closest('.bg_model').hasClass('bg_pf')) {
        $('html').removeClass('bg_noscroll');
      }
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
      this.launchSettings();
    });

    // launch on settings page
    if (document.location.pathname + document.location.search + document.location.hash === '/guilds/viewtopic.php?t=24997285#bg:settings')
      this.launchSettings();
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
