// Copyright (c) BetterGaia
// Unauthorized copying, sharing, adaptation, publishing, commercial usage, and/or distribution, its derivatives and/or successors, via any medium, is strictly prohibited.

// Check if install, update
browser.runtime.onInstalled.addListener(function(details) {
  var currentVersion = browser.runtime.getManifest().version;
  if (details.reason == 'install') {
    browser.storage.local.set({version: currentVersion});
  }
  else if (details.reason == 'update') {
    browser.storage.local.set({version: currentVersion});
  }
});
