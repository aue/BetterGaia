// Send data to scripts
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.elements == 'format') {chrome.tabs.executeScript(sender.tab.id, {file: 'code/js/format.js'});}
    else if (request.elements == 'settings') {
        var optionsUrl = chrome.runtime.getURL('settings/main.html');
        chrome.tabs.query({url: optionsUrl}, function(tabs) {
            if (tabs.length) chrome.tabs.update(tabs[0].id, {active: true});
            else chrome.tabs.create({url: optionsUrl});
        });
    }
    else if (request.elements == 'reset') {sendResponse({'reset': true});}
});
