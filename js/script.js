$( document ).ready(function() {

function getVersion() {
    var details = chrome.app.getDetails();
    return details.version;
}
$(".version").html('<a href="help.html" target="_Blank">Help</a> | <a href="Backup.html" target="_Blank">Backup</a> | <a href="Restore.html" target="_Blank">Restore</a> | <a href="Changelog.html" target="_Blank">Changelog</a> | v'+getVersion());
	chrome.storage.sync.get('Data', function(data) {
	$('.ImportSubmit').click(function(formevent) {
		formevent.preventDefault();
		var DecodedData = JSON.parse(atob($('.EncodedData').val()));
		chrome.storage.sync.get(function(cfg) {
			cfg["Data"] = DecodedData;
			chrome.storage.sync.set(cfg);
			$('.debug').html("<h3>"+DecodedData.length+" Bookmarks imported</h3>");
		});
	});
	if(data["Data"] && data["Data"].length > 0) {
		for (i = 0; i < data["Data"].length; i++) { 
			var DataURL = data["Data"][i]["VodTimestamp"];
			var DataTS = data["Data"][i]["Timestamp"];
			var DataTitle = data["Data"][i]["Title"];
			var DataBID = data["Data"][i]["BID"];
			var DataStreamer = data["Data"][i]["Streamer"];
			if(DataTitle.length > 20) {
				DataTitle = DataTitle.substring(0,24)+"...";
			}
			$(".status").append('<div class="datadiv"><a href=""  class="remove" id="'+i+'"></a>'+DataStreamer+': <a href="'+DataURL+'" target="_Blank">'+DataTitle+' Time:'+DataTS+'</a></div>');
		}
		$(".remove").click(function() {
			var index = $(this).attr("id");
			data["Data"].splice(index, 1);
				chrome.storage.sync.get(function(cfg) {
					cfg["Data"] = data["Data"];
					chrome.storage.sync.set(cfg);
				});
		});
	$(".BackupExport").append(btoa(JSON.stringify(data["Data"])));
	} else {
		$(".status").append('<div class="error">Aww...no bookmarks :(</div>');
	}
	});
});