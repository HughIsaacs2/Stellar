"use strict";
document.documentElement.className=document.documentElement.className.replace("no-js","js");
window.scrollTo(0, 0);
window.scrollTo(0, 1);

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
      var subjectString = this.toString();
      if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
        position = subjectString.length;
      }
      position -= searchString.length;
      var lastIndex = subjectString.indexOf(searchString, position);
      return lastIndex !== -1 && lastIndex === position;
  };
}

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

		var torrentClient = new WebTorrent();
		var torrentId = "";
		var playlist = "";

function loadTorrent(urlToLoad) {

torrentId = urlToLoad;

document.documentElement.className=document.documentElement.className.replace("not-loading","loading");

document.getElementById("browser").src = "loading.html";

/* Start download */
torrentClient.add(torrentId, {announce:["wss://tracker.btorrent.xyz", "wss://tracker.fastcast.nz", "wss://tracker.openwebtorrent.com"]}, function (torrent) {
  // Got torrent metadata!
  console.log('Client is downloading:', torrent.infoHash);
  
  document.title = "Web Torrent Site [" + torrent.infoHash + "]";

  document.getElementById("info").innerHTML+="<sub>"+torrent.infoHash + "</sub><br/><br/><sub>" + torrent.magnetURI + "</sub><br/>";
  
  		var a = document.createElement('a');
		a.href = torrent.magnetURI;
		a.textContent = 'Magnet Link: ' + torrent.infoHash;
		a.className = "button download-link";
		document.getElementById("links").appendChild(a);

/* Remove #loading when first file is displayed */
torrent.files[0].getBlobURL(function (err, url) {
	  if (err) { throw err }
});

 torrent.files.forEach(function (file) {
 
  file.getBlobURL(function (err, url) {
    if (err) { throw err }
	if (file.name === 'index.html') {
        
        document.getElementById("browser").src = url;
		
		var a = document.createElement('a');
		a.href = url;
		a.textContent = 'Download ' + file.name;
		a.className = "button download-link";
		document.getElementById("links").appendChild(a);
	  
	  } /* else if (file.name.endsWith(".mp3") || file.name.endsWith(".m4a") || file.name.endsWith(".aac") || file.name.endsWith(".ogg")) */ else {
    
    var a = document.createElement('a');
    a.href = url;
    a.textContent = 'Download ' + file.name;
    a.className = "button download-link";
    document.getElementById("links").appendChild(a);
	}
	
	
  });
	
 });

/* Display download status */
torrent.on('download', function(chunkSize){
  /* console.log('chunk size: ' + chunkSize);
  console.log('total downloaded: ' + torrent.downloaded);
  console.log('download speed: ' + torrent.downloadSpeed);
  console.log('progress: ' + torrent.progress);
  console.log('======');
  */
  document.getElementById("log").innerHTML='chunk size: ' + chunkSize + '<br/>' + 'total downloaded: ' + torrent.downloaded + '<br/>' + 'total uploaded: ' + torrent.uploaded + '<br/>' + 'download speed: ' + torrent.downloadSpeed + '<br/>' + 'upload speed: ' + torrent.uploadSpeed + '<br/>' + 'progress: ' + torrent.progress + '<br/>' + 'peers: ' + torrent.numPeers + '<br/>' + 'path: ' + torrent.path + '<br/>';
  document.getElementById("progress").textContent=torrent.progress;
  document.getElementById("progress").title=torrent.progress;
  document.getElementById("progress").value=torrent.progress;
});

/* When peer connected */
torrent.on('wire', function (wire, addr) {
  console.log('connected to peer with address ' + addr);
});

/* Torrent finished event */
torrent.on('done', function(){
  console.log('Web Torrent finished downloading');
  
    document.documentElement.className=document.documentElement.className.replace("loading","not-loading");
  
  torrent.files.forEach(function(file){
  
  });
});
  
});

}

	var currentTLD = location.hostname.split(".").pop();
	var currentURLhostNoTLD = location.hostname.split(".")[0];
	
	if (currentTLD == 'torrent_site') {
		loadTorrent(currentURLhostNoTLD);
	};