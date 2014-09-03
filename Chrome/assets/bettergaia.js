/*
bettergaia.js
cross browser framework for browser extension apis
inspired by xkit
Copyright (c) BetterGaia and Bowafishtech
*/
/*global localStorage: false, console: false, $: false, chrome: false, BetterGaia: false, Storage: false */
/*jshint sub:true */

//BetterGaia.insert.css('');

function settingsOpen() {
    $.get(BetterGaia.path('assets/settings.html'), function(data) {
        $('html').append(data);

        // Set up menu
        $('#BGSMenu').on('click', 'a:not(.active)', function() {
            var name = $(this).attr('data-link');
            $('#BGSMenu a.active, #BGSPages .page.active').removeClass('active');
            $('#BGSPages .page.' + name).addClass('active');
            $(this).addClass('active');
        });

        // List installed extensions
        if (Storage.data['extensions'] instanceof Array) {
            for (var i = 0; i < Storage.data['extensions'].length; i++) {
                var extension = Storage.data['extensions'][i];

                $('#BGSPages .page.mybg .extensionsList').append('<a extension-id="' + extension.id + '">' + extension.title + '</a>');
            }
        }

        // Get list of extensions
        $('#BGSMenu a[data-link="get"]').on('click.get', function() {
            $(this).off('click.get');
            $('#BGSPages .page.get').addClass('loaded');

            $.ajax({
                url: BetterGaia.serverUrl + 'framework/extensions/list.json',
                dataType: 'json'
            }).done(function(json) {
                $.each(json, function(key, data) {
                    $('#BGSPages .page.get ul').append('<li>\
                        <h2>' + data['title'] + '</h2>\
                        <strong>' + data['author'] + '</strong>\
                        <p>' + data['description'] + '</p>\
                        <p>Version ' + data['version'] + '</p>\
                        <p>Beta? ' + data['beta'] + '</p>\
                        <p>id: ' + key + '</p>\
                        <a class="install" data="' + key + '">Install</a>\
                    </li>');
                });
            }).fail(function(data) {
                $('#BGSPages .page.get').text('Could not get extensions list.');
            });
        });

        // install new extensions
        $('#BGSPages .page.get ul').on('click', 'li a.install', function() {
            $(this).text('Installing...');
            BetterGaia.install.extension($(this).attr('data'), function() {
                BetterGaia.console.log('Installed!');
            });
        });
    })
}

if (window.location.hash === '#bgsettings') settingsOpen();

$(window).on('hashchange', function() {
    if (window.location.hash === '#bgsettings') settingsOpen();
});
