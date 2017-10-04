"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 1);

navigator.registerProtocolHandler("magnet", "/redirector.html#%s", "Magnet");
//navigator.registerProtocolHandler("web+magnet", "/redirector.html#%s", "Magnet");
navigator.registerProtocolHandler("web+dat", "/redirector.html#%s", "Dat");

var torrentInURL = window.location.hash.split('#')[1];

		var torrentClient = new WebTorrent();
		var torrentId = "";

function getTorrent(torrentURL) {
	
	torrentId = torrentInURL;

torrentClient.add(torrentId, {}, function (torrent) {
  // Got torrent metadata!
  console.log('Redirecting to torrent ' + torrent.infoHash);

  document.title = "Web Torrent Site [" + torrent.infoHash + "]";

	window.setTimeout( top.location.replace('http://' + torrent.infoHash + '.torrent_site/'), 1 );

});

}
	
if(window.location.hash){
	getTorrent(torrentInURL);
}