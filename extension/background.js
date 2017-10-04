var server_app_id = chrome.runtime.getManifest().externally_connectable.ids[0];

chrome.omnibox.onInputChanged.addListener(function(text, suggest) {
    console.log('inputChanged: ' + text);
    suggest([
      {content: text + " one", description: "the first one"},
      {content: text + " number two", description: "the second entry"}
    ]);
});

chrome.omnibox.onInputEntered.addListener(function(text) {
    console.log('inputEntered: ' + text);
});

chrome.webNavigation.onBeforeNavigate.addListener(function(details) {
	var currentURLRequest = document.createElement('a');
	currentURLRequest.href = details.url;
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];

	if (currentTLD != 'torrent_site' && currentTLD != 'dat_site') {
		//Do nothing
	  } else {
	    chrome.runtime.sendMessage(server_app_id, { launch: true });
	    console.log('inputEntered: ' + details.url + "|" + currentTLD);
	  }
});
  
chrome.webRequest.onBeforeRequest.addListener(function(details) {
    var currentURLRequest = document.createElement('a');
	currentURLRequest.href = details.url;
	console.log(details.url);
	var currentTLD = currentURLRequest.hostname.split(".").pop();
	var currentURLhostNoTLD = currentURLRequest.hostname.split(".")[0];
	
	if (currentTLD != 'torrent_site' && currentTLD != 'dat_site') {
		return;
	} else { 
	//chrome.runtime.sendMessage(server_app_id, { launch: true }); 
	};
	
	var bithost = currentURLRequest.hostname;
	var port = "9989";
	var access = "PROXY";
	var bitip = "127.0.0.1";
	
	var config = {
		mode: "pac_script",
		pacScript: {
			data: "function FindProxyForURL(url, host) {\n" +
			"  if (dnsDomainIs(host, '"+bithost+"'))\n" +
			"    return '"+access+" "+bitip+":"+port+"';\n" +
			"  return 'DIRECT';\n" +
			"}"
		}
	};
	
	chrome.proxy.settings.set({value: config, scope: 'regular'},function() {});
	console.log('IP '+bitip+' for '+bithost+' found, config is changed: '+JSON.stringify(config));
	
	//var redirectBackup = "redirect.html#"+currentURLhostNoTLD;
    //return {cancel: true, redirectUrl: "redirect.html"};
}, {urls: ["*://*.torrent_site/*", "*://*.dat_site/*"]}, ["blocking"]);