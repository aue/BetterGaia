/*global chrome: false, console: false, data: false, Handlebars: false, prefs: false*/
/*jshint browser: true, jquery: true, multistr: true, sub: true*/

// Handlebars setup
Handlebars.registerHelper('if_eq', function (a, b, opts) {
    if (a == b) return opts.fn(this);
    else return opts.inverse(this);
});
Handlebars.registerHelper('urlComplete', function(url) {
    if (url.substr(0,4) != 'http') return 'http://www.gaiaonline.com' + url;
    return url;
});
Handlebars.registerHelper('timeFromEpoch', function(epoch) {
    return new Date(epoch).toLocaleDateString();
});
Handlebars.registerHelper('stringify', function(item) {
    var strung = JSON.stringify(item);
    return strung;
});
var template = Handlebars.compile($('#option-template').html()),
    shortcutsTemplate = Handlebars.compile($('#shortcuts-template').html()),
    formatsTemplate = Handlebars.compile($('#formats-template').html()),
    usertagsTemplate = Handlebars.compile($('#usertags-template').html());

// Debug message
function debugBro(error) {
    window.prompt('We\'re having some trouble with Settings. \nCan you pass this message over to us?',
                  'Runtime message: ' + error + ' Name: ' + error.name + ' Stack: ' + error.stack + ' Message: ' + error.message);
}

var Settings = {
    pageInit: function(pageName) {
        if (['Home', 'Background', 'Header', 'Logo', 'Colors', 'Forums', 'PostFormat', 'UserTags'].indexOf(pageName) > -1) {
            // Compile HTML
            $('.page[data-page="' + pageName + '"] fieldset').append(template(data[pageName]));

            // Set prefs
            $('.page[data-page="' + pageName + '"] *[data-pref]').each(function() {
                var pref = $(this).attr('data-pref');
                
                // Error Handling
                if (typeof(prefs[pref]) == 'undefined') {
                    $(this).prop('disabled', true);
                    throw('Error: ' + pref + ' is not a valid preference to initialize.');
                }

                // Checkbox
                if ($(this).attr('type') == 'checkbox') $(this).prop('checked', prefs[pref]);
                // Select, Textbox
                else $(this).val(prefs[pref]);
            });
        }

        if (pageName == 'Shortcuts') {
            $('.page[data-page="Shortcuts"] fieldset').html(shortcutsTemplate(prefs['header.shortcuts.list'])).sortable({
                handle: 'label',
                forcePlaceholderSize: true
            }).bind('sortupdate', function(e, ui) {
                $('.page[data-page="Shortcuts"] .save').show();
            });
            

            $('.page[data-page="Shortcuts"] .save').on('click', function() {
                var links = [];
                $('.page[data-page="Shortcuts"] fieldset .shortcut').each(function() {
                    links.push([$(this).find('input[placeholder="Name"]').val(), $(this).find('input[placeholder="URL"]').val()]);
                });

                chrome.storage.local.set({'header.shortcuts.list': links}, function() {
                    $('.page[data-page="Shortcuts"] .save').hide();
                });                
            });

            $('.page[data-page="Shortcuts"] .add').on('click', function() {
                $('.page[data-page="Shortcuts"] .save').show();
                $('.page[data-page="Shortcuts"] fieldset').append(shortcutsTemplate([['', '']])).sortable('reload');
            });
            
            $('.page[data-page="Shortcuts"] fieldset').on('keypress', 'input', function() {
                $('.page[data-page="Shortcuts"] .save').show();
            });

            $('.page[data-page="Shortcuts"] fieldset').on('click', '.delete', function() {
                $('.page[data-page="Shortcuts"] .save').show();
                $(this).parentsUntil('fieldset').remove();
            });
        }

        else if (pageName == 'Background') {
            $('.page[data-page="Background"] .options').on('click', 'a[data-url]', function() {
                if ($(this).hasClass('custom')) {
                    $('.model.background input[placeholder="URL"]').val($(this).attr('data-url'));
                    $('body').addClass('model-background');
                    return;
                }
                
                var image = $(this).attr('data-url');
                if (image == 'default') $('#preview').attr('style', '');
                else $('#preview').css('background-image', 'url(' + image + ')');
                $(this).parent().children('.selected').removeClass('selected');
                $(this).addClass('selected');
                
                $('input[data-pref="background.image"]').val(image).change();
            });

            $('.model.background .action').on('click', function() {
                var image = $('.model.background input[placeholder="URL"]').val();
                $('#preview').css('background-image', 'url(' + image + ')');
                
                $('.page[data-page="Background"] .selected').removeClass('selected');
                $('.page[data-page="Background"] .custom').attr('data-url', image).addClass('selected');

                $('input[data-pref="background.image"]').val(image).change();
                $('body').removeClass('model-background');
            });

            $.ajax({
                type: 'GET',
                url: 'backgrounds.json',
                dataType: 'text json',
                cache: false
            }).done(function(data) {
                $.each(data['Backgrounds'], function(index, url) {
                    var html;
                    if (url == 'default') html = '<a data-url="' + url + '"></a>';
                    else html = '<a data-url="' + url + '" style="background-image: url(' + url + ');"></a>';
                    $('.page[data-page="Background"] .options .custom').before(html);
                });

                // set selected
                if ($('.page[data-page="Background"] .options a[data-url="' + $('input[data-pref="background.image"]').val() + '"]').length > 0) $('.page[data-page="Background"] .options a[data-url="' + $('input[data-pref="background.image"]').val() + '"]').addClass('selected');
                else {
                    $('.page[data-page="Background"] .options a.custom').attr('data-url', $('input[data-pref="background.image"]').val()).addClass('selected');
                }
            });
        }

        else if (pageName == 'Header') {
            $('.page[data-page="Header"] .options').on('click', 'a[data-url][data-base-url]', function() {
                if ($(this).hasClass('custom')) {
                    $('.model.header input[placeholder="Back Image URL"]').val($(this).attr('data-base-url'));
                    $('.model.header input[placeholder="Front Image URL"]').val($(this).attr('data-url'));
                    $('body').addClass('model-header');
                    return;
                }

                var base = $(this).attr('data-base-url');
                if (base == 'default') $('#preview .header').attr('style', '');
                else $('#preview .header').css('background-image', 'url(' + base + ')');
                
                var image = $(this).attr('data-url');
                if (image == 'default') $('#preview .header .wrap').attr('style', '');
                else $('#preview .header .wrap').css('background-image', 'url(' + image + ')');

                $('.page[data-page="Header"] .options a.selected').removeClass('selected');
                $(this).addClass('selected');
                
                $('input[data-pref="header.background.base"]').val(base).change();
                $('input[data-pref="header.background"]').val(image).change();
            });

            $('.model.header .action').on('click', function() {
                var base = $('.model.header input[placeholder="Back Image URL"]').val();
                var image = $('.model.header input[placeholder="Front Image URL"]').val();

                $('#preview .header').css('background-image', 'url(' + base + ')');
                $('#preview .header .wrap').css('background-image', 'url(' + image + ')');
                
                $('.page[data-page="Header"] .selected').removeClass('selected');
                $('.page[data-page="Header"] .custom').attr({'data-url': image, 'data-base-url': base}).addClass('selected');
                
                $('input[data-pref="header.background.base"]').val(base).change();
                $('input[data-pref="header.background"]').val(image).change();
                $('body').removeClass('model-header');
            });

            $.ajax({
                type: 'GET',
                url: 'headers.json',
                dataType: 'text json',
                cache: false
            }).done(function(data) {
                // get host prefix
                var host = data['info']['host'];
                delete data['info'];

                // add header options to page
                $.each(data, function(key, headers) {
                    // Add title
                    $('.page[data-page="Header"] .options').prepend('<h3>' + key + '</h3><div class="h' + key + '"></div>');

                    // Add headers
                    $.each(headers, function(name, url) {
                        // check if url needs prefix
                        if (url[0] != 'default' && url[0].substring(0,7) != 'http://' && url[0].substring(0,19) != 'chrome-extension://') url[0] = host + url[0];
                        if (url[1] != 'default' && url[1].substring(0,7) != 'http://' && url[1].substring(0,19) != 'chrome-extension://') url[1] = host + url[1];
                        $('.page[data-page="Header"] .options .h' + key).append('<a data-url="' + url[0] + '" data-base-url="' + url[1] + '" title="' + name + '">' + name + '</a>');
                    });
                });

                // set selected
                if ($('.page[data-page="Header"] .options a[data-url="' + $('input[data-pref="header.background"]').val() + '"][data-base-url="' + $('input[data-pref="header.background.base"]').val() + '"]').length > 0) {
                    $('.page[data-page="Header"] .options a[data-url="' + $('input[data-pref="header.background"]').val() + '"][data-base-url="' + $('input[data-pref="header.background.base"]').val() + '"]').addClass('selected');
                }
                else {
                    $('.page[data-page="Header"] .options a.custom').attr({
                        'data-url': $('input[data-pref="header.background"]').val(),
                        'data-base-url': $('input[data-pref="header.background.base"]').val()
                    }).addClass('selected');
                }
            });
        }
        else if (pageName == 'Logo') {
            $('.page[data-page="Logo"] .options').on('click', 'a[data-url]', function() {
                if ($(this).hasClass('custom')) {
                    $('.model.logo input[placeholder="URL"]').val($(this).attr('data-url'));
                    $('body').addClass('model-logo');
                    return;
                }

                var image = $(this).attr('data-url');
                if (image == 'default') $('#preview .header .wrap .logo').attr('style', '');
                else $('#preview .header .wrap .logo').css('background-image', 'url(' + image + ')');
                $(this).parent().children('.selected').removeClass('selected');
                $(this).addClass('selected');
                
                $('input[data-pref="header.logo"]').val(image).change();
            });

            $('.model.logo .action').on('click', function() {
                var image = $('.model.logo input[placeholder="URL"]').val();
                $('#preview .header .wrap .logo').css('background-image', 'url(' + image + ')');

                $('.page[data-page="Logo"] .selected').removeClass('selected');
                $('.page[data-page="Logo"] .custom').attr('data-url', image).addClass('selected');

                $('input[data-pref="header.logo"]').val(image).change();
                $('body').removeClass('model-logo');
            });
            
            // set selected
            if ($('.page[data-page="Logo"] .options a[data-url="' + $('input[data-pref="header.logo"]').val() + '"]').length > 0) $('.page[data-page="Logo"] .options a[data-url="' + $('input[data-pref="header.logo"]').val() + '"]').addClass('selected');
            else {
                $('.page[data-page="Logo"] .options a.custom').attr('data-url', $('input[data-pref="header.logo"]').val()).addClass('selected');
            }
        }

        else if (pageName == 'PostFormat') {
            $('.page[data-page="PostFormat"] .formats').append(formatsTemplate(prefs['format.list'])).sortable({
                handle: 'strong',
                forcePlaceholderSize: true
            }).bind('sortupdate', function(e, ui) {
                $('.page[data-page="PostFormat"] .save').show();
            });
            

            $('.page[data-page="PostFormat"] .save').on('click', function() {
                var formats = [];
                $('.page[data-page="PostFormat"] fieldset .format').each(function() {
                    var name = $(this).find('strong').text();
                    var bbcode = $(this).attr('data-bbcode');
                    var style = $(this).attr('data-poststyle');
                    formats.push([name, bbcode, parseInt(style, 10)]);
                });

                chrome.storage.local.set({'format.list': formats}, function() {
                    $('.page[data-page="PostFormat"] .save').hide();
                });
            });
            
            $('.page[data-page="PostFormat"] .add').on('click', function() {
                $('.page[data-page="PostFormat"] .save').show();
                $('.page[data-page="PostFormat"] fieldset .formats').append(formatsTemplate([['', '', 0]])).sortable('reload');
            });

            $('.page[data-page="PostFormat"] .formats').on('click', '.delete', function() {
                $('.page[data-page="PostFormat"] .save').show();
                $(this).parentsUntil('.formats').remove();
            });

            $('.page[data-page="PostFormat"] .formats').on('click', '.edit', function() {
                $('.page[data-page="PostFormat"] .save').show();

                var format = $(this).parentsUntil('.formats', '.format');
                $('.page[data-page="PostFormat"] .format.editing').removeClass('editing');
                format.addClass('editing');
                $('.model.format input').val(format.find('strong').text());
                $('.model.format textarea').val(decodeURI(format.attr('data-bbcode')));
                $('.model.format select').val(format.attr('data-poststyle'));
                $('body').addClass('model-format');
            });

            $('.model.format .action').on('click', function() {
                $('.page[data-page="PostFormat"] .format.editing strong').text($('.model.format input').val());
                $('.page[data-page="PostFormat"] .format.editing').attr({
                    'data-bbcode': encodeURI($('.model.format textarea').val()),
                    'data-poststyle': $('.model.format select').val()
                });
                
                $('.page[data-page="PostFormat"] .format.editing').removeClass('editing');
                $('body').removeClass('model-format');
            });
        }

        else if (pageName == 'UserTags') {
            $('.page[data-page="UserTags"] fieldset').append(usertagsTemplate(prefs['usertags.list']));
            
            $('.page[data-page="UserTags"] fieldset').on('click', '.delete', function() {
                $('.page[data-page="UserTags"] .save').show();
                $(this).parentsUntil('fieldset').remove();
            });

            $('.page[data-page="UserTags"] .save').on('click', function() {
                var tags = {};
                $('.page[data-page="UserTags"] .usertag').each(function() {
                    var userid = $(this).attr('data-userid');
                    var tag = JSON.parse(decodeURI($(this).attr('data-tag')));
                    tags[userid] = tag;
                });

                chrome.storage.local.set({'usertags.list': tags}, function() {
                    $('.page[data-page="UserTags"] .save').hide();
                });
            });
        }

        else if (pageName == 'About') {
            // nothing at the moment
            $('.page[data-page="About"] .version').text(prefs.version);

            $('.page[data-page="About"] .reset').on('click', function() {
                $('body').addClass('model-reset');
            });

            $('.model.reset a.action').on('click', function() {
                localStorage.clear();
                chrome.storage.local.clear(function(){
                    chrome.storage.sync.clear(function(){
                        chrome.runtime.reload();
                    });
                });
                $('body').removeClass('model-reset');
            });
        }
    },
    
    transfer: function() {
        // Get old settings
        chrome.storage.sync.get(null, function(response) {
            var prefsToMigrate = {'2015transfer': true};

            for (var key in response) {
                console.log(key + ' ' + response[key]);
                try {
                    // skip if not in current list of prefs
                    if (typeof prefs.default[key] == 'undefined') continue;
                    else if (key == 'format.list') {
                        if ($.isEmptyObject(response['format.list'])) continue;
                    }
                    else if (key == 'header.shortcuts.list') {
                        if ($.isEmptyObject(response['header.shortcuts.list'])) continue;
                    }
                    else if (key == 'usertags.list') {
                        if ($.isEmptyObject(response['usertags.list'])) continue;
                    }
                    // Add if not default
                    if (JSON.stringify(response[key]) != JSON.stringify(prefs.default[key])) prefsToMigrate[key] = response[key];
                }
                catch(e) {
                    // if not in the list of prefs
                    console.log(e);
                }
            }

            // Send to local Chrome Storage
            console.log(prefsToMigrate);
            chrome.storage.local.set(prefsToMigrate, function() {
                location.reload();
            });
        });
    },

    onload: function() {
        // Save a default
        prefs.default = JSON.parse(JSON.stringify(prefs));

        // Get settings
        chrome.storage.local.get(null, function(response) {
            for (var key in response) {
                try {prefs[key] = response[key];}
                catch(e) {console.warn('Missing pref \'' + e + '\'.');}
            }

            try {Settings.init();}
            catch(e) {debugBro(e);}
        });
    },

    init: function() {
        // check if transfer needed
        chrome.storage.sync.get(null, function(response) {
            if (!$.isEmptyObject(response) && prefs['2015transfer'] === false) {
                $('.page[data-page="About"] .transferInfo').show();
                $('#nav a[href="#About"]').addClass('alert');

                $('.page[data-page="About"] .transferInfo a').on('click', function() {
                    Settings.transfer();
                });
            }
        });

        // Save prefs
        $('#pages').on('change', '.page.loaded *[data-pref]', function() {
            var pref = $(this).attr('data-pref'), save = {};

            // Checkbox
            if ($(this).attr('type') == 'checkbox') save[pref] = $(this).is(':checked');
            // Select, Textbox
            else save[pref] = $(this).val();

            // Change menu visiblity
            if (pref == 'header.shortcuts') {
                if (save[pref] === false) $('#nav a[href="#Shortcuts"]').parent().hide();
                else $('#nav a[href="#Shortcuts"]').parent().show();
            }
            else if (pref == 'format') {
                if (save[pref] === false) $('#nav a[href="#PostFormat"]').parent().hide();
                else $('#nav a[href="#PostFormat"]').parent().show();
            }
            else if (pref == 'usertags') {
                if (save[pref] === false) $('#nav a[href="#UserTags"]').parent().hide();
                else $('#nav a[href="#UserTags"]').parent().show();
            }

            // Change notifications
            else if (pref == 'notifications') {
                if (save[pref] == '0') {
                    chrome.alarms.clear('gaia-notifications');
                    chrome.notifications.clear('gaia-notify', function() {});
                }
                else {
                    chrome.alarms.create('gaia-notifications', {when: 0, periodInMinutes: parseInt(save[pref], 10)});
                }
            }

            // Preview
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
            else if (pref == 'forum.postHeader') $('#preview .body .username').css('background-color', save[pref]);

            // Chrome Storage
            if (prefs.default[pref] == save[pref]) chrome.storage.local.remove(pref);
            else chrome.storage.local.set(save);
        });
        
        // Menu
        $('#nav .pure-menu').on('click', 'a[href]', function() {
            if ($(this).hasClass('selected')) return false;
            else {
                $('#pages .page.selected, #nav .pure-menu a.selected').removeClass('selected');

                var pageName = $(this).attr('href').substring(1),
                    page = $('#pages .page[data-page="' + pageName + '"]');
                if (!page.hasClass('loaded')) {
                    try {Settings.pageInit(pageName);}
                    catch(e) {debugBro(e);}
                    page.addClass('loaded');
                }
                page.addClass('selected');
                $(this).addClass('selected');
            }
        });

        // Change menu visiblity
        if (prefs['header.shortcuts'] === false) $('#nav a[href="#Shortcuts"]').parent().hide();
        if (prefs['format'] === false) $('#nav a[href="#PostFormat"]').parent().hide();
        if (prefs['usertags'] === false) $('#nav a[href="#UserTags"]').parent().hide();

        // Hashes
        $(window).on('hashchange', function() {
            if (window.location.hash === '') $('#nav .pure-menu a[href="#Home"]').click();
            else $('#nav .pure-menu a[href="' + window.location.hash + '"]').click();
        });

        if (window.location.hash === '') $('#nav .pure-menu a[href="#Home"]').click();
        else $('#nav .pure-menu a[href="' + window.location.hash + '"]').click();

        // Models
        $('.model .text-right a.cancel').on('click', function() {
            $('body').attr('class', '');
        });
        
        // Preview
        var background = {
            'background-repeat': (prefs['background.repeat'])? 'repeat':'no-repeat',
            'background-position': prefs['background.position'],
            'background-color': prefs['background.color'],
            'background-image': 'url(' + prefs['background.image'] + ')'
        };
        $('#preview').css(background);
        if (prefs['header.background.base'] != 'default') $('#preview .header').css('background-image', 'url(' + prefs['header.background.base'] + ')');
        if (prefs['header.background'] != 'default') $('#preview .header .wrap').css('background-image', 'url(' + prefs['header.background'] + ')');
        if (prefs['header.logo'] != 'default') $('#preview .header .wrap .logo').css('background-image', 'url(' + prefs['header.logo'] + ')');
        if (prefs['header.nav'] != prefs.default['header.nav']) $('#preview .nav, #preview .header .wrap .username').css('background-color', prefs['header.nav']);
        if (prefs['header.nav.hover'] != prefs.default['header.nav.hover']) $('#preview .nav a:nth-of-type(3)').css('background-image', 'radial-gradient(ellipse at bottom center, ' + prefs['header.nav.hover'] + ', transparent 95%)');
        if (prefs['header.nav.current'] != prefs.default['header.nav.current']) $('#preview .nav a:first-child').css('background-image', 'radial-gradient(ellipse at bottom center, ' + prefs['header.nav.current'] + ', transparent 95%)');
        if (prefs['forum.threadHeader'] != prefs.default['forum.threadHeader']) $('#preview .body .linklist').css('background-color', prefs['forum.threadHeader']);
        if (prefs['forum.postHeader'] != prefs.default['forum.postHeader']) $('#preview .body .username').css('background-color', prefs['forum.postHeader']);
    }
};

// Run
try {Settings.onload();}
catch(e) {debugBro(e);}
