var config =require('./dbconnection.json');
var mysql = require('mysql');
var request = require('ajax-request');

var pool  = mysql.createPool(config);

var Subscriber={
 
subscribe:function(subscriberId, walletAddress, email, callback){
	pool.getConnection(function(err, connection) {
		if(err) {
	        console.log(err);
	      } else {
	      	var data = [walletAddress, subscriberId, email, 'admin', 'admin'];
	        connection.query("INSERT INTO user_subscription (wallet_address, subscriber_id, email, created_user, last_modified_user) VALUES  ? ON DUPLICATE KEY UPDATE subscriber_id = VALUES(subscriber_id), email = VALUES(email)", [[data]], function (error, results, fields) {
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

notifyAll:function(key, notifDetails, callback){
	pool.getConnection(function(err, connection) {
		if(err) {
	        console.log(err);
	      } else {
	        connection.query('SELECT subscriber_id FROM user_subscription', function (error, results, fields) {
	          connection.release();
	          if (error) {
	            console.log(error);
	          } else {
	          	if(results.length > 0){
	          		var subscribers = [];
	          		for(var i=0; i<results.length; i++){
	          			subscribers.push(results[i].subscriber_id);
					}
	          		sendNotifications(key, notifDetails, subscribers, callback)
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


function sendNotifications(key, notifDetails, subscribers, callback){
	request({
      url: 'https://android.googleapis.com/gcm/send',
      method: 'POST',
      data: {
        registration_ids: subscribers,
        data: notifDetails
      },
      headers: {
      	'Authorization' : key,
      	'Content-Type' : 'application/json'
      }
    }, function(err, res, body) {
      try {
        var response = JSON.parse(body);
        if(err){
          errorCallBack(err);
        } else {
          callback(response);
        }
      } catch(error){
        errorCallBack(error);
      }
    });
}