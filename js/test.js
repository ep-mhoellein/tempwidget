// $(document).ready(function(){



// var getTimeObject = {

//    handleData : function()
//    {
//        var timestamp;
//        var zeit;
//        var globaltimestamp;
//        this.getTimeFromServer(function(dates)
//        {
// 		zeit = dates;
// 		timestamp = Date.parse(zeit);
// 		console.log('handleData', zeit);
// 		console.log('handleData here', Date.parse(zeit));
// 		return timestamp;
//        });
//    },

//    getTimeFromServer : function(cb)
//    {
//    	 return  $.ajax({
// 			    type: 'GET',
// 			    url: 'http://www.timeapi.org/utc/now.json?callback=?',
// 			    async: true,
// 			    jsonpCallback: 'jsonCallback',
// 			    contentType: "application/json",
// 			    dataType: 'jsonp',
// 			    success: function(json) {
// 			       var dates = json.dateString;	
// 			       cb(dates);
// 			      // console.log('success', json);
// 			    },
// 			    error: function(e) {
// 			       console.log('An AJAX error occured: ', e.message);
// 			     }
// 			});

// 	   }
	   
	   

// 	}

// 	getTimeObject.handleData();


// // });	

// // var timestamp;
// // var zeit;
window.onload = makeRequest;

var xhr = false;

function makeRequest(){
	if(window.XMLHttpRequest){
		xhr = new XMLHttpRequest();
	}
	else {
		if(window.ActiveXObject){
			try{
				xhr = new ActiveXObject("Microsoft.XMLHTTP");
			}
			catch(e){ }
		}
	}

	if (xhr){
		xhr.open("GET", "http://ep6pi:8091", true);
		xhr.send(null);
		xhr.onreadystatechange = showContents;
	}
	else{
		document.getElementById("temp1").innerHTML = "Sorry, no Request possible";
	}
}



function showContents(){
	if (xhr.readyState == 4){
		if(xhr.status == 200){
			var outMsg = xhr.responseText;
		}
		else{
			var outMsg = "There was a problem with the request " + xhr.status;
		}
		document.getElementById("temp1").innerHTML = outMsg + "blabla";
	}
}

// var timestamp, zeit;

// getTimeFromServer(handleData);


// function getTimeFromServer (cb) {
// 	$.ajax({
// 	   type: 'GET',
// 	    url: 'http://www.timeapi.org/utc/now.json?callback=?',
// 	    async: false,
// 	    jsonpCallback: 'jsonCallback',
// 	    contentType: "application/json",
// 	    dataType: 'jsonp',
// 	    success: handleData
// 	});
// }

// function handleData(json){
// 	document.getElementById('temptest').innerHTML += json.dateString;
// 	zeit = json.dateString;
// 	timestamp = Date.parse(zeit);
// 	console.log('handleData', zeit);
// 	console.log('handleData', Date.parse(zeit));
// }

// var timestamp, zeit;

// function getTimeFromServer (cb, timestamp) {
// 	zeit = 2* timestamp;
// 	$.ajax({
// 	   type: 'GET',
// 	    url: 'http://www.timeapi.org/utc/now.json?callback=?',
// 	    async: false,
// 	    jsonpCallback: 'jsonCallback',
// 	    contentType: "application/json",
// 	    dataType: 'jsonp',
// 	    success: function(json) {
// 	       cb(json.dateString);
// 	       console.log('success', json);
// 	    },
// 	    error: function(e) {
// 	       console.log('An AJAX error occured: ', e.message);
// 	    }
	 
	    
// 	});
// 	console.log('global', zeit);
// }

// //timestamp = json.datestring

// // getTimeFromServer(function (timestamp) {

// //     zeit = timestamp;
// // 	console.log(new Date().getTime());
// // 	console.log('timestamp', timestamp);
// // 	console.log('parse', Date.parse(timestamp));
// // 	console.log(new Date(timestamp).getHours());
// // });


// });	
window.onload = function(){

		var num = Math.round(100000*Math.random());
		var callbackMethodName = "cb_" + num;
		console.log('num', callbackMethodName);
		window[callbackMethodName] = function(data){
			console.log(data);
		}

			var sc = document.createElement('script');
			sc.id = "script_" + callbackMethodName;
			sc.src = 'http://vinod.co/rest/contactsjp.php?callback='
			          + callbackMethodName;
            //data loads to website  
			document.body.appendChild(sc);
			//data finished loading with callback and tag is 
			document.getElementById(sc.id).remove();         
			console.log(sc);

	};




