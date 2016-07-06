/*
BetterGaia by bowafishtech
Copyright (c) BetterGaia and Bowafishtech
Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.
*/
/*global require: false, console: false */
/*jshint sub:true */

// Import APIs
var pageMod = require('sdk/page-mod');
var Request = require('sdk/request').Request;
var self = require('sdk/self');
var ss = require('sdk/simple-storage');
var tabs = require('sdk/tabs');

// Create page mod
pageMod.PageMod({
    include: '*.gaiaonline.com',
    contentScriptWhen: 'start',
    attachTo: ['top'],
    contentScriptFile: [self.data.url('assets/jquery.min.js'), self.data.url('assets/mustache.js'), self.data.url('assets/bridge.js'), self.data.url('assets/bettergaia.js')],
    contentScriptOptions: {
        storage: ss.storage,
        mainCssUrl: self.data.url('css/main.css')
    },
    onAttach: function(worker) {
        worker.port.on('set', function(data) {
            ss.storage[data[0]] = data[1];
            worker.port.emit({'success': true});
        });
        worker.port.on('remove', function(key) {
            delete ss.storage[key];
        });
        worker.port.on('settings', function() {
            tabs.open(self.data.url('settings/main.html'));
        });
        worker.port.on('getHtml', function(url) {
            worker.port.emit(url, self.data.load(url));
        });
        worker.port.on('path', function(url) {
            worker.port.emit(url, self.data.url(url));
        });
    }
});