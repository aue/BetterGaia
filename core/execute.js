console.log('Mounting BetterGaia...');
BetterGaia.loadPrefs(function() {
  BetterGaia.mount();
});

window.addEventListener('unload', function(event) {
  console.log('Unmounting BetterGaia...');
  BetterGaia.unMount();
});
