var config =require('./dbconnection.json');
var mysql = require('mysql');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var pool  = mysql.createPool(config);

var Subscriber={
 
subscribe:function(subscriberId, walletAddress, endPoint, email, callback){
	var browserType = 2;
	if(endPoint.indexOf('google') !== -1){
		browserType = 1;
	}
	pool.getConnection(function(err, connection) {
		if(err) {
	        console.log(err);
	      } else {
	      	var data = [walletAddress, subscriberId, endPoint, browserType, email, 'admin', 'admin'];
	        connection.query("INSERT INTO user_subscription (wallet_address, subscriber_id, end_point, browser_type, email, created_user, last_modified_user) VALUES  ? ON DUPLICATE KEY UPDATE subscriber_id = VALUES(subscriber_id), email = VALUES(email), end_point = VALUES(end_point), browser_type = VALUES(browser_type)", [[data]], function (error, results, fields) {
	          connection.release();
	          if (error) {
	            console.log(error);
	          } else {
	            callback(results);
	          }
	        });
	      }
	});
	
},

unsubscribe:function(subscriberId, callback){
	pool.getConnection(function(err, connection) {
		if(err) {
	        console.log(err);
	      } else {
	      	var data = [subscriberId];
	        connection.query("DELETE from user_subscription where subscriber_id = ? ", data, function (error, results, fields) {
	          connection.release();
	          if (error) {
	            console.log(error);
	          } else {
	            callback(results);
	          }
	        });
	      }
	});
},

notifyAll:function(key, callback){
	pool.getConnection(function(err, connection) {
		if(err) {
	        console.log(err);
	      } else {
	        connection.query('SELECT subscriber_id, browser_type FROM user_subscription', function (error, results, fields) {
	          connection.release();
	          if (error) {
	            console.log(error);
	          } else {
	          		var googSubscribers = [];
	          		var mozSubscribers = [];
	          		for(var i=0; i<results.length; i++){
	          			if(results[i].browser_type == '1') {
	          				googSubscribers.push(results[i].subscriber_id);
	          			}
		          		else if(results[i].browser_type == '2') {
	          				mozSubscribers.push(results[i].subscriber_id);
	          			}	
					}
					if(googSubscribers.length > 0) {
						sendGoogleNotifications(key, googSubscribers, mozSubscribers, callback)	
					} else if(mozSubscribers.length > 0){
						finalRes = {};
						finalRes["Mozilla"] = [];
						sendMozillaNotifications(finalRes, mozSubscribers, 0, callback)
					} else {
						callback({});
					}
	          }
	        });
	      }
	});
}

};

module.exports = Subscriber;


function sendGoogleNotifications(key, googSubscribers, mozSubscribers, callback){

	var http = new XMLHttpRequest();
	var url = "https://android.googleapis.com/gcm/send";
	http.open("POST", url, true);

	var params = {
        'registration_ids' : googSubscribers
      };
      
     http.setRequestHeader('Authorization', key);
     http.setRequestHeader('Content-Type', 'application/json');
     http.onreadystatechange = function() {//Call a function when the state changes.
      if(http.readyState == 4 && http.status == 200) {
          var finalRes = {};
          finalRes["Google"] = http.responseText;
          finalRes["Mozilla"] = [];
		  sendMozillaNotifications(finalRes, mozSubscribers, 0, callback);
      }
  	}
  	http.send(JSON.stringify(params));
}

function sendMozillaNotifications(finalRes, mozSubscribers, i, callback){
	if(i >= mozSubscribers.length){
		callback(finalRes);
	} else {
		var http = new XMLHttpRequest();
		var url = "https://updates.push.services.mozilla.com/wpush/v1/" + mozSubscribers[i];
		http.open("POST", url, true);
	    http.onreadystatechange = function() {//Call a function when the state changes.
	      if(http.readyState == 4 && http.status == 200) {
	          finalRes["mozilla"].push(http.responseText);
	          sendMozillaNotifications(finalRes, mozSubscribers, i+1, callback);
	      }
	  	}
	  	http.send();
	}
}
