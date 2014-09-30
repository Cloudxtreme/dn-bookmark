$( document ).ready(function() {
	chrome.storage.sync.get('Data', function(data) {
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
		$(".datadiv").click(function() {
			var index = $(this).attr("id");
			data["Data"].splice(index, 1);
				chrome.storage.sync.get(function(cfg) {
					cfg["Data"] = data["Data"];
					chrome.storage.sync.set(cfg);
				});
		});
	} else {
		$(".status").append('<div class="error">Aww...no bookmarks :(</div>');
	}
	});


});