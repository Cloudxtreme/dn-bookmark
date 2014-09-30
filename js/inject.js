$( document ).ready(function() {
$("span:contains('Bookmark')").hide();
$(".channel-actions").append('<span class="ember-view button action" id="dnbookmark"><span>Bookmark</span></span>');
$("#dnbookmark").click(function(event) {
	var cname = $(".channel-name").attr( "href" ).split('/');
	var StreamName = cname[1];
	$.getJSON("https://api.twitch.tv/kraken/streams/"+StreamName, function(data) {
	if (data.stream) {
		var BroadcastName = $(".real").text();
		var BroadcastApiUrl = "https://api.twitch.tv/kraken/channels/"+StreamName+"/videos?broadcasts=true";
		var BroadcastID = data.stream._id;
		var now  = moment().format('MMMM Do YYYY, h:mm:ss a');
		var then = moment(data.stream.created_at).format('MMMM Do YYYY, h:mm:ss a');
		var checkhour = moment.utc(moment(now,"MMMM Do YYYY, h:mm:ss a").diff(moment(then,"MMMM Do YYYY, h:mm:ss a"))).format("HH");
		var checkmin = moment.utc(moment(now,"MMMM Do YYYY, h:mm:ss a").diff(moment(then,"MMMM Do YYYY, h:mm:ss a"))).format("mm");
		if (checkhour == 00) {
			var diff = moment.utc(moment(now,"MMMM Do YYYY, h:mm:ss a").diff(moment(then,"MMMM Do YYYY, h:mm:ss a"))).format("mm[m]ss[s]");
		} else {
			var diff = moment.utc(moment(now,"MMMM Do YYYY, h:mm:ss a").diff(moment(then,"MMMM Do YYYY, h:mm:ss a"))).format("h[h]mm[m]ss[s]");
		}
		if (checkhour+checkmin <= 0030) {
			alert("cannot bookmark right now. stream is less than 30 minutes old. Stream Time: " + diff);
		} else {
			$.getJSON(BroadcastApiUrl, function(data) {
			var VideoBroadcastID = data.videos[0].broadcast_id;
			var VideoID = data.videos[0]._id.replace(/[^0-9]/g, "");
			var VideoURL = "http://www.twitch.tv/"+StreamName+"/b/"+VideoID;
			var TimestampURL = "http://www.twitch.tv/"+StreamName+"/b/"+VideoID+"?t="+diff;
			var DataArray = {Timestamp:diff,VodTimestamp:TimestampURL,Title:BroadcastName,BID:VideoBroadcastID, Streamer:StreamName};
				chrome.storage.sync.get(function(cfg) {
					if(typeof(cfg["Data"]) !== 'undefined' && cfg["Data"] instanceof Array) { 
						cfg["Data"].push(DataArray);
				} else {
					cfg["Data"] = [DataArray];
				}
					chrome.storage.sync.set(cfg); 
				});
			});
			}	
		} else {
			alert("offline");
		}
	});	
});
});
