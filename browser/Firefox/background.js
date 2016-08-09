// Copyright (c) BetterGaia
// Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.

// Check if install, update
browser.runtime.onInstalled.addListener(function(details) {
  if (details.reason == 'install') {
    browser.storage.local.set({version: currentVersion});
    _gaq.push(['_setCustomVar', 1, 'Install', currentVersion, 1]);
  }

  else if (details.reason == 'update') {
    browser.storage.local.set({version: currentVersion});
    _gaq.push(['_setCustomVar', 1, 'Update', `${details.previousVersion} => ${currentVersion}`, 1]);
  }
});

// Analytics
var currentVersion = browser.runtime.getManifest().version;
var _gaq = _gaq || [];
_gaq.push(['_setAccount', 'UA-32843062-1']);
_gaq.push(['_setCustomVar', 1, 'Version', currentVersion, 1]);
_gaq.push(['_trackPageview']);

(function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = 'https://ssl.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
