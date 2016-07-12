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
                    <span>{{name}}</span>
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
