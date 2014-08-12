/*
bettergaia.js
cross browser framework for browser extension apis
inspired by xkit
Copyright (c) BetterGaia and Bowafishtech
*/
/*global localStorage: false, console: false, $: false, chrome: false, BetterGaia: false, Storage: false */
/*jshint sub:true */

//BetterGaia.insert.css('body {border: 10px solid orange;}');

function settingsOpen() {
    $.get(BetterGaia.path('assets/settingsEmbed.html'), function(data) {
        $('html').append(data);
        BetterGaia.settings.init();
        
        if (Storage.data['extensions'] instanceof Array) {
            //BetterGaia.console.log(Storage.data['extensions']);
            
            for (var i = 0; i < Storage.data['extensions'].length; i++) {
                var extension = Storage.data['extensions'][i];

                $('#BGSPages .page.mybg .extensionsList').append('<a extension-id="' + extension.id + '">' + extension.title + '</a>');
            }
        }
        
    });
}

if (window.location.hash === '#!settings') settingsOpen();

$(window).on('hashchange', function() {
    if (window.location.hash === '#!settings') settingsOpen();
});